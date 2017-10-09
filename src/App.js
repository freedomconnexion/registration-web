import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import './App.css';

// Components
import QuantityPanel from './components/QuantityPanel';
import InfoPanel from './components/InfoPanel';
import CreditPanel from './components/CreditPanel';
import ThankYouPanel from './components/ThankYouPanel';

// Apis
import BraintreeAPI from './api/BraintreeAPI';
import RegistrationAPI from './api/RegistrationAPI';


const panelTitle = (
  <div align="center">
    <span className="sub-head">{"Freedom Connexion's"}</span><br />
    <span className="head"> Apps & Drinks 2017 </span>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      processorErrors: false,
      processorErrorMessage: '',
      processStage: 'quantity',
      ticketInfo: {
        quantity: null,
        total_amount: null,
      },
      purchaserInfo: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      },
      transaction: {
        id: '',
        totalAmount: 0,
        creditCardLast4: '',
      },
    };
    this.braintreeApi = new BraintreeAPI();
    this.registrationApi = new RegistrationAPI();

    this.completeStage.bind(this);
    this.setQuantity.bind(this);
    this.setPurchaserInfo.bind(this);
    this.processRegistration = this.processRegistration.bind(this);
  }

  setQuantity(quantity) {
    this.setState({
      ticketInfo: {
        quantity,
        total_amount: quantity * 75, // gotta add the 6 person exception
      },
    });
  }

  setPurchaserInfo(purchaserInfo) {
    this.setState({
      purchaserInfo,
    });
  }

  previousStage(stage) {
    let previousStage;

    switch (stage) {
      case 'info':
        previousStage = 'quantity';
        break;
      case 'credit':
        previousStage = 'info';
        break;
      default:
        previousStage = 'quantity';
        break;
    }
    window.scrollTo(0, 0);
    this.setState({ processStage: previousStage });
  }

  completeStage(stage) {
    let nextStage;

    switch (stage) {
      case 'quantity':
        nextStage = 'info';
        break;
      case 'info':
        nextStage = 'credit';
        break;
      case 'credit':
        nextStage = 'thank-you';
        break;
      default:
        nextStage = 'info';
        break;
    }

    window.scrollTo(0, 0);
    this.setState({ processStage: nextStage });
  }

  processRegistration() {
    // Get the nonce
    this.braintreeApi.getNonce()
      .then(nonce =>
        this.registrationApi.process(nonce, this.state.ticketInfo, this.state.purchaserInfo),
      )
      .then((result) => {
        if (result.success) {
          this.setState({
            transaction: {
              id: result.transactionId,
              creditCardLast4: result.creditCardLast4,
              totalAmount: result.totalAmount,
            },
          });
          this.completeStage('credit');
        } else {
          this.setState({
            processorErrors: true,
            processorErrorMessage: result.err.message,
          });
        }
      })
      .catch((err) => {
        this.setState({
          processorErrors: true,
          processorErrorMessage: err.message,
        });
      });
  }

  render() {
    return (
      <Col xs={12} sm={12} md={5} mdOffset={7} >
        <Panel header={panelTitle} >
          <div id="outerDiv">
            <QuantityPanel
              processStage={this.state.processStage}
              onCompleteStage={() => this.completeStage('quantity')}
              setQuantity={quantity => this.setQuantity(quantity)}
            />
            <InfoPanel
              processStage={this.state.processStage}
              quantity={this.state.quantity}
              info={this.state.purchaserInfo}
              setInfo={info => this.setPurchaserInfo(info)}
              onCompleteStage={() => this.completeStage('info')}
              onPreviousStage={() => this.previousStage('info')}
            />
            <CreditPanel
              processStage={this.state.processStage}
              braintreeApi={this.braintreeApi}
              processRegistration={this.processRegistration}
              onPreviousStage={() => this.previousStage('credit')}
              processing={this.state.processing}
              processorErrors={this.state.processorErrors}
              processorErrorMessage={this.state.processorErrorMessage}
            />
            <ThankYouPanel
              processStage={this.state.processStage}
              purchaserInfo={this.state.purchaserInfo}
              ticketInfo={this.state.ticketInfo}
              transaction={this.state.transaction}
            />
          </div>
        </Panel>
      </Col>
    );
  }
}

export default App;
