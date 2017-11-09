'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const apw = require('./appendHomeWork');
const fs = require('fs');


const token = config.token;
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/echo (.+)/, (msg) => {
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
let taskFlag4 = false;


bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  taskFlag1 = true;
  bot.sendMessage(chatId, 'Enter your Subject: ');
});

bot.onText(/\/get (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const taskData = JSON.parse(fs.readFileSync('./dataBase/data.json'));
  if (Object.keys(taskData).includes(match[1])) {
    const subjTaskArr = taskData[match[1]];
    console.log(subjTaskArr);
    if (subjTaskArr.length !== 0) {
      subjTaskArr.forEach((item) => {
        bot.sendMessage(chatId, item.task + ' - ' + item.deadline);
        if (item.fileId) bot.sendDocument(chatId, item.fileId);
      });
    } else { bot.sendMessage(chatId, 'No hometask yet'); }
  } else bot.sendMessage(chatId, 'No such subject exist');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (taskFlag4) {
    if (msg.text !== 'No') {
      if (msg.document) {
        taskArr.fileId = msg.document.file_id;
      } else {
        bot.sendMessage(chatId, 'Not a file!');
      }
    } else {
      taskFlag4 = false;
      apw.appendHomeWork(taskArr.subj, taskArr.task,
        taskArr.deadline, taskArr.fileId);
      bot.sendMessage(chatId, 'Hometask has been successfully added!');
      taskArr = {};
    }
    // taskArr.deadline = msg.text;
    // console.log(taskArr);
  }
  if (taskFlag3) {
    taskArr.deadline = msg.text;
    // console.log(taskArr);
    bot.sendMessage(chatId, 'Would you like to add file or image?',
      {
        'reply_markup': { 'keyboard': [[{ text: 'No' }]],
          'one_time_keyboard': true }
      });
    taskFlag3 = false;
    taskFlag4 = true;
  }
  if (taskFlag2) {
    taskArr.task = msg.text;
    // console.log(taskArr);
    bot.sendMessage(chatId, 'Enter hometask deadline: ',
      {
        'reply_markup': { 'keyboard': [[{ text: 'auto' }]],
          'one_time_keyboard': true },
      });
    taskFlag2 = false;
    taskFlag3 = true;
  }
  if (taskFlag1) {
    taskArr.subj = msg.text;
    // console.log(taskArr);
    bot.sendMessage(chatId, 'Enter your hometask: ');
    taskFlag1 = false;
    taskFlag2 = true;
  }
});
