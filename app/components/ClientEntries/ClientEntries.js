var database = require('./database');
var moment = require('moment');

const clientEntriesDocument = document.currentScript.ownerDocument;

class ClientEntries extends HTMLElement {
  constructor() {
    super();
  }

  attributeChangedCallback(name, oldAttr, newAttr) {
    if (name == "cid") {
      database('entries').where({client_id: newAttr}).select().then((entries) => {
        this.render(entries);
      });
    }
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});

    const template = clientEntriesDocument.querySelector('#client-entries-template');
    const instance = template.content.cloneNode(true);

    shadowRoot.appendChild(instance);
  }

  render(entries = {}) {
    const table = this.shadowRoot.querySelector('.entries-table');

    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }

    for(let i = 0; i < entries.length; i++) {
      const newRow = document.createElement("tr");
      const newNameCol = document.createElement("td");
      const newNameText = document.createTextNode(entries[i].name);
      const newTimeCol = document.createElement("td");
      const displayTime = moment().startOf('day').seconds(entries[i].time).format('HH:mm:ss');
      const newTimeText = document.createTextNode(displayTime);

      newNameCol.appendChild(newNameText);
      newTimeCol.appendChild(newTimeText);
      newRow.appendChild(newNameCol);
      newRow.appendChild(newTimeCol);

      table.appendChild(newRow);
    }
  }

  static get observedAttributes() { return ['cid'] }
}

customElements.define('client-entries', ClientEntries);
