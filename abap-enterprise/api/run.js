"use strict";

/**
 * Run ABAP program
 * Accepts RAW TEXT (not JSON)
 */

module.exports = (app, { runProgram }) => {

    app.post("/api/run", async (req, res) => {
        try {
            
            const code = req.body;

            if (!code || typeof code !== "string") {
                return res.status(400).json({
                    success: false,
                    error: "No source code received"
                });
            }

            const result = await runProgram.run(code, {});
            res.json(result);

        } catch (e) {
            res.status(500).json({
                success: false,
                error: e.message
            });
        }
    });

};

