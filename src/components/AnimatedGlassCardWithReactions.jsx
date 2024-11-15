import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { FadeInContainer } from "../animation/animations";
import ReactionButtons from "./ReactionButtons";

const AnimatedGlassCard = ({
  title,
  message,
  startAnimation,
  setCueNextAnimation,
  onThumbsUpClick,
  onThumbsDownClick,
}) => {
  return (
    <FadeInContainer
      startAnimation={startAnimation}
      setCueNextAnimation={setCueNextAnimation}
    >
      <Card
        className="m-2 p-2"
        style={{
          backdropFilter: "blur(10px) saturate(50%)",
          WebkitBackdropFilter: "blur(21px) saturate(50%)",
          backgroundColor: "rgba(1, 1, 1, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
          borderRadius: "15px",
          color: "rgb(255, 255, 255, 1)",
        }}
      >
        <>
          <Card.Title className="p-2 fs-4">{title}</Card.Title>
          <Card.Body className="fs-4">{message}</Card.Body>
          <Card.Footer>
            <ReactionButtons
              onThumbsUpClick={onThumbsUpClick}
              onThumbsDownClick={onThumbsDownClick}
              middleButtonHide={true}
            />
          </Card.Footer>
        </>
      </Card>
    </FadeInContainer>
  );
};

AnimatedGlassCard.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startAnimation: PropTypes.bool,
  setCueNextAnimation: PropTypes.func,
  onThumbsUpClick: PropTypes.func,
  onThumbsDownClick: PropTypes.func,
};

export default AnimatedGlassCard;
