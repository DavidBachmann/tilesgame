import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const client = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!);

export default async function leaderboard(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const { data: highscore } = await client
    .from("highscore")
    .select()
    .order("score", { ascending: false })
    .limit(10);

  res.status(200).json({ highscore });
}
