import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";
import { LeaderboardProvider } from "../src/context/LeaderboardContext";
import { usePlayer } from "../src/context/PlayerContext";
import { fetcher } from "../src/fetcher";
import { GameState } from "../src/types";

const Game = dynamic(() => import("../src/Game"), { ssr: false });

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  captcha: string;
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
          onGameOver={async (game: GameState) => {
            if (player.alias && game.score && game.id) {
              if (
                window.grecaptcha &&
                typeof window.grecaptcha.execute === "function"
              ) {
                const captcha = await window.grecaptcha.execute(
                  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                  {
                    action: "submit",
                  }
                );

                await triggerSubmitScore({
                  playerAlias: player.alias,
                  game,
                  captcha,
                });
              }
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}
