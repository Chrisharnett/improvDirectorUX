import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import { useGameState } from "../hooks/useGameState.jsx";
import MessageCard from "./MessageCard.jsx";

const AudienceGameView = () => {
  const { gameState } = useGameState();
  const { roomName, performers } = gameState;
  const [sharedPrompt, setSharedPrompt] = useState("");
  const [playerPrompts, setPlayerPrompts] = useState([]);

  useEffect(() => {
    if (performers.length > 0) {
      let groupPrompt = "";
      if (!gameState.finalPrompt) {
        groupPrompt = {
          groupPrompt: performers[0]?.currentPrompts?.groupPrompt,
        };
      } else {
        groupPrompt = {
          finalPrompt: performers[0]?.currentPrompts.finalPrompt,
        };
      }

      setSharedPrompt(groupPrompt);

      const updatedPlayerPrompts = performers.map((player) => {
        return {
          screenName: player.screenName || `Player ${player.userId}`, // Assuming each player has a screenName
          prompt:
            player.currentPrompts?.performerPrompt ||
            "No individual prompt available",
        };
      });

      setPlayerPrompts(updatedPlayerPrompts);
    }
  }, [gameState, performers]);

  return (
    <Container className="midLayer glass">
      <h1>{roomName}</h1>
      <MessageCard title={"Theme"} message={gameState.centralTheme} />
      {Object.entries(sharedPrompt).map(([key, value]) => (
        <PromptCard
          key={key + value?.prompt}
          cardKey={value?.prompt + key}
          promptTitle={key}
          prompt={value?.prompt}
          hideButtons={true}
          animationDirection={"random"}
        />
      ))}
      <Row>
        {playerPrompts.map((player, index) => (
          <Col key={index} sm={12} md={6}>
            <PromptCard
              cardKey={player.prompt.prompt + index}
              promptTitle={player.screenName}
              prompt={player.prompt.prompt}
              hideButtons={true}
              animationDirection={"random"}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

AudienceGameView.propTypes = {};

export default AudienceGameView;
