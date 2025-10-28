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

const buildEndpoint = () => {
  const baseUrl = process.env.BITRIX_WEBHOOK_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      "Variável de ambiente BITRIX_WEBHOOK_URL não configurada. Defina o webhook do Bitrix24 nas configurações do projeto."
    );
  }

  const isFullEndpoint = baseUrl.endsWith(".json");
  const endpoint = isFullEndpoint
    ? new URL(baseUrl)
    : new URL("crm.deal.list.json", baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  BITRIX_FIELDS.forEach((field) => endpoint.searchParams.append("select[]", field));

  return endpoint.toString();
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

    const cachedDeals = cache.get(CACHE_KEY) as Deal[] | undefined;
    if (cachedDeals) {
      return res.status(200).json(cachedDeals);
    }

    const response = await fetch(buildEndpoint());

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
