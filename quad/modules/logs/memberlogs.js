const handler = require("handler");
const db = require("db");
const moment = require("moment");
const MemberUtil = require("memberutils");

async function alertsChannel(guild, client = null) {
    if (!guild) return null;
    
    // NEW DB ENGINE
    const guildInfo = await db.getGuildLogs(guild.id)
    const channelId = guildInfo.alertsChannel


    // OLD CODE
    /*if (!client) client = db.getPool();
    let resp = await client.query("SELECT alerts FROM guildLogs WHERE id=$1", [guild.id]);
    if (resp.rowCount == 0) return null;
    let channelId = resp.rows[0].alerts;*/
    
    let channelObj = guild.channels.find(c => {
        return c.id === channelId;
    });
    if (!channelObj) {
        //TODO: The channel probably no longer exists, so remove it from the database
    }
    return channelObj;
}

handler.listen('guildMemberUpdate', async (guild, member, oldMember) => {
    if (oldMember.nick === member.nick) return;
    let channel = await alertsChannel(guild);
    if (channel) {
        channel.createMessage(`:abcd: ${oldMember.nick} :arrow_right: ${member.nick ? member.nick : "[cleared]"} | **${member.username}#${member.discriminator}** (${member.id})`);
    }
});

handler.listen('guildMemberUpdate', async (user, oldUser) => {
    let client = await db.get();
    let message = `:abcd: ${oldUser.username}#${oldUser.discriminator} :arrow_right: ${user.username}#${user.discriminator} (${user.id})`;
    for (let guild of handler.bot.guilds.values()) {
        let member = guild.members.find(member => {
            return member.id === user.id;
        });
        if (!member) continue;
        
        let channel = await alertsChannel(guild, client);
        if (channel) channel.createMessage(message);
    }
    client.release();
});

handler.listen('guildMemberAdd', async (guild, member) => {
    let channel = await alertsChannel(guild);
    if (channel) {
        //TODO: Send extended user information
        channel.createMessage(`:arrow_right: ${member.mention}`);
    }
});

handler.listen('guildMemberRemove', async (guild, member) => {
    let channel = await alertsChannel(guild);
    if (channel) {
        channel.createMessage(`:arrow_left: ${member.user.mention} (${MemberUtil.tag(member.user)})`);
    }
});