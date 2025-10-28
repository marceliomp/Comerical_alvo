import type { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";
import type { Deal } from "../../../types/deal";

type ErrorResponse = {
  error: string;
};

const CACHE_KEY = "deals";
const CACHE_DURATION_MS = 5 * 60 * 1000;
const BITRIX_USER_ID = process.env.BITRIX_USER_ID;
const BITRIX_TOKEN = process.env.BITRIX_TOKEN;

const BITRIX_ENDPOINT = `https://alvo.bitrix24.com.br/rest/${BITRIX_USER_ID}/${BITRIX_TOKEN}/crm.deal.list.json` +
  "?select[]=ID&select[]=TITLE&select[]=ASSIGNED_BY_NAME&select[]=STAGE_ID" +
  "&select[]=OPPORTUNITY&select[]=PROBABILITY&select[]=DATE_MODIFY";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Deal[] | ErrorResponse>
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const cachedDeals = cache.get(CACHE_KEY) as Deal[] | undefined;
    if (cachedDeals) {
      return res.status(200).json(cachedDeals);
    }

    const response = await fetch(BITRIX_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Bitrix24 respondeu com status ${response.status}`);
    }

    const data = await response.json();
    const deals: Deal[] = data?.result ?? [];

    cache.put(CACHE_KEY, deals, CACHE_DURATION_MS);

    return res.status(200).json(deals);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao consultar o Bitrix24";
    return res.status(500).json({ error: message });
  }
}
