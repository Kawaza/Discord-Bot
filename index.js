//This is the discord bot for the KM server, i have removed all the stuff related to server stuff. But it shows most of the commands and basic functions
//Twitch.tv/kriticalmg

//YOU WILL NEED A CONFIG.JSON FILE AND ADD YOUR TOKEN AND A PREFIX
// "token"  : "##################################################", "prefix" : "!"


const Discord = require('discord.js');
const config = require("./config.json")
const PREFIX = "!"

//This below are consts that we use to grab channel ID's and Role ID's so that we can call them down at a later point.
const WELCOME_CHANNEL = ""
const NEW_USER_CHANNEL = ""
const ANNOUCMENT_CHANNEL = ""
const FREE_AGENTS_CHANNEL = ""
const COMMUNITY_MEMBER_ROLE = ""
const REPORT_CHANNEL = ""
const ESPORTS_ROLE = "" 
const LOLESPORTS_ROLE = ""
const DOTAESPORTS_ROLE = ""
const APPLICATION_CHANNEL = ""
//We also have a bad work filter made in regex here Example Below
const regex = /\b(Apple|orange|banana|strawberry|grape|fig|starfruit|watermelon|honeydew|cantalope|blueberry)\b/i
const client = new Discord.Client({

    owner: ['[discord owners id]', '[discord owners id]'],
});

  
   // =-----------------MODERATION SECTION---------------------=

   //This below stops all messages in those specific channels unless you are a KM Staff Member. If you are a Communtiy member it simply is deleted.
  client.on('message', message => {
      //All Channels that you dont want messages in (Welcome / New-User / )
    if(message.channel.id === WELCOME_CHANNEL || message.channel.id === NEW_USER_CHANNEL || message.channel.id === ANNOUCMENT_CHANNEL)
    {
        if(!message.member.roles.some(r=>["KM Staff", "BOTS", "Moderator"].includes(r.name)) )
        {
          message.delete()
        }
    }})

  
   //this is the same as above except we made it so it will only allow messages that have a PREFIX in front of it, essentially a command only channel.
   client.on('message', message => { 
    if(message.channel.id === (FREE_AGENTS_CHANNEL))
    {
      if(!message.content.startsWith (PREFIX + "lft") && (!message.content.startsWith (PREFIX + "lfp")))
      {
        if(!message.member.roles.some(r=>["KM Staff", "BOTS", "Moderator"].includes(r.name)) )
        {
          message.delete()
            return message.author.send('Please follow the pinned tabs to see how to post in the "Free Agents  Channel" if you are experiencing a problem please send a report by doing !report (reason).' )
        }
      }
    }})
    

   //Spam Filter
    const antispam = require("discord-anti-spam");
    antispam(client, {
      warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
      maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
      interval: 1000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
      warningMessage: "Please Do Not Spam", // Warning message send to the user indicating they are going to fast.
      banMessage: "has been banned for spamming.", // Ban message, always tags the banned user in front of it.
      maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
      maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
      deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
    });


//This is the  bad world filter that uses regex to determine if the message has those words.
client.on('message', async message => {
  if (regex.test(message.content))
    {
      message.delete();
      message.channel.sendMessage('Hey! Lets Keep It Friendly Here.')
    }
})

  //Auto Assign This automaticly gives a user a role upon joining the server.
  client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.id === COMMUNITY_MEMBER_ROLE));

 });
 //This auto sends them a Direct Message from the bot when they join the server for a first time. Like a welcome Message.
  client.on('guildMemberAdd', guildMember => {
    guildMember.send("Welcome to Kritical Mass, Make sure to join a esports role to see the channels and upcoming events for your esports. Type `!addrole lolesports` or `!addrole dotaesports` in any channel to join your role.");
  });

 // Bot Status (Example: Kritical Mass Bot is Watching over Kritical Mass) This can be set up for anything though.
 client.on('ready', () => {
   client.user.setStatus("Online")
   client.user.setActivity('over Kritical Mass', { type: 'WATCHING' });
 })

 //Link Blocker. This blocks links on specific channels YOU SHOULD USE CONTS HERE, but we didnt.
  client.on('message', message => {
    if(message.channel.id === "[channel id]" || message.channel.id === "[channel id]" || message.channel.id === "[channel id]")
    {
      if (!message.content.includes('apply')) {

        if (message.content.includes('www')) {
        message.delete();
        message.author.send('Please Only Post Links In "gameplay-highlights" or "self-promotion" ' )
        }
      }
    }
    })

