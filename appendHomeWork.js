'use strict';

const fs = require('fs');

function appendHomeWork(subj, task, deadline) {

  const dataRead = fs.readFileSync('./dataBase/data.json');
  const tasksToDo = JSON.parse(dataRead);

  if (!Object.keys(tasksToDo).includes(subj)) {
    throw new Error('No such subject exist');
  }

  if (!deadline) deadline = nextClassIs(subj);

  tasksToDo[subj].push({ task, deadline });
  fs.writeFileSync('./dataBase/data.json', JSON.stringify(tasksToDo));
  console.log(tasksToDo);
}

function nextClassIs(subj) {
  const today = new Date();
  const weekday = today.getDay();
  const timeTable = JSON.parse(fs.readFileSync('./dataBase/timetable.json'));

  let i = 0;
  let daysToPrepare;
  let breaker = false;
  let currentDay;
  let currentSubject;

  while (breaker === false) {
    currentDay = (weekday + i) % 7;
    const dailyTimetable  = timeTable[currentDay];
    for (currentSubject of dailyTimetable)
      if (subj === currentSubject) {
        daysToPrepare = i;
        breaker = true;
      }
    ++i;
  }
  const nextClass = new Date();
  nextClass.setDate(today.getDate() + daysToPrepare);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  console.log(nextClass.toLocaleString('ru-Ru', options));
  return nextClass.toLocaleString('ru-Ru', options);
}

module.exports = {appendHomeWork};
