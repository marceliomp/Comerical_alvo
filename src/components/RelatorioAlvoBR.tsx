import { useEffect, useState } from "react";
import LogoAlvo from "./LogoAlvo";
import type { Deal } from "../types/deal";

export default function RelatorioAlvoBR() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bitrix/deals")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao carregar dados do Bitrix");
        }
        return res.json();
      })
      .then((data: Deal[]) => {
        setDeals(data);
        setLastUpdate(new Date().toLocaleString("pt-BR"));
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Carregando dados do Bitrix...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Ocorreu um erro ao carregar os dados: {error}
      </div>
    );
  }

  const totalValor = deals.reduce((acc, deal) => acc + Number(deal.OPPORTUNITY ?? 0), 0);
  const totalProbabilidade = deals.reduce(
    (acc, deal) =>
      acc + Number(deal.OPPORTUNITY ?? 0) * (Number(deal.PROBABILITY ?? 0) / 100),
    0
  );

  const chancePercentual = ((totalProbabilidade / totalValor) * 100 || 0).toFixed(1);

  return (
    <div className="p-8 bg-white text-gray-800 font-[Montserrat] min-h-screen">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14">
            <LogoAlvo />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0D3B4C]">
              Relatório Comercial — Alvo BR
            </h1>
            <p className="text-[#00A99D] font-semibold">
              Pessoas Comuns, Grandes Investidores
            </p>
          </div>
        </div>
        <p className="text-sm italic text-gray-500">
          Última atualização: {lastUpdate || "-"}
        </p>
      </header>

      <div className="grid gap-4 mb-8 md:grid-cols-3">
        <div className="bg-[#0D3B4C] text-white rounded-2xl p-4 shadow">
          <p className="text-sm">Total de Negócios Ativos</p>
          <h2 className="text-3xl font-bold">{deals.length}</h2>
        </div>
        <div className="bg-[#00A99D] text-white rounded-2xl p-4 shadow">
          <p className="text-sm">Valor Total do Pipeline</p>
          <h2 className="text-3xl font-bold">R$ {totalValor.toLocaleString("pt-BR")}</h2>
        </div>
        <div className="bg-gray-100 text-[#0D3B4C] rounded-2xl p-4 shadow">
          <p className="text-sm">Chance Real de Venda</p>
          <h2 className="text-3xl font-bold">
            R$ {totalProbabilidade.toLocaleString("pt-BR")} ({chancePercentual}%)
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0D3B4C] text-white">
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left">Responsável</th>
              <th className="p-2 text-left">Valor</th>
              <th className="p-2 text-left">Probabilidade</th>
              <th className="p-2 text-left">Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.ID} className="border-b hover:bg-gray-50 transition">
                <td className="p-2">{deal.TITLE}</td>
                <td className="p-2">{deal.ASSIGNED_BY_NAME}</td>
                <td className="p-2">
                  R$ {Number(deal.OPPORTUNITY ?? 0).toLocaleString("pt-BR")}
                </td>
                <td className="p-2">{deal.PROBABILITY ? `${deal.PROBABILITY}%` : "-"}</td>
                <td className="p-2">
                  {deal.DATE_MODIFY ? deal.DATE_MODIFY.split("T")[0] : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-8 border-t pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Alvo BR — Dashboard Integrado | Inteligência Comercial
      </footer>
    </div>
  );
}
