module.exports = {}

const alwaysOperators = ['+','*','/','==','<','>'];
const exitOperators = ['->','~>','\\>'];

//After lexing, go through and convert [-,{,[,frame,[,r,g,b,a,],],},->] into one wrapper operator to be reexpanded at the end.
//There will never be advanced expressions in here at least.

const williamTell = (sequence, index) => {
    if (sequence[index] === '-') {
        //go through and grab until exit operator is found if { is next.
    }
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
        let prev = i > 0 ? sequence[i - 1] : undefined;
        let next = i < sequence.length - 1 ? sequence[i + 1] : undefined;
        if (alwaysOperators.includes(expr) ||

        )
        if (narrowType(expr, DataType.Word) && narrowType(lookup(context, expr.identity), DataType.Op)) {
            if (!reordering) {
                // Take off the last thing we pushed to output
                reorderStack.push(output.pop()!)
            }

            reordering = true;
            consecutiveNonOperators = 0;

            // Push an operator onto the stack
            operatorStack.push([expr, i])
        } else {
            if (reordering) {
                // If true, we just dealt with an operator.
                // Push an additional item onto the reorder stack
                // and go to the next token
                reorderStack.push([expr, i])
                consecutiveNonOperators++;
                if (consecutiveNonOperators == 2) {
                    reordering = false;
                    consecutiveNonOperators = 0;

                    // If there are pending reorders, drain the reorder stacks
                    while (operatorStack.length > 0) {
                        output.push(operatorStack.pop()!)
                    }

                    output.push(...reorderStack)

                    reorderStack.splice(0, reorderStack.length)
                }
            } else {
                // push current value to output
                output.push([expr, i])
            }
        }
        i++;
    }

    // ensure reorder stacks are empty before exiting the procedure
    while (operatorStack.length > 0) {
        output.push(operatorStack.pop()!)
    }

    output.push(...reorderStack)

    return output
}
