import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";
import { v4 } from "uuid";
import { LeaderboardProvider } from "../src/context/LeaderboardContext";
import { usePlayer } from "../src/context/PlayerContext";
import { GameState } from "../src/types";

const Game = dynamic(() => import("../src/Game"), { ssr: false });

declare global {
  interface Window {
    grecaptcha: ReCaptchaInstance;
  }
}

interface ReCaptchaInstance {
  ready: (cb: () => any) => void;
  execute: (id: string, options: ReCaptchaExecuteOptions) => Promise<string>;
  render: (id: string, options: ReCaptchaRenderOptions) => any;
}

interface ReCaptchaExecuteOptions {
  action: string;
}

interface ReCaptchaRenderOptions {
  sitekey: string;
  size: "invisible";
}

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  timestamp: number;
  token: string;
  captcha: string;
};

type TokenRequestCallback = {
  gameId: GameState["id"];
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
          onGameOver={async (
            game: GameState,
            metadata: { publish?: boolean }
          ) => {
            if (metadata.publish && player.alias && game.score && game.id) {
              const { token, timestamp } = await triggerRequestToken({
                gameId: game.id,
              });

              if (
                token &&
                window.grecaptcha &&
                typeof window.grecaptcha.ready === "function"
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
                  timestamp,
                  token,
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
