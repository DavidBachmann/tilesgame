import { Link } from "react-router-dom";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useStore } from "../../StoreCreator";
import * as css from "./Postgame.css";

export type PostgameResponse = {
  id: number;
  score: number;
  player_alias: string;
  created_at: string;
};

export function Postgame() {
  const game = useStore((store) => store.game);
  const setGameStatus = useStore((store) => store.actions.set_game_status);
  const { lowestScore } = useLeaderboard();

  return (
    <css.root>
      <css.content>
        <h2>Game over</h2>
        {game.score >= lowestScore && (
          <css.subtitle>You're on the leaderboard!</css.subtitle>
        )}
      </css.content>

      <css.buttons>
        {game.gameMode === "time-attack" && (
          <Link to="/time/leaderboard" role="button">
            Leaderboard
          </Link>
        )}
        <button onClick={() => setGameStatus("pregame")}>Dismiss</button>
      </css.buttons>
    </css.root>
  );
}
