#!/usr/bin/env node

//Set up the configuration files
process.env["NODE_CONFIG_DIR"] = "/etc/quad/:../config/";

const Client = require("./client");
const Screen = require("./screen");
const client = new Client();

client.on("ready", () => {
    let screen = new Screen(client);
});