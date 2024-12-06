import { useEffect } from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext.js";
import { useTokenContext } from "../hooks/useTokenContext.jsx";
import PlayerProfileCard from "../components/PlayerProfileCard.jsx";

const PlayerProfile = () => {
  const { sendMessage, incomingMessage } = useWebSocket();
  const { currentPlayer, updateCurrentPlayer } = useUserContext();
  const { screenName, instrument } = currentPlayer;
  const { accessToken, updateRefreshToken, isTokenExpired } = useTokenContext();

  useEffect(() => {
    const getCurrentPlayer = async () => {
      let token = accessToken;
      if (accessToken && isTokenExpired(accessToken)) {
        token = await updateRefreshToken();
      }
      sendMessage(
        JSON.stringify({
          action: "getCurrentPlayer",
          currentPlayer: currentPlayer,
          token: token,
        })
      );
    };
    if (!instrument || !screenName) {
      getCurrentPlayer();
    }
  }, []);

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

  return (
    <>
      <PlayerProfileCard />
    </>
  );
};

PlayerProfile.propTypes = {
  currentPlayer: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
};

export default PlayerProfile;
