"use strict";

/**
 * Syntax Check API
 */

module.exports = (app, { syntaxChecker }) => {

    app.post("/api/syntax", (req, res) => {
        const { code } = req.body;
        res.json(syntaxChecker.check(code));
    });

};
