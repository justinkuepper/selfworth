var database = require('./database');

const clientDetailsDocument = document.currentScript.ownerDocument;

class ClientDetails extends HTMLElement {
  constructor() {
    super();
  }

  attributeChangedCallback(name, oldAttr, newAttr) {
    if (name == "cid") {
      database('clients').select().where('id', newAttr).then((client) => {
        this.render(client[0]);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});

    const template = clientDetailsDocument.querySelector('#client-details-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }

  render(clientDetails = {name: "", id: ""}) {
    const title = this.shadowRoot.querySelector('.title');
    const clientEntries = this.shadowRoot.querySelector('.client-entries');
    title.innerHTML = clientDetails.name;
    clientEntries.setAttribute('cid', clientDetails.id);
  }

  static get observedAttributes() { return ['cid'] }
}

customElements.define('client-details', ClientDetails);
