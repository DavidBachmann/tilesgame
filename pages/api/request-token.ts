import CryptoJS from "crypto-js";
import { NextApiRequest, NextApiResponse } from "next";

type TokenRequestPayload = {
  gameId: string;
};

const encryptWithAES = (text: string) => {
  return CryptoJS.AES.encrypt(text, process.env.CIPHER_SECRET).toString();
};

export default async function requestToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = JSON.parse(req.body) as TokenRequestPayload;
  let token = null;

  if (payload.gameId) {
    token = encryptWithAES(payload.gameId);
  }

  res.status(200).json({ token, timestamp: Date.now() });
}
