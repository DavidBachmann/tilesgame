import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { GameState } from "../../../src/types";
import { solve_game } from "./solver";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  seed: string;
  gridSize: number;
};

export default async function submitScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as ScorePayload;
  const { playerAlias, game, gridSize, seed } = payload;

  const { data: record } = await client
    .from("highscore")
    .select()
    .eq("game_id", game.id);

  if (record?.length) {
    return res.status(200).end();
  }

  const verifiedScore = solve_game(game.moves, gridSize, seed);

  if (verifiedScore !== game.score) {
    return res.status(200).end();
  }

  await client
    .from("highscore")
    .insert([
      { player_alias: playerAlias, score: game.score, game_id: game.id },
    ]);

  res.status(200).end();
}
