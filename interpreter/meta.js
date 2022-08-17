const types = require('./types');

const getInnerSequenceToExitChar = (sequence, exit, enter, index) => {
    let encounters = 0;
    for (let i = index ; i < sequence.length ; i ++ ) {
        const token = sequence[i];
        if (token === enter) {
            encounters++;
        }
        if (token === exit) {
            encounters--;
            if (encounters === 0) {
                return sequence.slice(0, i + 1);
            }
        }
    }
    return [];
}

const firstIndexOf = (sequence, text) => {
    for (let i = 0 ; i < sequence.length ; i ++ ) {
        if (sequence[i] === text) {
            return i;
        }
    }
    return -1;
}


const assignInformation = (sequence) => {
    const group = [];
    const colonIndex = firstIndexOf(sequence, ':');
    for (let i = 0 ; i < sequence.length ; i ++ ) {
        const token = sequence[i];
        if (i < colonIndex) {
            if (i === 0) {
                group.push({
                    tokens: [token],
                    type: types.FUNCTION_NAME
                });
            } else if (token === '(') {
                group.push({
                    tokens: getInnerSequenceToExitChar(sequence,')','(',i).tokens,
                    types: types.TYPE
                });
            } else if ()
        }

    }

}
