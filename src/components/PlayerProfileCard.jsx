import { Container, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext.js";
import { useTokenContext } from "../hooks/useTokenContext.jsx";

const PlayerProfileCard = () => {
  const { currentPlayer, updateCurrentPlayer } = useUserContext();
  const { screenName, instrument } = currentPlayer;
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();
  const [newScreenName, setNewScreenName] = useState(screenName || "");
  const [newInstrument, setNewInstrument] = useState(instrument || "");
  const { sendMessage, incomingMessage } = useWebSocket();

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
    let token = accessToken;
    if (accessToken && isTokenExpired(accessToken)) {
      token = await updateRefreshToken();
    }

    sendMessage(
      JSON.stringify({
        action: "registration",
        currentPlayer: player,
        token: token,
      })
    );
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "auto", width: "auto" }}
      >
        <Form className="midLayer glass d-flex flex-column">
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Stage Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={newScreenName}
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder={"What should we call you?"}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Instruments and performance style</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              required
              placeholder={"Tell me about the instruments you play."}
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

PlayerProfileCard.propTypes = {
  currentPlayer: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
};

export default PlayerProfileCard;
