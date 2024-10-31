import { Button, Row, Col } from "react-bootstrap";

const ReactionButtons = ({
  onThumbsUpClick,
  onThumbsDownClick,
  onMoveOnClick,
  disableButtons,
  disableLikeButton,
}) => {
  return (
    <Row>
      <Col>
        <Button
          variant="success"
          onClick={onThumbsUpClick}
          className="m-2 btn-lg"
          disabled={disableLikeButton}
        >
          <i className="bi bi-hand-thumbs-up"></i>
        </Button>
      </Col>

      <Col>
        <Button
          variant="warning"
          onClick={onMoveOnClick}
          className="m-2 btn-lg"
          disabled={disableButtons}
        >
          Move On
        </Button>
      </Col>

      <Col>
        <Button
          variant="danger"
          onClick={onThumbsDownClick}
          className="m-2 btn-lg"
          disabled={disableButtons}
        >
          <i className="bi bi-hand-thumbs-down"></i>
        </Button>
      </Col>
    </Row>
  );
};

export default ReactionButtons;
