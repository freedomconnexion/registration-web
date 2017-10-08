import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pager, Row, Button, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import '../App.css';


class QuantityPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantitySelected: null,
    };

    this.onProductClicked.bind(this);
  }

  onProductClicked(e) {
    this.setState({
      quantitySelected: parseInt(e.target.id, 0),
    });
  }

  onNextClicked() {
    this.props.setQuantity(this.state.quantitySelected);
    this.props.onCompleteStage('quantity');
  }

  nextButtonText() {
    const quantity = this.state.quantitySelected;

    if (!quantity || quantity === 0) {
      return (
        <span>
          Buy tickets
        </span>
      );
    }

    if (quantity < 6) {
      return (
        <span>
          Buy {quantity} {quantity === 1 ? 'ticket' : 'tickets'} for ${quantity * 75}
        </span>
      );
    }

    if (quantity === 6) {
      return (
        <span>
          Sponsor a table of 6 for $400
        </span>
      );
    }

    return null;
  }

  render() {
    return (
      <div className={this.props.processStage === 'quantity' ? '' : 'hidden'}>
        <Row>
          <Col xs={12}>
            <p className="event-specifics">
              Saturday, November 4th 2017<br />
              6:30 - 8:00 PM<br />
              Lunder Arts Center at Lesley University<br />
              <a href="https://www.lesley.edu/academics/college-of-art-design/lunder-arts-center">1801 Massachusetts Avenue, Cambridge</a><br />
            </p>
            <br />
            <p>
              Join us for an evening of apps & drinks to
              celebrate Freedom Connexion 2017
              and raise the funds to make sure our
              vital program is available to families and scholars this summer.
            </p>
          </Col>
          <Col xs={12}>
            <div align="center">
              <p className="sub-head">
                How many tickets would you like?
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={1} />
          {[1, 2, 3, 4, 5].map(index => (
            <Col key={index} xs={2}>
              <Button
                key={index}
                id={index}
                bsClass={this.state.quantitySelected === index ? 'btn-circle btn-amount active' : 'btn-circle btn-amount'}
                onClick={e => this.onProductClicked(e)}
              >
                {index}
              </Button>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xs={5}>
            <Button
              id={6}
              bsClass={this.state.quantitySelected === 6 ? 'btn-pill active' : 'btn-pill'}
              onClick={e => this.onProductClicked(e)}
            >
              Table Sponsor
            </Button>
          </Col>
          <Col xs={6}>
            <p>
              <FontAwesome name="hand-o-left" size="lg" />
              &nbsp;6 tickets + program recoginition for $400!
            </p>
            <p>
              We&nbsp;
              <FontAwesome name="heart" size="lg" style={{ color: '#FF0000' }} />
              &nbsp;our table sponsors.
            </p>
          </Col>
        </Row>
        <Row >
          <Col xs={10} xsOffset={1}>
            <Pager>
              <Pager.Item
                onSelect={e => this.onNextClicked(e)}
                disabled={!this.state.quantitySelected || this.state.quantitySelected === 0}
              >
                {this.nextButtonText()}
                &nbsp;<FontAwesome name="arrow-circle-right" size="lg" />
              </Pager.Item>
            </Pager>
          </Col>
        </Row>
      </div>
    );
  }
}

QuantityPanel.propTypes = {
  setQuantity: PropTypes.func.isRequired,
  onCompleteStage: PropTypes.func.isRequired,
  processStage: PropTypes.string.isRequired,
};

export default QuantityPanel;
