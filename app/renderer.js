var client = require('./client');
var entry = require('./entry');
var moment = require('moment');

const addClientButton = document.querySelector('.add-client-button');
const clientList = document.querySelector('.client-list');
const pageTitle = document.querySelector('.title');
const taskButton = document.querySelector('.task-button');
const timeFormField = document.querySelector('.time-form-field');

// Create Initial State
var selectedClient = undefined;
var startTime = undefined;
var taskButtonStatus = false;
var timer;

// Promise returns current client ID.
client.fetchClients().then((c) => {
  selectedClient = c;
  client.showClient(c);
});

// Listen for Clicks

timeFormField.addEventListener('keyup', (e) => {
  document.querySelector('.time-table-task').style.display = "table-cell";
  document.querySelector('.time-table-task').innerHTML = theClient; //e.target.value;
});

addClientButton.addEventListener('click', () => {
  client.addClient().then((c) => {
    selectedClient = c;
  });
});

clientList.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName == "LI") {
    selectedClient = e.target.dataset.client;
    document.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    client.showClient(selectedClient);
  }
});

taskButton.addEventListener('click', () => {
  if (taskButtonStatus == false) {
    taskButtonStatus = true;
    startTimer();
    taskButton.innerText = "Stop";
  } else {
    taskButtonStatus = false;
    stopTimer();
    taskButton.innerText = "Start";
  }
});

startTimer = () => {
  startTime = moment().clone();
  var timerTime = moment().startOf('day');
  timer = setInterval(() => {
    timerTime.add(1, 'second');
    document.querySelector('.time-table-time').style.display = "table-cell";
    document.querySelector('.time-table-time').innerHTML = timerTime.format('HH:mm:ss');
  }, 1000);
}

stopTimer = () => {
  clearInterval(timer);
  var stopTime = moment().clone();
  var result = Math.ceil(stopTime.diff(startTime, 'minutes', true));
  var taskName = document.querySelector('.time-form-field').value;
  entry.addEntry(selectedClient, result, taskName).then();
}
