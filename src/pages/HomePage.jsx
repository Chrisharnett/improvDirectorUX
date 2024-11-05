import { Container } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FadeInContainer } from "../animation/animations";
import { useUserContext } from "../hooks/useUserContext";
import getCognitoURL from "../auth/getCognitoURL";

const HomePage = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [linkMessage, setLinkMessage] = useState("log in and play music.");
  const { user } = useUserContext();

  const nodeRef = useRef(null);

  useEffect(() => {
    if (user) {
      setLinkMessage("play music.");
    }
  }, [user]);

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
          <Container
            className="d-flex align-items-center justify-content-center"
            style={{ height: "70vh", width: "100vw" }}
            ref={nodeRef}
          >
            <FadeInContainer startAnimation={true}>
              {user ? (
                <Link to="/performPage">
                  <Container className="midLayer glass d-flex flex-column align-items-center">
                    <h1> Click Here to </h1>
                    <h1> {linkMessage} </h1>
                  </Container>
                </Link>
              ) : (
                <Container
                  className="midLayer glass d-flex flex-column align-items-center"
                  onClick={handleClickLink}
                  style={{ cursor: "pointer" }}
                >
                  <h1> Click Here to </h1>
                  <h1> {linkMessage} </h1>
                </Container>
              )}
            </FadeInContainer>
          </Container>
        </>
      </CSSTransition>
    </>
  );
};

export default HomePage;
