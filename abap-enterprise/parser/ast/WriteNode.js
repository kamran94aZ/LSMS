"use strict";

class WriteNode {
    constructor(value) {
        this.type = "WRITE";
        this.value = value;
    }
}

module.exports = WriteNode;
