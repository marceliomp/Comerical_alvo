import type { Deal } from "../types/deal";

export interface TotaisResumo {
  totalValor: number;
  totalProbabilidade: number;
  chancePercentual: string;
}

export function calcularTotais(deals: Deal[]): TotaisResumo {
  const totais = deals.reduce<{ totalValor: number; totalProbabilidade: number }>(
    (acc, deal) => {
      const valor = Number(deal.OPPORTUNITY ?? 0);
      const probabilidade = Number(deal.PROBABILITY ?? 0) / 100;

      acc.totalValor += valor;
      acc.totalProbabilidade += valor * probabilidade;

      return acc;
    },
    { totalValor: 0, totalProbabilidade: 0 }
  );

  const chancePercentual =
    totais.totalValor > 0
      ? ((totais.totalProbabilidade / totais.totalValor) * 100).toFixed(1)
      : "0.0";

  return {
    totalValor: totais.totalValor,
    totalProbabilidade: totais.totalProbabilidade,
    chancePercentual,
  };
}
