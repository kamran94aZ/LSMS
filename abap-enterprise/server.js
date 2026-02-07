"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");

// ===============================
// 1. CORE KERNEL & SERVICES
// ===============================
const config = require("./config/config.json");
const DDIC = require("./ddic/loader");
const Repository = require("./cts/repository");
const VersionControl = require("./cts/versionControl");
const Parser = require("./parser/abapParser");
const Interpreter = require("./runtime/interpreter");
const ClassRegistry = require("./oop/classRegistry");
const MetadataProvider = require("./ide/metadata");
const SyntaxChecker = require("./ide/syntaxCheck");
const runProgram = require("./ide/runProgram");
const TransportManager = require("./cts/transportManager");
const TransportMigrator = require("./transport/migrator");
const DebugManager = require("./debugger/debugManager");

// ===============================
// 2. INITIALIZATION
// ===============================
const ddic = new DDIC("./ddic");
ddic.loadAll();
const repository = new Repository();
const versionControl = new VersionControl();
const parser = new Parser();
const classRegistry = new ClassRegistry();
const metadata = new MetadataProvider(ddic, classRegistry);
const syntaxChecker = new SyntaxChecker(parser);
const transportManager = new TransportManager(repository, versionControl);
const transportMigrator = new TransportMigrator(repository, repository, versionControl);

// ===============================
// 3. API SERVER CREATION
// ===============================
const createServer = require("./api/server");

const app = createServer({
    runProgram,         
    metadata,
    ddic,
    syntaxChecker,
    transportManager,
    transportMigrator,
    debugManager: DebugManager
});


app.use(express.json());

// ===============================
// 4. LIVE ABAP SYNC LOGIC
// ===============================
app.get("/api/live-view", async (req, res) => {
    try {
        // Faylın yerini mütləq ünvanla təyin edirik
        const abapFilePath = path.resolve(__dirname, "LOCAL_ABAP", "z_demo.abap");
        
        console.log("Reading ABAP file from:", abapFilePath);

        if (!fs.existsSync(abapFilePath)) {
            return res.status(404).json({ 
                success: false, 
                error: `Fayl tapılmadı! Zəhmət olmasa bu qovluqda faylın olduğuna əmin olun: ${abapFilePath}` 
            });
        }

        const abapSourceCode = fs.readFileSync(abapFilePath, "utf8");

        // Kernel vasitəsilə icra
        const result = await runProgram.run(abapSourceCode, {});
        
        res.json(result);
    } catch (e) {
        console.error("Kernel Error:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// ===============================
// 5. STATIC FILES & UI
// ===============================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 6. START SERVER
// ===============================
const PORT = config.server.port || 3000;
const HOST = config.server.host || "localhost";

app.listen(PORT, HOST, () => {
    console.log("========================================");
    console.log(" ABAP ENTERPRISE SERVER LIVE VIEW ");
    console.log(` URL: http://${HOST}:${PORT}`);
    console.log(" Monitoring: LOCAL_ABAP/z_demo.abap");
    console.log("========================================");
});
