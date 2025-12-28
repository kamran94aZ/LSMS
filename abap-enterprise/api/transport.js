"use strict";

/**
 * Transport API
 */

module.exports = (app, {
    transportManager,
    transportMigrator
}) => {

    app.post("/api/transport/create", (req, res) => {
        const { owner, description } = req.body;
        res.json(transportManager.createTR(owner, description));
    });

    app.post("/api/transport/:id/release", (req, res) => {
        res.json(transportManager.releaseTR(req.params.id));
    });

    app.post("/api/transport/:id/migrate", (req, res) => {
        const tr = transportManager.getTR(req.params.id);
        res.json(transportMigrator.migrate(tr));
    });

};
