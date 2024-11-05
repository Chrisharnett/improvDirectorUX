import { Container, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext.js";
import { useTokenContext } from "../hooks/useTokenContext.jsx";

const PlayerProfile = () => {
  const [newScreenName, setNewScreenName] = useState("");
  const [newInstrument, setNewInstrument] = useState("");
  const { sendMessage, incomingMessage, ready } = useWebSocket();
  const { currentPlayer, updateCurrentPlayer } = useUserContext();
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        await updateRefreshToken();
      }

      sendMessage(
        JSON.stringify({
          action: "getCurrentPlayer",
          currentPlayer: currentPlayer,
        })
      );
    };
    if (ready && currentPlayer?.userId) {
      sendMessageWhenReady();
    }
  }, [ready, currentPlayer]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.action === "playerProfileData") {
        updateCurrentPlayer({
          screenName: message.currentPlayer.screenName,
          instrument: message.currentPlayer.instrument,
        });
      }
    }
  }, [incomingMessage]);

  const handleUpdateProfile = async () => {
    updateCurrentPlayer({
      screenName: newScreenName,
      instrument: newInstrument,
    });
    const player = {
      ...currentPlayer,
      screenName: newScreenName,
      instrument: newInstrument,
    };
    if (accessToken && isTokenExpired(accessToken)) {
      await updateRefreshToken();
    }

    sendMessage(
      JSON.stringify({
        action: "updateProfile",
        currentPlayer: player,
      })
    );
  };

  const { screenName, instrument } = currentPlayer;

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
              value={newScreenName || screenName}
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder={screenName || "What should we call you?"}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Instruments and performance style</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newInstrument || instrument}
              onChange={(e) => setNewInstrument(e.target.value)}
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
