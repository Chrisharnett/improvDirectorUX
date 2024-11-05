import { Card, Row } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const OptionCard = ({ message, onClick }) => {
  const [showContent, setShowContent] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (message) {
      setShowContent(true);
    }
  }, [message]);

  return (
    <>
      <CSSTransition
        in={showContent}
        timeout={700}
        classNames="fade"
        nodeRef={nodeRef}
        unmountOnExit
      >
        <Card
          className="m-2 p-2"
          onClick={() => onClick(message)}
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
            <Card.Title className="p-2 fs-4"></Card.Title>
            <Card.Body className="fs-4">{message}</Card.Body>
            <Card.Footer>
              <Row></Row>
            </Card.Footer>
          </>
        </Card>
      </CSSTransition>
    </>
  );
};

OptionCard.propTypes = {
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OptionCard;
