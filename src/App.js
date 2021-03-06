import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import amplitude from 'amplitude-js';
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
        quantity: 0,
        totalAmount: '',
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
        totalAmount: '',
        creditCardLast4: '',
      },
    };
    this.braintreeApi = new BraintreeAPI();
    this.registrationApi = new RegistrationAPI();

    this.completeStage.bind(this);
    this.setQuantity.bind(this);
    this.setPurchaserInfo.bind(this);
    this.processRegistration = this.processRegistration.bind(this);

    this.amplitude = amplitude.getInstance();
  }

  componentDidMount() {
    const amplitudeId = process.env.REACT_APP_AMPLITUDE_ID;

    this.amplitude.init(amplitudeId);
    this.amplitude.logEvent(
      'Loaded App',
      {
        path: window.location.pathname,
        queryString: window.location.search,
      },
    );
  }

  setQuantity(quantity) {
    const ticketInfo = {
      quantity,
      totalAmount: quantity === 6 ? 400 : quantity * 75, // gotta add the 6 person exception
    };
    this.setState({
      ticketInfo,
    });
    this.amplitude.logEvent(
      'Set Quantity',
      ticketInfo,
    );
  }

  setPurchaserInfo(purchaserInfo) {
    this.setState({
      purchaserInfo,
    });
    this.amplitude.setUserId(purchaserInfo.email);
    this.amplitude.logEvent(
      'Set Purchaser Info',
      purchaserInfo,
    );
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
    this.amplitude.logEvent(
      'Previous Stage',
      {
        currentStage: stage,
        previousStage,
      },
    );
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

    this.amplitude.logEvent(
      'Complete Stage',
      {
        currentStage: stage,
        nextStage,
      },
    );
  }

  processRegistration() {
    this.setState({
      processing: true,
    });

    this.amplitude.logEvent('Process Registration Initiated');

    this.braintreeApi.getNonce()
      .then(nonce =>
        this.registrationApi.process(nonce, this.state.ticketInfo, this.state.purchaserInfo),
      )
      .then((result) => {
        if (result.success) {
          this.setState({
            processing: false,
            transaction: {
              id: result.transactionId,
              creditCardLast4: result.creditCardLast4,
              totalAmount: result.totalAmount,
            },
          });
          this.completeStage('credit');
          this.amplitude.logEvent(
            'Process Registration Complete',
            {
              result,
            },
          );
        } else {
          this.setState({
            processing: false,
            processorErrors: true,
            processorErrorMessage: result.err.message,
          });
          this.amplitude.logEvent(
            'Process Registration Errored',
            {
              result,
            },
          );
        }
      })
      .catch((err) => {
        this.setState({
          processing: false,
          processorErrors: true,
          processorErrorMessage: err.message,
        });
        this.amplitude.logEvent(
          'Process Registration Errored',
          {
            err,
          },
        );
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
