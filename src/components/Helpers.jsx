import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const FieldGroup = ({ id, label, help, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl id={id} {...props} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

FieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
};

FieldGroup.defaultProps = {
  help: '',
};

const BTFieldGroup = ({ id, label, help, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <div id={id} {...props} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

BTFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
};

BTFieldGroup.defaultProps = {
  help: '',
};

const FieldGroupSelect = ({ id, label, help, options, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl id={id} componentClass="select" {...props}>
      {options.map(option =>
        <option value={option} key={option}>{option}</option>,
      )}
    </FormControl>
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

FieldGroupSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FieldGroupSelect.defaultProps = {
  help: '',
};

function isCurrency(input) {
  const re = /^([1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|\.[0-9]{1,2})$/;
  return re.test(input);
}

export { FieldGroup, FieldGroupSelect, BTFieldGroup, isCurrency };
