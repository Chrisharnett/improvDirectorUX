import { Container, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import useWebSocket from "../util/useWebSocket.jsx";
import PropTypes from "prop-types";

const PlayerProfile = ({ currentPlayer, setCurrentPlayer }) => {
  const [screenName, setScreenName] = useState("");
  const [instrument, setInstrument] = useState("");
  const { sendMessage, incomingMessage, ready } = useWebSocket();

  useEffect(() => {
    if (currentPlayer && currentPlayer.userId) {
      setScreenName(currentPlayer.screenName || "");
      setInstrument(currentPlayer.instrument || "");
    }
  }, [currentPlayer]);

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      if (ready && currentPlayer?.userId) {
        sendMessage(
          JSON.stringify({
            action: "getCurrentPlayer",
            currentPlayer: currentPlayer,
          })
        );
        console.log("getCurrentPlayer");
      }
    };
    if (ready && currentPlayer?.userId) {
      sendMessageWhenReady();
    }
  }, [ready, currentPlayer?.userId]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.action === "playerProfileData") {
        const player = {
          ...currentPlayer,
          screenName: message.currentPlayer.screenName,
          instrument: message.currentPlayer.instrument,
        };
        setCurrentPlayer(player);
        setScreenName(player.screenName);
        setInstrument(player.instrument);
      }
    }
  }, [incomingMessage]);

  const handleUpdateProfile = (e) => {
    const updatedPlayer = {
      ...currentPlayer,
      screenName,
      instrument,
    };

    setCurrentPlayer(updatedPlayer);

    sendMessage(
      JSON.stringify({
        action: "updateProfile",
        currentPlayer: updatedPlayer,
      })
    );
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Form className="midLayer glass d-flex flex-column">
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Stage Name</Form.Label>
            <Form.Control
              type="text"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              placeholder={screenName || "What should we call you?"}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Instruments and performance style</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={instrument || ""}
              onChange={(e) => setInstrument(e.target.value)}
              placeholder={
                instrument || "What do you play? How do you play it?"
              }
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={() => {
              handleUpdateProfile();
            }}
          >
            Update Profile{" "}
          </Button>
        </Form>
      </Container>
    </>
  );
};

PlayerProfile.propTypes = {
  currentPlayer: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
};

export default PlayerProfile;
