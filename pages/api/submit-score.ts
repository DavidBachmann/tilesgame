import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import { GameState } from "../../src/types";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  timestamp: Date;
  token: string;
};

const SECRET = process.env.CYPHER_SECRET ?? String(Math.random());

const decryptWithAES = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default async function submitScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as ScorePayload;
  const { playerAlias, token, game, timestamp } = payload;

  if (!game.score || !token || !timestamp) {
    return res.status(403).json({ message: "Invalid payload" });
  }

  const decryptedGameId = decryptWithAES(token);

  if (decryptedGameId !== game.id) {
    return res.status(403).json({ message: "Nice try" });
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

  res.status(200);
}
