import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import PropTypes from "prop-types";

const ResponseBox = ({ hidden, handleSubmit, headerMessage }) => {
  const [response, setResponse] = useState("");

  if (hidden) {
    return null;
  }

  return (
    <Container className="midlayer glass">
      {headerMessage && (
        <Row className="align-items-center p-3 fs-4">{headerMessage}</Row>
      )}

      <Row className="align-items-center p-3">
        <Col xs={12} md={4} lg={6}>
          <Form.Control
            as="textarea"
            rows={2}
            type="text"
            placeholder="Less complicated, more simple."
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
    </Container>
  );
};

ResponseBox.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  headerMessage: PropTypes.string,
};

export default ResponseBox;
