module.exports = {

}

/**
 x = 5 // [x,=,5,\n,(same indent)]
 square n (int) -> int: n * n // [square,n,(,int,),->,int,:,n,*,n,\n,(same indent)]
 something x:
    y = 33
    z = 44
    x + y + z // [something,x,:,\n,\t (inward indent),y,=,33,\n,(same indent inside scope),z,=,44,\n,(same),x,+,y,+,z,\n,(no indent/unscope)]
 */

const isSpecial = (expression, idx, expectedFirst, expectedSecond) => {
    const first = expression[idx];
    if (idx >= expression.length) {
        return false;
    }
    const second = expression[idx + 1];
    return first === expectedFirst && second === expectedSecond;
}

const lexer = (expression) => {
    const handleUnclaimed = () => {
        if (unclaimed.length > 0) {
            lexemes.push(unclaimed);
            unclaimed = "";
        }
    }
    const lexemes = [];
    let quotes = 0;
    let unclaimed = "";
    let ignoreNext = false;
    for (let i = 0 ; i < expression.length ; i ++ ) {
        if (ignoreNext) {
            ignoreNext = false;
            continue;
        }
        const currentChar = expression[i];
        if (currentChar === '"' || currentChar === "'") {
            quotes ++;
            if (quotes % 2 === 1){
                unclaimed = currentChar;
            } else {
                unclaimed += currentChar;
                lexemes.push(unclaimed);
                unclaimed = "";
            }
        } else if (quotes % 2 === 1) {
            unclaimed += currentChar;
        } else if (['+','*','/','(',')',',','[',']',':','\n','\t','>','<'].includes(currentChar)) {
            handleUnclaimed();
            lexemes.push(currentChar);
        } else if (
            isSpecial(expression, i, '=','=') ||
            isSpecial(expression, i, '-','>') ||
            isSpecial(expression, i, '\\','>') ||
            isSpecial(expression, i, '~','>')
        ) {
            const operator = expression.slice(i,i + 2);
            handleUnclaimed();
            lexemes.push(operator);
            ignoreNext = true;
        } else if (['-','='].includes(currentChar)) {
            handleUnclaimed();
            lexemes.push(currentChar);
        } else if (currentChar !== ' '){
            unclaimed += currentChar;
        } else {
            handleUnclaimed();
        }
    }
    handleUnclaimed();
    return lexemes.filter( l => l.length > 0).map(l =>  l.replaceAll(" ",""));
}

console.log(lexer("x = 3"));
console.log(lexer("square n (int) -> int: n * n"))
console.log(lexer("something x:\n" +
    "\ty = 33\n" +
    "\tz = 44\n" +
    "\tx + y + z"));
console.log(lexer("arr -([frame [r g b a]])-> frame"))
