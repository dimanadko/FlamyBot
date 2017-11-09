'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const apw = require('./appendHomeWork');


const token = config.token;
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = msg.from.username; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

let taskArr = {};
let taskFlag1 = false;
let taskFlag2 = false;
let taskFlag3 = false;

bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  taskFlag1 = true;
  bot.sendMessage(chatId,
    'Enter your Subject: ');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (taskFlag3) {
    taskArr.deadline = msg.text;
    console.log(taskArr);
    apw.appendHomeWork(taskArr.subj, taskArr.task, taskArr.deadline);
    bot.sendMessage(chatId, 'Hometask has been successfully added!');
    taskFlag3 = false;
    taskArr = {};
  }
  if (taskFlag2) {
    taskArr.task = msg.text;
    console.log(taskArr);
    bot.sendMessage(chatId, 'Enter hometask deadline: ',
      {
        "reply_markup": {"keyboard": [[{ text: "auto" }]], "one_time_keyboard": true},
      });
    taskFlag2 = false;
    taskFlag3 = true;
  }
  if (taskFlag1) {
    taskArr.subj = msg.text;
    console.log(taskArr);
    bot.sendMessage(chatId, 'Enter your hometask: ');
    taskFlag1 = false;
    taskFlag2 = true;
  }

});