//THIS IS THE RAW TO CHECK FOR THE QUICK ROLE ASSIGNMENT MESSAGE, honestly its confusing to understand for me but you need this to do role asigns based on a reaction. 
  client.on('raw', event => {
    const eventName = event.t;
      if(eventName === 'MESSAGE_REACTION_ADD') 
      {
        if(event.d.message_id === '################') 
        {

          var reactionChannel = client.channels.get(event.d.channel_id);
          if (reactionChannel.messages.has(event.d.message_id))
            return;
          else {
            reactionChannel.fetchMessage(event.d.message_id)
            .then(msg => {
              var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
              var user = client.users.get(event.d.user_id);
              client.emit('messageReactionAdd', msgReaction, user);
            })
            .catch(err => console.log(err));
          }
        }
      }
      else if (eventName === "MESSAGE_REACTION_REMOVE") {
        if(event.d.message_id === '#################')
        {

          var reactionChannel = client.channels.get(event.d.channel_id);
          if (reactionChannel.messages.has(event.d.message_id))
            return;
          else {
            reactionChannel.fetchMessage(event.d.message_id)
            .then(msg => {
              var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
              var user = client.users.get(event.d.user_id);
              client.emit('messageReactionRemove', msgReaction, user);
            })
            .catch(err => console.log(err));
          }
        }
    }
  })
//ADDS YOUR ROLE BASED ON REACTION
  client.on('messageReactionAdd', (messageReaction, user) => {
        var roleName = messageReaction.emoji.name;
        var role = messageReaction.message.guild.roles.find(role => role.name.toLocaleLowerCase() ===
        roleName.toLocaleLowerCase());

        if(role) {
          var member = messageReaction.message.guild.members.find(member => member.id === user.id);
          member.addRole(ESPORTS_ROLE);
          if(member) {
            member.addRole(role.id);
          }
        }
  })
//REMOVES YOUR ROLE BASED ON REACTION
  client.on('messageReactionRemove', (messageReaction, user) => {
        var roleName = messageReaction.emoji.name;
        var role = messageReaction.message.guild.roles.find(role => role.name.toLocaleLowerCase() ===
        roleName.toLocaleLowerCase());
        if(role) {
          var member = messageReaction.message.guild.members.find(member => member.id === user.id);
          member.removeRole(ESPORTS_ROLE);
          if(member) {
            member.removeRole(role.id);
          }
        }
  })
  // =-----------Commands--------------=
