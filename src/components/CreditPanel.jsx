import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Well, Pager, Row, Col, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import includes from 'lodash/includes';
import { BTFieldGroup } from './Helpers';
import '../App.css';

class CreditPanel extends Component {
  constructor(props) {
    super(props);
    this.braintreeApi = props.braintreeApi;
    this.state = {
      clientToken: '',
      cvvHelp: '',
      creditCardHelp: '',
      postalCodeHelp: '',
      expirationDateHelp: '',
    };
  }

  componentDidMount() {
    this.braintreeApi.launch();
  }

  previousClicked() {
    this.props.onPreviousStage();
  }

  checkHostedFieldAndLogError(field, helpName, errorText) {
    const valid = this.braintreeApi.isHostedFieldValid(field);

    if (valid) {
      this.setState({
        [helpName]: '',
      });
    } else {
      this.setState({
        [helpName]: errorText,
      });
    }

    return valid;
  }

  donateClicked() {
    const valid = [
      this.checkHostedFieldAndLogError('cvv', 'cvvHelp', 'Please enter a valid cvv'),
      this.checkHostedFieldAndLogError('number', 'cardNumberHelp', 'Please enter a valid credit card number'),
      this.checkHostedFieldAndLogError('expirationDate', 'expirationDateHelp', 'Please enter a valid expiration date'),
      this.checkHostedFieldAndLogError('postalCode', 'postalCodeHelp', 'Please enter a valid zip code'),
    ];

    if (!includes(valid, false)) {
      this.props.processRegistration();
    } else {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const buttonText = 'Purchase';

    return (
      <div className={this.props.processStage === 'credit' ? '' : 'hidden'}>
        <Well className={this.props.processorErrors ? '' : 'hidden'}>
          <FontAwesome name="exclamation-triangle" size="lg" style={{ color: '#FF0000' }} />
          &nbsp;&nbsp;
          There were some errors processing your credit card.
          Our credit card processor returned:
          <i><strong> {this.props.processorErrorMessage} </strong></i>
          Please correct any errors and try again.
        </Well>
        <form className={this.props.processing ? 'processing' : ''}>
          <Row>
            <Col xs={8}>
              <FormGroup>
                <BTFieldGroup
                  id="card-number"
                  label="Credit Card"
                  help={this.state.cardNumberHelp}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6} >
              <FormGroup>
                <BTFieldGroup
                  id="expiration-date"
                  label="Expiration Date"
                  help={this.state.expirationDateHelp}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <BTFieldGroup
                  id="cvv"
                  label="Security Code"
                  help={this.state.cvvHelp}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <BTFieldGroup
                  id="postal-code"
                  label="Zip Code"
                  help={this.state.postalCodeHelp}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={10} xsOffset={1}>
              <Pager >
                <Pager.Item
                  previous
                  onSelect={() => this.previousClicked()}
                  disabled={this.props.processing}
                >
                  <FontAwesome name="arrow-circle-left" size="lg" />
                  Previous
                </Pager.Item> { ' ' }
                <Pager.Item
                  next
                  onSelect={() => this.donateClicked()}
                  disabled={this.props.processing}
                >
                  { buttonText }
                  <FontAwesome name="arrow-circle-right" size="lg" />
                </Pager.Item>
              </Pager>
            </Col>
          </Row>
        </form>
      </div >
    );
  }
}

CreditPanel.propTypes = {
  braintreeApi: PropTypes.shape({
    launch: PropTypes.func,
  }).isRequired,
  onPreviousStage: PropTypes.func.isRequired,
  processRegistration: PropTypes.func.isRequired,
  processStage: PropTypes.string.isRequired,
  processing: PropTypes.bool.isRequired,
  processorErrors: PropTypes.bool.isRequired,
  processorErrorMessage: PropTypes.string.isRequired,
};

export default CreditPanel;
