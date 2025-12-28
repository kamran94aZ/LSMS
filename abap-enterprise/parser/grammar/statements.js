"use strict";

const WriteNode = require("../ast/WriteNode");

exports.parseWrite = function (parser) {
    parser._expect("KEYWORD", "WRITE");
    const str = parser._expect("STRING");
    parser._match("DOT");

    return new WriteNode(str.value);
};
