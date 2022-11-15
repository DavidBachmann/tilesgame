import { Link } from "react-router-dom";
import { useStore } from "../../StoreCreator";
import * as css from "./Pregame.css";

export function Pregame() {
  const game = useStore((store) => store.game);
  const init = useStore((store) => store.actions.init);

  return (
    <css.root>
      {game.gameMode === "casual" && <h2>Tiles Game</h2>}
      {game.gameMode === "time-attack" && <h2>Time-attack!</h2>}
      <css.buttons>
        <button onClick={() => init(game.gameMode, "in-progress")}>Play</button>
        {game.gameMode === "time-attack" && (
          <Link to="/time/leaderboard" role="button">
            Leaderboard
          </Link>
        )}
      </css.buttons>
    </css.root>
  );
}
