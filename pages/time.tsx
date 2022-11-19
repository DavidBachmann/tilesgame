import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";
import { v4 } from "uuid";
import { LeaderboardProvider } from "../src/context/LeaderboardContext";
import { usePlayer } from "../src/context/PlayerContext";
import { GameState } from "../src/types";

const Game = dynamic(() => import("../src/Game"), { ssr: false });

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  timestamp: Date;
};

async function submitScore(url: string, { arg }: { arg: ScorePayload }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

export default function Time() {
  const player = usePlayer();
  const { trigger } = useSWRMutation("/api/submit-score", submitScore);

  return (
    <LeaderboardProvider>
      <AnimatePresence>
        <Game
          key={v4()}
          gameMode="time-attack"
          onGameOver={(game: GameState, metadata: { publish?: boolean }) => {
            if (metadata.publish && player.alias && game.score) {
              trigger({
                playerAlias: player.alias,
                game,
                timestamp: new Date(),
              });
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}
