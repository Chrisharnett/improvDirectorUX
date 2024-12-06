import { Card } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState, useRef } from "react";
import ResponseBox from "./ResponseBox";
import PropTypes from "prop-types";
import { FadeInContainer } from "../animation/animations";

const MessageCard = ({
  message,
  title,
  responseRequired,
  responsePlaceholder,
  setResponse,
  handleSubmit,
  startAnimation,
  setCueNextAnimation,
}) => {
  const [showContent, setShowContent] = useState(false);

  const nodeRef = useRef(null);

  useEffect(() => {
    if (startAnimation) {
      setShowContent(startAnimation);
    } else if (message) {
      setShowContent(true);
    }
  }, [message, startAnimation]);

  const handleClickSubmit = (userResponse) => {
    handleSubmit(userResponse);
    setResponse("");
  };

  return (
    <>
      {/* <CSSTransition
        in={showContent}
        timeout={700}
        classNames="fade"
        nodeRef={nodeRef}
        unmountOnExit
      > */}
      <FadeInContainer
        startAnimation={showContent}
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
          ref={nodeRef}
        >
          <>
            <Card.Title className="p-2 fs-4">{title}</Card.Title>
            <Card.Body className="fs-4">{message}</Card.Body>
            <Card.Footer>
              {responseRequired && (
                <ResponseBox
                  handleSubmit={handleClickSubmit}
                  placeHolder={responsePlaceholder}
                />
              )}
            </Card.Footer>
          </>
        </Card>
      </FadeInContainer>
    </>
  );
};

MessageCard.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  response: PropTypes.string,
  responseRequired: PropTypes.string,
  responsePlaceholder: PropTypes.string,
  setResponse: PropTypes.func,
  handleSubmit: PropTypes.func,
  startAnimation: PropTypes.bool,
  setCueNextAnimation: PropTypes.func,
};

export default MessageCard;
