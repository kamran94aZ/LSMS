"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = function createServer(services) {
    const app = express();

    
    app.use(bodyParser.json());

    
    app.use("/api/run", express.text({ type: "*/*" }));

    
    require("./run")(app, services);
    require("./metadata")(app, services);
    require("./ddic")(app, services);
    require("./syntax")(app, services);
    require("./transport")(app, services);
    require("./debug")(app, services);

    return app;
};
