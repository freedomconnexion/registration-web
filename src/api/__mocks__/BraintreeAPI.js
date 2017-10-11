class BraintreeAPI {
  launch() {
    return new Promise((resolve, reject) => {
      resolve();
    }); 
  }

  getNonce() {
    return new Promise((resolve, reject) => {
      resolve('nonce');
    }); 
  }
}

export default BraintreeAPI;
