var database = require('./database');
var moment = require('moment');

const timerButton = document.querySelector('timer-button');

fetchEntries = (cid) => {
  return new Promise((resolve, reject) => {
    var table = document.querySelector('.entries-table');
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    var baseRow = document.createElement("TR");
    var baseColName = document.createElement("TD");
    var baseColTime = document.createElement("TD");
    baseColName.classList.add('time-table-task');
    baseColTime.classList.add('time-table-time');
    baseRow.appendChild(baseColName);
    baseRow.appendChild(baseColTime);
    table.appendChild(baseRow);
    database('entries').where({client_id: cid}).select().then((newEntries) => {
      for(let i = 0; i < newEntries.length; i++) {
        var newRow = document.createElement("TR");
        var newNameColumn = document.createElement("TD");
        var newNameColumnContent = document.createTextNode(newEntries[i].name);
        var newTimeColumn = document.createElement("TD");
        var displayTime = moment().startOf('day').minutes(newEntries[i].time).format('HH:mm');
        var newTimeColumnContent = document.createTextNode(displayTime);
        newNameColumn.appendChild(newNameColumnContent);
        newTimeColumn.appendChild(newTimeColumnContent);
        newRow.appendChild(newNameColumn);
        newRow.appendChild(newTimeColumn);
        table.appendChild(newRow);
      }
      const taskInput = document.querySelector('.time-form-field');
      taskInput.value = "";
      taskInput.focus();
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

exports.fetchEntries = (cid) => {
  fetchEntries(cid);
}

exports.addEntry = (cid, mins, task) => {
  return new Promise((resolve, reject) => {
    database('entries').insert({client_id: cid, name: task, time: mins}).then((c) => {
      fetchEntries(cid);
    });
  });
}
