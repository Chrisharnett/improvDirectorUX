import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import MessageCard from "../components/MessageCard.jsx";

const About = () => {
  const [aboutMe, setAboutMe] = useState("");
  const { sendMessage, incomingMessage, ready } = useWebSocket();

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      if (ready) {
        sendMessage(
          JSON.stringify({
            action: "aboutMe",
          })
        );
      }
    };

    sendMessageWhenReady();
  }, [ready]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.action === "aboutMe") {
        setAboutMe(message.message);
      }
    }
  }, [incomingMessage]);

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ width: "100vw" }}
      >
        <Container className="midLayer glass">
          <h1> About Me </h1>
          <p> {aboutMe}</p>
          <hr></hr>
          <p>
            {" "}
            This About Me section is an AI generated description. As such, it
            really is quite flattering, but does sometimes include non-truths.
            Feel welcome to contact me at harnettmusic@gmail.com with any
            questions or to fact-check.
          </p>
        </Container>
        <MessageCard />
      </Container>
    </>
  );
};

export default About;
