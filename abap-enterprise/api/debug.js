"use strict";

/**
 * Debug API
 */

module.exports = (app, { debugManager }) => {

    app.post("/api/debug/breakpoint", (req, res) => {
        debugManager.breakpoints.add(req.body);
        res.json({ ok: true });
    });

    app.post("/api/debug/step", (req, res) => {
        const { action, runtime } = req.body;

        if (action === "into") debugManager.stepController.stepInto();
        if (action === "over") debugManager.stepController.stepOver(runtime.depth);
        if (action === "out") debugManager.stepController.stepOut(runtime.depth);
        if (action === "resume") debugManager.stepController.resume(runtime);

        res.json({ ok: true });
    });

};
