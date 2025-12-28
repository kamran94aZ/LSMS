"use strict";

/**
 * DDIC API
 */

module.exports = (app, { ddic }) => {

    app.get("/api/ddic/tables", (req, res) => {
        res.json(Object.keys(ddic.tables));
    });

    app.get("/api/ddic/table/:name", (req, res) => {
        const t = ddic.getTable(req.params.name);
        if (!t) return res.status(404).end();
        res.json(t);
    });

    app.get("/api/ddic/domains", (req, res) => {
        res.json(Object.keys(ddic.domains));
    });

    app.get("/api/ddic/elements", (req, res) => {
        res.json(Object.keys(ddic.elements));
    });

};
