var database = require('./database');
var entry = require('./entry');

const clientList = document.querySelector('.client-list');

// Fetch clients.
exports.fetchClients = () => {
  return new Promise((resolve, reject) => {
    database('clients').select().then((newClientList) => {
      for(let i = 0; i < newClientList.length; i++) {
        var newItem = document.createElement("LI");
        var newItemContent = document.createTextNode(newClientList[i].name);
        newItem.dataset.client = newClientList[i].id;
        newItem.appendChild(newItemContent);
        clientList.appendChild(newItem);
        resolve(clientList.firstChild.dataset.client);
      }
      clientList.firstChild.classList.add("active");
    }).catch((err) => {
      reject(err);
    });
  });
}

// Show client.
showClient = (cid) => {
  return new Promise((resolve, reject) => {
    const taskButton = document.querySelector('.task-button');
    const pageTitle = document.querySelector('.title');

    database('clients').select().where('id', cid).then((client) => {
      pageTitle.innerHTML = client[0].name;
      taskButton.dataset.client = client[0].id;
      entry.fetchEntries(client[0].id);
      resolve();
    }).catch();
  }).catch((err) => {
    reject(err);
  });
}

exports.showClient = (cid) => {
  showClient(cid);
}

// Add new client.
exports.addClient = () => {
  return new Promise((resolve, reject) => {
    // Remove active class elsewhere.
    var activeItem = document.querySelector('.active');
    activeItem.classList.remove('active');

    // Create new list item.
    var newClientListItem = document.createElement("LI");
    newClientListItem.classList.add('active');
    var newClientListItemContent = document.createTextNode("New Client");
    newClientListItem.appendChild(newClientListItemContent);
    clientList.appendChild(newClientListItem);

    // Add the client name field.
    document.querySelector('.content').style.display = "none";

    var newContentDiv = document.createElement("DIV");
    var clientForm = document.createElement("FORM");
    clientForm.classList.add('client-form');
    var clientNameField = document.createElement("INPUT");
    clientNameField.setAttribute('placeholder', 'Client Name');
    clientForm.appendChild(clientNameField);
    newContentDiv.appendChild(clientForm);
    document.querySelector('.container').appendChild(newContentDiv);

    // Replace the main screen and focus.
    clientNameField.focus();

    // Update sidebar.
    clientNameField.addEventListener('keyup', (e) => {
      newClientListItem.innerHTML = e.target.value;
    });

    // Listen for focus out to save/persist.
    clientNameField.addEventListener('focusout', () => {
      if (clientNameField.value.length > 1) {
        // Save to database.
        database('clients').insert({name: clientNameField.value}).then(function(c) {
          var title = clientNameField.value;
          // Replace main content area.
          while (newContentDiv.firstChild) {
            newContentDiv.removeChild(newContentDiv.firstChild);
          }
          document.querySelector('.content').style.display = "block";
          newClientListItem.dataset.client = c[0];
          showClient(c[0]);
          resolve(c[0]);
        }).catch();
      };
    });
  }).catch((err) => {
    reject(err);
  });
}
