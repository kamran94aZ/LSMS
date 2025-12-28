"use strict";

const lexerRules = require("./lexerRules");

function tokenize(source) {
    const tokens = [];
    let input = source;
    let line = 1;
    let column = 1;

    while (input.length > 0) {
        let matched = false;

        for (const rule of lexerRules) {
            const regex = new RegExp("^" + rule.regex.source, rule.regex.flags);
            const match = regex.exec(input);

            if (match) {
                matched = true;
                const value = match[0];

                if (!rule.ignore) {
                    tokens.push({
                        type: rule.type,
                        value: rule.transform ? rule.transform(value) : value,
                        line,
                        column
                    });
                }

                const lines = value.split("\n");
                if (lines.length > 1) {
                    line += lines.length - 1;
                    column = lines[lines.length - 1].length + 1;
                } else {
                    column += value.length;
                }

                input = input.slice(value.length);
                break;
            }
        }

        if (!matched) {
            throw new SyntaxError(
                `Unexpected token '${input[0]}' at line ${line}, column ${column}`
            );
        }
    }

    return tokens;
}

module.exports = {
    tokenize
};

