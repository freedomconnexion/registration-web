import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import '../App.css';


function ThankYouPanel(props) {
  return (
    <div className={props.processStage === 'thank-you' ? '' : 'hidden'}>
      <Row>
        <Col xs={12}>
          <h2>Thank you for your donation</h2>
          <p>Thank you very much for your generous gift to Connexion&nbsp;
            on behalf of Freedom Connexion.&nbsp;
            We truly value your support for the work we do to provide a&nbsp;
            safe, fun, enriching environment for children during the summer.
          </p>
          <p>This receipt certifies that you have made this donation&nbsp;
            as a charitable contribution and that you are&nbsp;
            not receiving any goods or services in return.
          </p>
          <br />
          <p>Justin Hildebrandt</p>
          <p>Executive Director, Freedom Connexion</p>
          <br />
          <p>Transaction ID: {props.transaction.id}</p>
        </Col>
      </Row>
    </div>
  );
}

ThankYouPanel.propTypes = {
  processStage: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ThankYouPanel;
