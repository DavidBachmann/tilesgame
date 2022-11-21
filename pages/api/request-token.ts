import CryptoJS from "crypto-js";
import { NextApiRequest, NextApiResponse } from "next";

type TokenRequestPayload = {
  gameId: string;
  captcha: string;
};

const encryptWithAES = (text: string) => {
  return CryptoJS.AES.encrypt(
    text,
    process.env.CIPHER_SECRET as string
  ).toString();
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

export default async function requestToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as TokenRequestPayload;
  let token = null;

  const results = await verifyCaptcha(payload.captcha);

  if (results.success && payload.gameId) {
    token = encryptWithAES(payload.gameId);
  }

  res.status(200).json({ token, timestamp: Date.now() });
}
