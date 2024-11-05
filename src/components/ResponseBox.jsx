import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import PropTypes from "prop-types";

const ResponseBox = ({ hidden, handleSubmit }) => {
  const [response, setResponse] = useState("");

  if (hidden) {
    return null;
  }

  return (
    <Row className="align-items-center p-3">
      <Col xs="auto">
        <Form.Control
          type="text"
          placeholder="Enter your response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="mt-2"
        />
      </Col>
      <Col xs={2}>
        <Button
          variant="primary"
          onClick={() => handleSubmit(response)}
          className="mt-2"
        >
          Submit
        </Button>
      </Col>
    </Row>
  );
};

ResponseBox.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
};

export default ResponseBox;
