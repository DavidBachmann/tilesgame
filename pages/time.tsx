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
  timestamp: number;
  token: string;
};

type TokenRequestCallback = {
  gameId: GameState["id"];
  captcha: string;
};

async function submitScore(url: string, { arg }: { arg: ScorePayload }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

async function requestToken(
  url: string,
  { arg }: { arg: TokenRequestCallback }
) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function Time() {
  const player = usePlayer();

  const { trigger: triggerSubmitScore } = useSWRMutation(
    "/api/submit-score",
    submitScore
  );
  const { trigger: triggerRequestToken } = useSWRMutation(
    "/api/request-token",
    requestToken
  );

  return (
    <LeaderboardProvider>
      <AnimatePresence>
        <Game
          key={v4()}
          gameMode="time-attack"
          onGameOver={async (game: GameState) => {
            if (player.alias && game.score && game.id) {
              let token = "";
              let timestamp = 0;

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

                const tokenResponse = await triggerRequestToken({
                  gameId: game.id,
                  captcha,
                });

                token = tokenResponse.token;
                timestamp = tokenResponse.timestamp;
              }

              await triggerSubmitScore({
                playerAlias: player.alias,
                game,
                timestamp,
                token,
              });
            }
          }}
        />
      </AnimatePresence>
    </LeaderboardProvider>
  );
}
