import type { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";
import type { Deal } from "../../../types/deal";

type ErrorResponse = {
  error: string;
};

const CACHE_KEY = "deals";
const CACHE_DURATION_MS = 5 * 60 * 1000;
const BITRIX_FIELDS = [
  "ID",
  "TITLE",
  "ASSIGNED_BY_NAME",
  "STAGE_ID",
  "OPPORTUNITY",
  "PROBABILITY",
  "DATE_MODIFY",
] as const;

const ensureDealsEndpoint = (rawUrl: string): string | null => {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const needsMethodSuffix = !/\.json($|\?)/.test(trimmed);
    const withMethod = needsMethodSuffix
      ? `${trimmed.replace(/\/+$/, "")}/crm.deal.list.json`
      : trimmed;

    const url = new URL(withMethod);

    const existingSelects = url.searchParams.getAll("select[]");
    BITRIX_FIELDS.forEach((field) => {
      if (!existingSelects.includes(field)) {
        url.searchParams.append("select[]", field);
      }
    });
    return url.toString();
  } catch (error) {
    console.error("URL do webhook Bitrix inválida", error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Deal[] | ErrorResponse>
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const rawWebhook = process.env.BITRIX_WEBHOOK_URL ?? "";
    const endpoint = ensureDealsEndpoint(rawWebhook);
    if (!endpoint) {
      return res
        .status(503)
        .json({ error: "Webhook do Bitrix não configurado. Defina BITRIX_WEBHOOK_URL." });
    }

    const cachedDeals = cache.get(CACHE_KEY) as Deal[] | undefined;
    if (cachedDeals) {
      return res.status(200).json(cachedDeals);
    }

    const response = await fetch(endpoint);

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
