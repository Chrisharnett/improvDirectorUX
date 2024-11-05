import { Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

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

ReactionButtons.propTypes = {
  onThumbsUpClick: PropTypes.func.isRequired,
  onThumbsDownClick: PropTypes.func.isRequired,
  onMoveOnClick: PropTypes.func.isRequired,
  disableButtons: PropTypes.bool.isRequired,
  disableLikeButton: PropTypes.bool.isRequired,
};

export default ReactionButtons;
