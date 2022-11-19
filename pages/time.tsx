import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { v4 } from "uuid";
import { LeaderboardProvider } from "../src/context/LeaderboardContext";
import { usePlayer } from "../src/context/PlayerContext";
import supabase from "../src/supabase";
import { GameState } from "../src/types";
import { debug_message } from "../src/utils";

const Game = dynamic(() => import("../src/Game"), { ssr: false });

async function submitScore({
  playerAlias,
  game,
}: {
  playerAlias: string;
  game: GameState;
}) {
  const { data: record } = await supabase
    .from("highscore")
    .select("*")
    .eq("game_id", game.id);

  if (record?.length) {
    debug_message("GAME_ID ALREADY EXISTS", "red");
    return;
  }

  const { error: submissionError } = await supabase
    .from("highscore")
    .insert([
      { player_alias: playerAlias, score: game.score, game_id: game.id },
    ]);

  if (submissionError) {
    console.error(submissionError);
    return;
  }
}

export default function Time() {
  const player = usePlayer();
  return (
    <LeaderboardProvider>
      <AnimatePresence>
        <Game
          key={v4()}
          gameMode="time-attack"
          onGameOver={(game: GameState, metadata) => {
            if (metadata.publish && player.alias && game.score) {
              submitScore({ playerAlias: player.alias, game });
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}
