import { Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const ReactionButtons = ({
  onThumbsUpClick,
  onThumbsDownClick,
  middleButtonClick = () => {},
  disableButtons,
  disableLikeButton,
  middleButtonLabel = "",
  middleButtonHide = true,
}) => {
  return (
    <Row>
      <Col sm={2}>
        <Button
          variant="success"
          onClick={onThumbsUpClick}
          className="m-2 btn-lg"
          disabled={disableLikeButton}
        >
          <i className="bi bi-hand-thumbs-up"></i>
        </Button>
      </Col>
      {middleButtonHide ? null : (
        <Col sm={2}>
          <Button
            variant="warning"
            onClick={middleButtonClick}
            className="m-2 btn-lg"
            disabled={disableButtons}
          >
            {middleButtonLabel}
          </Button>
        </Col>
      )}

      <Col sm={2}>
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
  middleButtonClick: PropTypes.func,
  middleButtonLabel: PropTypes.string,
  middleButtonHide: PropTypes.bool,
  disableButtons: PropTypes.bool,
  disableLikeButton: PropTypes.bool,
};

export default ReactionButtons;
