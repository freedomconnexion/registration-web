import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import '../App.css';


function ThankYouPanel(props) {
  return (
    <div className={props.processStage === 'thank-you' ? '' : 'hidden'}>
      <Row>
        <Col xs={12}>
          <h2>See you at Apps & Drinks!</h2>
          <p>
            {"We're looking forward to celebrating Freedom Connexion with you at Apps & Drinks."}
          </p>
          <p className="event-specifics">
            Saturday, November 4th 2017<br />
            6:30 - 8:00 PM<br />
            Lunder Arts Center at Lesley University<br />
            <a href="https://www.lesley.edu/academics/college-of-art-design/lunder-arts-center">1801 Massachusetts Avenue, Cambridge</a><br />
          </p>
          <br />
          <p>
            Your credit card ending in {props.transaction.creditCardLast4} has been charged
            by Connexion in the amount of {props.transaction.totalAmount} for&nbsp;
            {props.ticketInfo.quantity} {props.ticketInfo.quantity === 1 ? 'ticket' : 'tickets'}.
          </p>
          <br />
          <p>A receipt will be emailed to you for this transaction ({props.transaction.id}).</p>
        </Col>
      </Row>
    </div>
  );
}

ThankYouPanel.propTypes = {
  processStage: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalAmount: PropTypes.string.isRequired,
    creditCardLast4: PropTypes.string.isRequired,
  }).isRequired,
  ticketInfo: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default ThankYouPanel;
