var database = require('./database');

const clientListDocument = document.currentScript.ownerDocument;

class ClientList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});

    const template = clientListDocument.querySelector('#client-list-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    database('clients').select().then((clientList) => {
      this.render(clientList);
    }).catch((err) => {
      console.log(err);
    });
  }

  render(clientList) {
    const clientDetails = document.querySelector('.client-details');
    const clientListElement = this.shadowRoot.querySelector('.client-list');
    clientList.forEach((item) => {
      const clientListItem = document.createElement('li');
      const clientListItemContent = document.createTextNode(item['name']);
      clientListItem.dataset.client = item['id'];
      clientListItem.appendChild(clientListItemContent);
      clientListElement.appendChild(clientListItem);
      clientListItem.addEventListener('click', e => {
        clientDetails.setAttribute('cid', e.target.dataset.client);
      });
    });
    clientDetails.setAttribute('cid', clientListElement.firstChild.dataset.client);
  }
}

customElements.define('client-list', ClientList);
