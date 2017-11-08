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
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

let taskArr = [];
let taskFlag = false;
bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  taskFlag = true;
  bot.sendMessage(chatId,
    'Enter your asingment (Subject; Hometask; Deadline): ');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (taskFlag) {
    taskArr = msg.text.split('; ');
    console.log(taskArr);
    apw.appendHomeWork(taskArr[0], taskArr[1], taskArr[2]);
    bot.sendMessage(chatId, 'Hometask has been sent to students successfully');
    taskFlag = false;
  }
});
