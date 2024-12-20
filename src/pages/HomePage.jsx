import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FadeInContainer } from "../animation/animations";
import getCognitoURL from "../auth/getCognitoURL";

const HomePage = () => {
  const [cueWelcomeMessage, setCueWelcomeMessage] = useState(true);
  const [cueOption1, setCueOption1] = useState(true);
  const [cueOption2, setCueOption2] = useState(true);

  const handleClickLink = () => {
    const loginUrl = getCognitoURL();
    window.location.href = loginUrl;
  };

  return (
    <Container
      className="midlayer glass d-flex m-5"
      style={{
        minHeight: "50vh",
        minWidth: "70vw",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FadeInContainer
        startAnimation={true}
        setCueNextAnimation={() => setCueWelcomeMessage(true)}
      >
        {/* Introduction */}
        <FadeInContainer
          startAnimation={cueWelcomeMessage}
          setCueNextAnimation={() => setCueOption1(true)}
        >
          <Container
            className="midlayer glass m-3 p-2"
            style={{ height: "auto", width: "auto", textAlign: "center" }}
          >
            {" "}
            <h2>Welcome to ImprovDirector!</h2>
            <p>I'm the improvDirector. Let's play music together.</p>
          </Container>
        </FadeInContainer>
        {/* Join Links */}
        <Container className="d-flex align-items-center justify-content-center">
          <Row>
            <Col sm={12} md={12} lg={6}>
              <FadeInContainer startAnimation={cueOption2}>
                <Link to="/audience">
                  <Container
                    className="midLayer glass flex-column align-items-center"
                    style={{ cursor: "pointer", width: "auto" }}
                  >
                    <h3> Join the Audience </h3>
                    <p> View a live performance. </p>
                  </Container>
                </Link>
              </FadeInContainer>
            </Col>

            <Col sm={12} md={12} lg={6}>
              <FadeInContainer
                startAnimation={cueOption1}
                setCueNextAnimation={setCueOption2}
              >
                <Container
                  className="midLayer glass flex-column align-items-center"
                  onClick={handleClickLink}
                  style={{ cursor: "pointer", width: "auto" }}
                >
                  <h3> Join a Performance </h3>
                  <p> Log in to play music. </p>
                </Container>
                {/* )} */}
              </FadeInContainer>
            </Col>
          </Row>
        </Container>
      </FadeInContainer>
    </Container>
  );
};

export default HomePage;
