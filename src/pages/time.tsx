import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";
import { LeaderboardProvider } from "../context/LeaderboardContext";
import { usePlayer } from "../context/PlayerContext";
import { fetcher } from "../fetcher";
import { Config, GameState } from "../types";

const Game = dynamic(() => import("../Game"), { ssr: false });

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  gridSize: Config["gridSize"];
  seed: Config["seed"];
};

export default function Time() {
  const player = usePlayer();

  const { trigger: triggerSubmitScore } = useSWRMutation(
    "/api/submit-score",
    fetcher<ScorePayload>
  );

  return (
    <LeaderboardProvider>
      <AnimatePresence>
        <Game
          gameMode="time-attack"
          onGameOver={async (game: GameState, config: Config) => {
            if (player.alias && game.score) {
              await triggerSubmitScore({
                playerAlias: player.alias,
                game,
                gridSize: config.gridSize,
                seed: config.seed,
              });
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}
