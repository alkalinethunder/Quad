#!/usr/bin/env node

//Set up the configuration files
if (process.platform == 'win32') {
    // victor doesn't like windows but I do so yeah - michael
    process.env["NODE_CONFIG_DIR"] = "%AppData%\\Quad\\etc\\quad;..\\config/";
    process.env["QUAD_TR_DIR"] = ".\\translations\\";
} else {
    process.env["NODE_CONFIG_DIR"] = "/etc/quad/:../config/";
    process.env["QUAD_TR_DIR"] = "./translations/";
}

const Eris = require('eris');
const config = require('config');
const i18n = require('i18n');
const log = require('log');
const handler = require('handler');
const modloader = require("./modloader");
const db = require("db");
const prefix = require("prefix");
require("./ctlsrv/server.js");

const t = i18n.t;
process.exitCode = 1; //Assume error unless otherwise proven

(async () => {
    log(t("Welcome to {{BOT_NAME}}!", {"BOT_NAME": config.get("bot.name")}));
    
    if (!await db.init(true)) throw new Error("Database Unavailable"); //Die if something happens when initialising the database
    modloader.init();
    handler.init();
    
    let bot = new Eris(config.get('discord.token'));
    bot.on("ready", () => {
        log(t("Locked and loaded!"), log.success);
    });
    bot.on("messageCreate", async (msg) => {
        if (msg.author.bot) return;
        
        let pf = await prefix(msg.channel.guild);
        if (msg.content.startsWith(pf) || pf === "") {
            handler.process(pf, msg);
        }
    });

    process.on("SIGINT", () => {
        console.log(); // Make text appear on line after ^C
        handler.exit();
    });
    process.on("SIGTERM", () => {
        console.log(); // Make text appear on line after ^C
        handler.exit();
    });

    bot.connect();
    
    handler.setBot(bot);
})().then(retval => {
    
}).catch(err => {
    log(err.stack, log.error);
    handler.exit(false);
});