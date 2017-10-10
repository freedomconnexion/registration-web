class RegistrationAPI {
  constructor() {
    this.url = process.env.REACT_APP_REGISTRATION_URL;
  }

  process(nonce, ticketInfo, customerInfo) {
    const data = RegistrationAPI.serializeRegistration(nonce, ticketInfo, customerInfo);
    return fetch(this.url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => json);
  }

  static serializeRegistration(nonce, ticketInfo, info) {
    return ({
      ticketInfo: {
        quantity: ticketInfo.quantity,
        totalAmount: ticketInfo.totalAmount,
      },
      purchaserInfo: {
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phone: info.phone,
        address: {
          streetAddress: info.address,
          city: info.city,
          state: info.state,
          zip: info.zip,
        },
      },
      nonce,
    });
  }
}

export default RegistrationAPI;
