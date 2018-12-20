var database = require('./database');
var moment = require('moment');

const clientEntryDocument = document.currentScript.ownerDocument;

class ClientEntry extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});

    const template = clientEntryDocument.querySelector('#client-entry-template');
    const instance = template.content.cloneNode(true);

    shadowRoot.appendChild(instance);

    const taskButton = this.shadowRoot.querySelector('.task-button');

    taskButton.addEventListener('click', () => {
      console.log('Timer toggled.');
    });
  }

  render() {
  }

  addEntry(cid, secs, task) {
    database('entries').insert({client_id: cid, name: task, time: secs}).then((client) => {
      // Refresh entries table.
    });
  }
}

customElements.define('client-entry', ClientEntry);
