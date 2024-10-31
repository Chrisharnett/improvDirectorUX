import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";

const ResponseBox = ({ handleSubmit }) => {
  const [response, setResponse] = useState("");
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

export default ResponseBox;
