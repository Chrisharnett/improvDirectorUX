import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FadeInContainer } from "../animation/animations";
import { useUserContext } from "../hooks/useUserContext";
import getCognitoURL from "../auth/getCognitoURL";

const HomePage = () => {
  const [showContainer, setShowContainer] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setShowContainer(true);
    return () => {
      setShowContainer(false);
    };
  }, []);

  const handleClickLink = () => {
    const loginUrl = getCognitoURL();
    window.location.href = loginUrl;
  };

  return (
    <>
      <CSSTransition
        in={showContainer}
        timeout={700}
        classNames="fade"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <>
          {/* Introduction */}
          <Container
            className="midlayer glass d-flex align-items-center justify-content-center m-auto"
            style={{ height: "auto", width: "80vw", textAlign: "center" }}
          >
            <FadeInContainer startAnimation={true}>
              <h2>Welcome to ImprovDirector!</h2>
              <p>
                ImprovDirector is an AI-powered platform that connects musicians
                and audiences in real-time. Musicians receive AI-generated
                prompts inspired by live audience feedback, making every
                performance a unique, interactive experience.
              </p>
            </FadeInContainer>
          </Container>
          {/* Join Links */}
          <Container
            className="d-flex align-items-center justify-content-center m-auto"
            style={{ height: "auto", width: "100vw" }}
            ref={nodeRef}
          >
            <Row>
              <Col md={6}>
                <FadeInContainer startAnimation={true}>
                  <Container
                    className="midLayer glass d-flex flex-column align-items-center"
                    onClick={handleClickLink}
                    style={{ cursor: "pointer" }}
                  >
                    <h3> Join a Performance </h3>
                    <p> Log in to play music. </p>
                  </Container>
                  {/* )} */}
                </FadeInContainer>
              </Col>
              <Col md={6}>
                <FadeInContainer startAnimation={true}>
                  <Link to="/audience">
                    <Container className="midLayer glass d-flex flex-column align-items-center">
                      <h3> Join the Audience </h3>
                      <p> View a live performance. </p>
                    </Container>
                  </Link>
                </FadeInContainer>
              </Col>
            </Row>
          </Container>
        </>
      </CSSTransition>
    </>
  );
};

export default HomePage;
