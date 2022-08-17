const lexer = require('./tokens');

module.exports = {}

const alwaysOperators = ['+','*','/','==','<','>'];
const exitOperators = ['->','~>','\\>'];

//After lexing, go through and convert [-,{,[,frame,[,r,g,b,a,],],},->] into one wrapper operator to be reexpanded at the end.
//There will never be advanced expressions in here at least.

const williamTell = (sequence, index) => {
    if (sequence[index] === '-' && (sequence.length > index + 1 && sequence[index + 1] === '{')) {
        const group = ['-','{'];
        let pos = index + 2;
        let lastEncountered = '{';
        let curlies = 1;
        while (sequence.length > pos && (curlies === 0 && lastEncountered !== '}')) {
            lastEncountered = sequence[pos];
            if (lastEncountered === '{') {
                curlies ++;
            }
            if (lastEncountered === '}') {
                curlies --;
            }
            group.push(lastEncountered);
        }
        return group;
    }
    return [];
}

const infix =(sequence)=> {
    const output = []
    const operatorStack = []
    const reorderStack = []
    let consecutiveNonOperators = 0
    let reordering = false;
    let i = 0

    for (let i = 0 ; i < sequence.length ; i ++ ) {
        let expr = sequence[i];
        const williamTellGroup = williamTell(sequence, i);
        if (alwaysOperators.includes(expr) || williamTellGroup.length > 0 || exitOperators.includes(expr)){
            if (williamTellGroup.length > 0) {
                expr = williamTellGroup;
                i += williamTellGroup.length - 1;
            }
            if (!reordering) {
                // Take off the last thing we pushed to output
                reorderStack.push(output.pop());
            }

            reordering = true;
            consecutiveNonOperators = 0;

            // Push an operator onto the stack
            operatorStack.push(expr);
        } else {
            if (reordering) {
                // If true, we just dealt with an operator.
                // Push an additional item onto the reorder stack
                // and go to the next token
                reorderStack.push(expr);
                consecutiveNonOperators++;
                if (consecutiveNonOperators === 2) {
                    reordering = false;
                    consecutiveNonOperators = 0;

                    // If there are pending reorders, drain the reorder stacks
                    while (operatorStack.length > 0) {
                        output.push(operatorStack.pop());
                    }

                    output.push(...reorderStack);

                    reorderStack.splice(0, reorderStack.length);
                }
            } else {
                // push current value to output
                output.push(expr);
            }
        }
    }

    // ensure reorder stacks are empty before exiting the procedure
    while (operatorStack.length > 0) {
        output.push(operatorStack.pop());
    }

    output.push(...reorderStack);

    return output;
}
console.log(infix(lexer.lexer("3 + ")))
