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

    const cid = this.getAttribute('cid');
    if (cid !== null) {
      database('clients').select().where('id', cid).then((client) => {
        this.render(client[0]);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('Client ID not set.');
    }
  }

  render(clientDetails) {
    const title = this.shadowRoot.querySelector('.title');
    title.innerHTML = clientDetails.name;
  }

  static get observedAttributes() { return ['cid'] }
}

customElements.define('client-details', ClientDetails);
