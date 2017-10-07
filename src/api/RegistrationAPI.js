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
      ticket_info: {
        quantity: ticketInfo.quantity,
        total_amount: ticketInfo.total_amount,
      },
      purchaser_info: {
        first_name: info.firstName,
        last_name: info.lastName,
        email: info.email,
        phone: info.phone,
        address: {
          street_address: info.address,
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
