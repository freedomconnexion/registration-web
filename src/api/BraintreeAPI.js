import * as Braintree from 'braintree-web';

class BraintreeAPI {
  constructor() {
    this.setupBraintree = this.setupBraintree.bind(this);
    this.clientDidCreate = this.clientDidCreate.bind(this);
    this.hostedFieldsDidCreate = this.hostedFieldsDidCreate.bind(this);
  }
  launch() {
    const url = process.env.REACT_APP_CLIENT_TOKEN_URL;

    return fetch(url, {
      method: 'post',
    })
      .then(response => response.json())
      .then(json => this.setupBraintree(json.btClientToken))
      .then(hostedFields => hostedFields);
  }

  isHostedFieldValid(key) {
    const fields = this.hostedFields.getState().fields;
    return fields[key].isValid;
  }

  setupBraintree(clientToken) {
    return Braintree.client.create({
      authorization: clientToken,
    }, this.clientDidCreate);
  }

  clientDidCreate(err, client) {
    return Braintree.hostedFields.create({
      client,
      styles: {
        input: {
          'font-size': '14pt',
        },
        'input.invalid': {
          color: 'red',
        },
        'input.valid': {
          color: 'green',
        },
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111',
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123',
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: '02/20',
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: '02145',
        },
      },
    }, this.hostedFieldsDidCreate);
  }

  hostedFieldsDidCreate(err, hostedFields) {
    this.hostedFields = hostedFields;
    return hostedFields;
  }

  getNonce() {
    return this.hostedFields.tokenize()
      .then((payload) => {
        if (payload) {
          return payload.nonce;
        }
        return null;
      });
  }
}

export default BraintreeAPI;
