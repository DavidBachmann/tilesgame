import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { GameState } from "../../src/types";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  timestamp: Date;
};

export default async function submitScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as ScorePayload;
  const { playerAlias, game, timestamp } = payload;

  if (!game.score) {
    return;
  }

  if (!timestamp) {
    // TODO: Anti cheating of some sorts.
    return;
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
