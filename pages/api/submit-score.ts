import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import { GameState } from "../../src/types";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  timestamp: number;
  token: string;
  captcha: string;
};

const decryptWithAES = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    process.env.CIPHER_SECRET as string
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};

const verifyCaptcha = async (
  response: string
): Promise<{ success: boolean; score: number }> => {
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${response}`;
  let res = {
    success: false,
    score: 0,
  };

  try {
    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const response = await recaptchaRes.json();
    res = {
      success: response.success,
      score: response.score,
    };
  } catch (e) {
    console.error(e);
  }

  return res;
};

export default async function submitScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as ScorePayload;
  const { playerAlias, token, game, timestamp, captcha } = payload;

  if (!game.score || !token) {
    return res.status(403).json({ message: "Invalid payload" });
  }

  const results = await verifyCaptcha(captcha);

  console.log({ results });

  if (!results?.success) {
    // Silent failure
    return res.status(200);
  }

  const timeDiff = Date.now() - timestamp;
  const decryptedGameId = decryptWithAES(token);

  console.log({ timeDiff });

  if (decryptedGameId !== game.id || timeDiff >= 1500) {
    // Silent failure
    return res.status(200);
  }

  const { data: record } = await client
    .from("highscore")
    .select("*")
    .eq("game_id", game.id);

  if (record?.length) {
    console.log("Game", game.id, "already exists");
    return;
  }

  await client
    .from("highscore")
    .insert([
      { player_alias: playerAlias, score: game.score, game_id: game.id },
    ]);

  res.status(200).send(undefined);
}