// THIS IS THE COMMANDS SECTION
//The first thing here determines what a message is and turns it to lower case, this also splices off extra text that contains a prefix
  client.on("message", async message => {

    if(message.author.bot) return;
    
    if(message.content.indexOf(config.prefix) !== 0) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    //This is the command for a Welcome Message, I removed what i called it so that people dont use it. But its a nice welcome message with links to social media etc.
    if(command === "##########") {
      {
        if(!message.member.roles.some(r=>["KM Staff", "Mod"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");

        let botIcon = client.user.displayAvatarURL;
        let botEmbed = new Discord.RichEmbed()
  
        .setColor("#7b03e7")
        .setThumbnail(botIcon)
        .addField("Welcome To The Kritical Mass Discord", "Welcome to the Kritical Mass Productions Discord Server! This is the hub of our community where you can find updates, new releases, tournaments, news, and join in on our content. Feel free to use the voice channels whenever you’d like. Message an admin if you need any assistance. See you around!  ")
        .addField("Esports", "To join a Esports Role, Go to the Role Assignment Channel or type `!addrole lolesports` for League of Legends or `!addrole dotaesports` For Dota in the General Discussion Channel")
        .addField("Youtube", "https://goo.gl/XzLpP6")
        .addField("Twitch", "https://www.twitch.tv/kriticalmg")
        .addField("Instagram", "https://www.instagram.com/kritical_mg/")
        .addField("Facebook", "https://www.facebook.com/KriticalMassGaming/?ref=br_rs")
        .addField("Twitter", "https://twitter.com/KriticalMG")
        .addField("Battlfy", "https://battlefy.com/kritical-mass")
        .addField("Discord", "https://discord.gg/8uvnT58")
        .addField("Commands", "Type: `!commands`")
        .addField("Server Information", "Type: `!serverinfo`")
        .addField("Bot Info", "Type `!botinfo`")
        
        message.delete()
        return message.channel.send(botEmbed);
      }
    }

    //This is the command for a Free Agents Message, I removed what i called it so that people dont use it.
    if(command === "#########") {
      {
        if(!message.member.roles.some(r=>["KM Staff", "Mod"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");

        let botIcon = client.user.displayAvatarURL;
        let botEmbed = new Discord.RichEmbed()
  
        .setColor("#7b03e7")
        .setThumbnail(botIcon)
        .addField("- How to Use the Free Agents Channel", "When posting in the 'Free Agents Channel' use the commands  ` !lft ` if you're looking for a team and ` !lfp ` if you're in need of a player.  ")
        .addField("- !lft [IGN] [Rank] [Roles] [Description or More Info]", "Example: !lft Don-Bronco Iron3 Support I Only Play Leblanc.")
        .addField("- !lfp [IGN] [Rank Your Looking For] [Roles Needed] [Description of Team / Team Name]", "Example: !lfp Don-Bronco Gold/Plat Support Need Support Fast Team Red.")
        .addField("- MUST READ", "All Fields must be filled EXCEPT Description can be left empty. \nPut a Space in-between every field  EXCEPT description which can be multiple sentences. \nIf your IGN / Rank or Roles needs a space use ` - ` the dash instead of  a space. \nIf you need any help type !report [reason] and a staff member will DM you if needed.")
        
        message.delete()
        return message.channel.send(botEmbed);
      }
    }

    //This is for the Kick command (in recents versions of disc this may not work, plus its easier to just right click and kick)
    if(command === "kick") {

      if(!message.member.roles.some(r=>["KM Staff", "Moderators"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");

        message.delete();

      let member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.kickable) 
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      

      await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        let reportchannel = client.channels.get("##########");
        reportchannel.send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  
    }

    //This is for the Ban command (in recents versions of disc this may not work, plus its easier to just right click and Ban)
    if(command === "ban") {

      if(!message.member.roles.some(r=>["KM Staff", "Moderators"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");
      
        message.delete();

      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        let reportchannel = client.channels.get("#############");
        reportchannel.send(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);

    }

    //This straight up doesnt work but it was meant to clear messages. If you find a way to do it, please DM me.
    if (command === "clear") {
      if(!message.member.roles.some(r=>["KM Staff", "BOTS", "Moderator"].includes(r.name)) )
        {
          message.delete()
        }
      else {
        message.channel.bulkDelete(100).then(() => {
          message.channel.send("Deleted 100 messages.").then(msg => msg.delete(3000));
        });
      }
    }

    //Heads or Tails? Thats the game
    if(command === "coinflip") {

      
            var chance = Math.floor(Math.random() * 2);
            if (chance == 0)
            {
                message.reply('Heads')
            }
            else
            {
                message.reply('Tails')
            }
        
        
    }

    //This changes your nickname (againt its easy to just right click your name)
    if(command === "nick") {

      let text = args.join(" ");
      message.delete();
      message.member.setNickname(text)
    }

    //This is COOL, so this sends you a Direct Message with information on the server. You can do this for a lot of things.
    if(command === "serverinfo")
    {
      let serverIcon = message.guild.iconURL;
      let serverEmbed = new Discord.RichEmbed()

      .setTitle("Kritical Mass Server Info")
      .setColor("#9600ff")
      .setThumbnail(serverIcon)
      .addField("Server Name", "Kritical Mass Productions")
      .addField("Total Members", message.guild.memberCount)
      .addField("Server Info","Welcome to the Kritical Mass Productions Discord Server! This is the hub of our community where you can find updates, new releases, tournaments, news, and join in on our content. Feel free to use the voice channels whenever you’d like. Message an admin by doing `!report [reason]` and a Staff member will message you as soon as we can. See you around!")
      .addField("Twitch", "https://www.twitch.tv/kriticalmg")
      .addField("Youtube", "https://www.youtube.com/channel/UC3zCiCU-VMdu_jAEqqnMDPQ")
      .addField("Instagram", "https://www.instagram.com/kritical_mg/?hl=en")
      .addField("Discord", "https://discord.gg/PaQ8QJ8")
      .addField("Facebook", "https://www.facebook.com/KriticalMassGaming/")
      .addField("Twitter", "https://twitter.com/KriticalMG?lang=en");

      message.delete()
      return message.author.send(serverEmbed);
    }

    //Same thing as above but for bot info
    if(command === "botinfo")
    {
      let botIcon = client.user.displayAvatarURL;
      let botEmbed = new Discord.RichEmbed()

      .setTitle("KMBot Information")
      .setColor("#2f67ff")
      .setThumbnail(botIcon)
      .addField("Bot Name", client.user.username)
      .addField("!commands", "Sends you a list of all server commands.")
      .addField("!serverinfo", "Bot will DM you info about the Kritical Mass Server.")
      .addField("!botinfo", "Bot will DM you info about KritBot and commands it can do.")
      .addField("!report details", "Bot will send a report to admins about another user or problem specified in the reason given.");

      message.delete()
      return message.author.send(botEmbed);
    }

    //Same thing as above but for bot commands
    if(command === "commands")
    {
      let botIcon = client.user.displayAvatarURL;
      let botEmbed = new Discord.RichEmbed()

      .setTitle("All Commands")
      .setColor("#6f00ff")
      .setThumbnail(botIcon)
      .addField("!addrole [role]", "This allows you to add a role such as (lolesports or dotaesports) adding a role allows you access to certain channels for that role.")
      .addField("!apply", "this is how to apply for the streamer role `!apply streamer [url] [desc] Streamer role is a discord server role to show your a dedicated twitch streamer in the Kritical Mass Community. Type `!howtoapply` for more info`")
      .addField("!botinfo", "This just shows bot related commands.")
      .addField("!coinflip", "Flips a Coin.")
      .addField("!commands", "List of all server commands.")
      .addField("!howtroapply", "Shows how to apply for Streamer or Partner.")
      .addField("!lft", "This commands only work in the 'Free Agents' Channel and allow you to post a 'Looking For Team' message with info about yourself. For more info on this command, please read the pinned message in the 'Free Agents' Channel.")
      .addField("!lfp", "This commands only work in the 'Free Agents' Channel and allow you to post a 'Looking For Player' message with info about what type of player you're looking for. For more info on this command, please read the pinned message in the 'Free Agents' Channel.")
      .addField("!nick [name]", "Changes Server Nickname.")
      .addField("!serverinfo", "This will show you server information and all our social media links.")
      .addField("!removerole", "This removes a role from yourself such as (esports).")
      .addField("!report [reason]", "This allows you to report anything such as another player, or a tech issue. This is only seen by Admins.")
      
      message.delete()
      return message.author.send(botEmbed);
    }

    //This allows people to report a user and it sends it to a only staff channel in a nice format. This allows players to report one another in private.
    if(command === "report")
    {
        let details = args.join(" ");
        let reportEmbed = new Discord.RichEmbed()

        .setDescription("Reports")
        .setColor("#15f153")
        //.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Details", details);

        let reportsChannel = message.guild.channels.get(REPORT_CHANNEL);
        if(!reportsChannel) return message.channel.send("Couldn't find reports channel.");

        message.delete()
        reportsChannel.send(reportEmbed);
        return;
    }
    //This is a addrole command to add someone to a role.
    if(command === "addrole") {
        let esports = args[0].toLowerCase()
        if(esports === "lolesports") {

          let esportsrole = message.guild.roles.get(ESPORTS_ROLE);
          message.member.addRole(esportsrole).catch(console.error)
          message.delete();

          let lolesports = message.guild.roles.get(LOLESPORTS_ROLE);
          message.member.addRole(lolesports).catch(console.error)
          message.delete();
        }
        else if (esports === "dotaesports") {

          let esportsrole = message.guild.roles.get(ESPORTS_ROLE);
          message.member.addRole(esportsrole).catch(console.error)
          message.delete();

          let dotaesports = message.guild.roles.get(DOTAESPORTS_ROLE);
          message.member.addRole(dotaesports).catch(console.error)
          message.delete();
        } 
        else {

          message.delete();
          return message.author.send("In order to add a role, please type !addrole (role). Such as `lolesports` or `dotaesports` ")
        }
    }
    //This is a removerole command to remove someone to a role.
    if(command === "removerole") {

      let esports = args[0].toLowerCase()
        if(esports === "lolesports") {
        let esportsrole = message.guild.roles.get(ESPORTS_ROLE);
          message.member.removeRole(esportsrole).catch(console.error)
          message.delete();

          let lolesports = message.guild.roles.get(LOLESPORTS_ROLE);
          message.member.removeRole(lolesports).catch(console.error)
          message.delete();
        } 
        else if (esports === "dotaesports") {
          let esportsrole = message.guild.roles.get(ESPORTS_ROLE);
          message.member.removeRole(esportsrole).catch(console.error)
          message.delete();

          let dotaesports = message.guild.roles.get(DOTAESPORTS_ROLE);
          message.member.removeRole(dotaesports).catch(console.error)
          message.delete();
        }
        else
        {
          message.delete();
          return message.author.send("In order to remove a role, please type !removerole (role). Such as `lolesports` or `dotaesports`")
        }
    }

    //This wont make any sense for you guys but we basicly set up a way to look for a team as a player. It works really well though.
    if(command === "lft") {
      if (message.channel.id === FREE_AGENTS_CHANNEL){

        let serverIcon = message.guild.iconURL;
        let ign = args[0].replace ("-", ' ');
        let rank = args[1].replace ("-", ' ');
        let role = args[2].replace ("-", ' ');
        let desc = args.slice(3).join(" ")
        if(desc.length == 0) {desc = "Blank"}
        let opgg = args[0].replace ("-", "+")
        message.delete();
        let serverEmbed = new Discord.RichEmbed()
        .setColor("#FFFF00")
        .setThumbnail(serverIcon)
        .addField("Looking For a Team", (message.member.user) + " Is Currently Looking for a Team")
        .addField("Time", message.createdAt)
        .addField("IGN",(ign))
        .addField("Current Rank",(rank))
        .addField("Roles:", (role))
        .addField("Player Description", (desc) ? desc : "No Description")
        .addField("OP.GG", "http://na.op.gg/summoner/userName=" + opgg)

  
        message.delete()
        return message.channel.send(serverEmbed);

      }
    }
    //Same as above but for Team looking for a player
    if(command === "lfp") {
      if (message.channel.id === FREE_AGENTS_CHANNEL){
        
        let serverIcon = message.guild.iconURL;
        let ign = args[0].replace ("-", ' ');
        let rank = args[1].replace ("-", ' ');
        let role = args[2].replace ("-", ' ');
        let desc = args.slice(3).join(" ");
        message.delete();
        let serverEmbed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setThumbnail(serverIcon)
        .addField("Looking For a Player", (message.member.user) + " Is Currently Looking for a Player")
        .addField("Time", message.createdAt)
        .addField("IGN",(ign))
        .addField("Average Rank",(rank))
        .addField("Roles Needed:", (role))
        .addField("Team Description", (desc)  ? desc : "No Description")

        message.delete()
        return message.channel.send(serverEmbed);
        
      }
      else {
        message.delete()
        return message.author.send("Sorry this command only works in 'Free Agents' ");
      }
    }
    //This mutes people AMAZING COMMAND
    if(command === "mute") {
      const ms = require("ms")

      if(!message.member.roles.some(r=>["KM Staff", "Moderators"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

      let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!tomute) return message.reply("Could not find user")

      if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Cant Mute Them");

      let muterole = message.guild.roles.get("###############");
      let mutetime = args[1] ? args[1] : "5m"
      
     await(tomute.addRole(muterole));
     let reportsChannel = message.guild.channels.find(`name`, "reports");
      if(!reportsChannel) return message.channel.send("Couldn't find reports channel.");

      message.delete()
     reportsChannel.send(`<@${tomute.id}> has been muted for ${ms(mutetime)}`);
     setTimeout(function(){
      tomute.removeRole(muterole);
     }, ms(mutetime));
    }
    //This unmutes people
    if(command === "unmute") {
      let muterole = message.guild.roles.get("############");
    
      if(!message.member.roles.some(r=>["KM Staff", "Moderators"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

      let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!tomute) return message.reply("Could not find user")

      message.delete();
      await(tomute.removeRole(muterole));
    }

    // This was a Direct Message that told you how to apply for specific roles.
    if(command === "howtoapply")
    {
      let serverIcon = message.guild.iconURL;
      let applyEmbed = new Discord.RichEmbed()

      .setTitle("How to Apply for Streamer or Partnership")
      .setColor("#9600ff")
      .setThumbnail(serverIcon)
      .addBlankField()
      .addField("Apply For Streamer", "Are you a streamer? Apply for our discord Streamer role for exclusive events and contests to help you boost your content!, Type `!apply streamer [Twitch URL] [Description]` In order to apply for a streamer. \nFill in Description with information about you or your channel you want to tell us.")
      .addField("Requirments For Streamer Role"," -50 Twitch Followers. \n-At least one social media account for your channel. \n-Live stream 2+ times per week.")
      .addBlankField()
      .addField("Apply For Partnership", "KM is looking for Partners! We work closely with a handful of strong, exciting content creators and companies to help grow our platform, and theirs. If you are interested in becoming a partner with KM, please submit a formal application to `sparx@kriticalmass.me` We are looking for dedication and growth, not just large entities. Think you fit that description? Let us know!")

      message.delete()
      return message.author.send(applyEmbed);
    }
    // this is just like reports, you can send a message to a staff only channel. In this case you can apply for the streamer role.
    if(command === "apply")
    {
        let streamer = args[0].toLowerCase()
      
        if(streamer === "streamer")
        {
          let serverIcon = message.guild.iconURL;
          let url = args[1].replace ("-", ' ');
          let desc = args.slice(2).join(" ")
          let applicationEmbed = new Discord.RichEmbed()
          .setColor("#6f00ff")
          .setThumbnail(serverIcon)
          .addField("Application For Streamer", (message.member.user))
          .addField("Time", message.createdAt)
          .addField("URL",(url))
          .addField("Description",(desc) ? desc : "No Description")
    
          let applyChannel = message.guild.channels.get(APPLICATION_CHANNEL);
          if(!applyChannel) return message.channel.send("Couldn't find Application channel.");

          message.delete()
          applyChannel.send(applicationEmbed);
          message.author.send("Thanks for Applying!")
          return;
        }
        else{
          message.delete()
          return message.author.send("Sorry" + " " + streamer + " " + "is not a valid role. Make sure you type the command as the following, `!apply streamer`. \nIf you're looking to apply for 'Partner' type `!howtoapply` for more details.");
        }
    }

  })
  client.login(config.token);

