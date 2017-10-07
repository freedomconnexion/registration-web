import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pager, Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isAlpha, isAscii, isEmail } from 'validator';
import { FieldGroup, FieldGroupSelect } from './Helpers';
import '../App.css';

const states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

class InfoPanel extends Component {
  static isZip(value) {
    return /^\d{5}(-\d{4})?$/.test(value);
  }

  constructor(props) {
    super(props);
    this.state = {
      info: this.props.info,
    };
    this.onChange = this.onChange.bind(this);
    this.nextClicked = this.nextClicked.bind(this);
    this.previousClicked = this.previousClicked.bind(this);
  }

  onChange(e) {
    const field = e.target.id;
    const value = e.target.value;

    const info = this.state.info;
    info[field] = value;
    this.setState({ info });
  }

  validateInputAndSet(validateFunction, testValue, helpName, helpText) {
    if (validateFunction(testValue)) {
      this.setState({
        [helpName]: '' });
      return true;
    }

    this.setState({
      [helpName]: helpText });
    return false;
  }

  nextClicked() {
    const complete = [
      this.validateInputAndSet(isAlpha, this.state.info.firstName, 'firstNameHelp', 'Please enter your first name'),
      this.validateInputAndSet(isAlpha, this.state.info.lastName, 'lastNameHelp', 'Please enter your last name'),
      this.validateInputAndSet(isEmail, this.state.info.email, 'emailHelp', 'Please enter your email address'),
      this.validateInputAndSet(isAscii, this.state.info.address, 'addressHelp', 'Please enter your address', true),
      this.validateInputAndSet(isAlpha, this.state.info.city, 'cityHelp', 'Please enter your city'),
      this.validateInputAndSet(InfoPanel.isZip, this.state.info.zip, 'zipHelp', 'Please enter a valid zip code'),
    ];

    if (!complete.includes(false)) {
      this.props.setInfo(this.state.info);
      this.props.onCompleteStage();
    }
  }

  previousClicked() {
    this.props.onPreviousStage();
  }

  render() {
    return (
      <div className={this.props.processStage === 'info' ? '' : 'hidden'}>
        <form>
          <Row>
            <Col xs={6}>
              <FieldGroup
                id="firstName"
                label="First Name"
                type="text"
                placeholder=""
                help={this.state.firstNameHelp}
                onChange={this.onChange}
                value={this.props.info.firstName}
              />
            </Col>
            <Col xs={6}>
              <FieldGroup
                id="lastName"
                label="Last Name"
                type="text"
                placeholder=""
                help={this.state.lastNameHelp}
                onChange={this.onChange}
                value={this.props.info.lastName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldGroup
                id="email"
                label="Email Address"
                type="text"
                placeholder=""
                help={this.state.emailHelp}
                onChange={this.onChange}
                value={this.props.info.email}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldGroup
                id="phone"
                label="Phone Number"
                type="text"
                placeholder=""
                help={this.state.phoneHelp}
                onChange={this.onChange}
                value={this.props.info.phone}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldGroup
                id="address"
                label="Street Address"
                type="text"
                placeholder=""
                help={this.state.addressHelp}
                onChange={this.onChange}
                value={this.props.info.address}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={5}>
              <FieldGroup
                id="city"
                label="City"
                type="text"
                placeholder=""
                help={this.state.cityHelp}
                onChange={this.onChange}
                value={this.props.info.city}
              />
            </Col>
            <Col xs={3}>
              <FieldGroupSelect
                id="state"
                label="State"
                options={states}
                onChange={this.onChange}
                value={this.props.info.state}
              />
            </Col>
            <Col xs={4}>
              <FieldGroup
                id="zip"
                label="Zip Code"
                type="text"
                placeholder=""
                help={this.state.zipHelp}
                onChange={this.onChange}
                value={this.props.info.zip}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xs={10}
              xsOffset={1}
            >
              <Pager>
                <Pager.Item
                  previous
                  onSelect={() => this.previousClicked()}
                >
                  <FontAwesome
                    name="arrow-circle-left"
                    size="lg"
                  />
                  Previous
                </Pager.Item>
                { ' ' }
                <Pager.Item
                  next
                  onSelect={() => this.nextClicked()}
                >
                  Next
                  <FontAwesome
                    name="arrow-circle-right"
                    size="lg"
                  />
                </Pager.Item>
              </Pager>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

InfoPanel.propTypes = {
  setInfo: PropTypes.func.isRequired,
  onCompleteStage: PropTypes.func.isRequired,
  onPreviousStage: PropTypes.func.isRequired,
  processStage: PropTypes.string.isRequired,
  info: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
};

export default InfoPanel;
