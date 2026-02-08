import { useFlip7Game } from "./hooks/useFlip7Game";
import { SetupScreen } from "./screens/SetupScreen";
import { PlayingScreen } from "./screens/PlayingScreen";
import { RoundEndScreen } from "./screens/RoundEndScreen";
import { GameOverScreen } from "./screens/GameOverScreen";

export default function App() {
  const game = useFlip7Game();

  switch (game.screen) {
    case "setup":
      return (
        <SetupScreen
          players={game.players}
          newPlayerName={game.newPlayerName}
          targetScore={game.targetScore}
          setNewPlayerName={game.setNewPlayerName}
          setTargetScore={game.setTargetScore}
          addPlayer={game.addPlayer}
          removePlayer={game.removePlayer}
          startGame={game.startGame}
        />
      );

    case "playing":
      return (
        <PlayingScreen
          players={game.players}
          totalScores={game.totalScores}
          roundNumber={game.roundNumber}
          totalRemainingCards={game.totalRemainingCards}
          dealerIndex={game.dealerIndex}
          playerCards={game.playerCards}
          playerStatus={game.playerStatus}
          activePlayer={game.activePlayer}
          showDeckView={game.showDeckView}
          setShowDeckView={game.setShowDeckView}
          setActivePlayer={game.setActivePlayer}
          actionMode={game.actionMode}
          flip3State={game.flip3State}
          selectActionTarget={game.selectActionTarget}
          cancelAction={game.cancelAction}
          remainingNumbers={game.remainingNumbers}
          remainingMods={game.remainingMods}
          remainingActs={game.remainingActs}
          numberOptions={game.numberOptions}
          modOptions={game.modOptions}
          actOptions={game.actOptions}
          allDone={game.allDone}
          anyFlip7={game.anyFlip7}
          dealCard={game.dealCard}
          setStatusAndAdvance={game.setStatusAndAdvance}
          advanceToNextPlayer={game.advanceToNextPlayer}
          discardCard={game.discardCard}
          endRound={game.endRound}
          undo={game.undo}
          canUndo={game.canUndo}
        />
      );

    case "roundEnd":
      return (
        <RoundEndScreen
          players={game.players}
          totalScores={game.totalScores}
          roundNumber={game.roundNumber}
          targetScore={game.targetScore}
          dealerIndex={game.dealerIndex}
          roundScoreHistory={game.roundScoreHistory}
          nextRound={game.nextRound}
        />
      );

    case "gameOver":
      return (
        <GameOverScreen
          players={game.players}
          totalScores={game.totalScores}
          roundScoreHistory={game.roundScoreHistory}
          resetGame={game.resetGame}
        />
      );
  }
}
