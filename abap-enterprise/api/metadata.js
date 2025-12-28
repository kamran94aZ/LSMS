"use strict";

/**
 * Metadata API
 */

module.exports = (app, { metadata }) => {

    app.get("/api/metadata/keywords", (req, res) => {
        res.json(metadata.getKeywords());
    });

    app.get("/api/metadata/tables", (req, res) => {
        res.json(metadata.getTables());
    });

    app.get("/api/metadata/classes", (req, res) => {
        res.json(metadata.getClasses());
    });

    app.get("/api/metadata/class/:name/methods", (req, res) => {
        res.json(metadata.getClassMethods(req.params.name));
    });

};
