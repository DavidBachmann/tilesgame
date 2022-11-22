import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { GameState } from "../../src/types";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

type ScorePayload = {
  playerAlias: string;
  game: GameState;
  captcha: string;
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

// TODO: Verify game.moves ([number, number][]) and tally scores server-side.
export default async function submitScore(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as ScorePayload;
  const { playerAlias, game, captcha } = payload;

  const results = await verifyCaptcha(captcha);

  if (!results.success) {
    return res.status(200).end();
  }

  const { data: record } = await client
    .from("highscore")
    .select()
    .eq("game_id", game.id);

  if (record?.length) {
    return res.status(200).end();
  }

  await client
    .from("highscore")
    .insert([
      { player_alias: playerAlias, score: game.score, game_id: game.id },
    ]);

  res.status(200).end();
}
