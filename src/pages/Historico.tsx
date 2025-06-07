import { useEffect, useState } from "react";
import { api } from "../services/api";
import TabelaHistorico from "../components/TabelaHistorico";
import { Ativo } from "./Portfolio";

export interface Transacao {
  type: "deposit" | "sale";
  quantity: number;
  price: number;
  date: string;
}

export default function Historico() {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [symbol, setSymbol] = useState("");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const ativoSelecionado = ativos.find((a) => a.symbol === symbol);

  useEffect(() => {
    api.get("/portfolio").then((res) => {
      const lista = res.data.data.filter((a: Ativo) => a.symbol !== "USD");
      setAtivos(lista);
      if (lista.length > 0) {
        setSymbol(lista[0].symbol);
      }
    });
  }, []);

  useEffect(() => {
    if (symbol) {
      api.get(`/portfolio/history/${symbol}`).then((res) => {
        setTransacoes(res.data.data);
      });
    }
  }, [symbol]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Histórico de Transações
        </h2>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-bgLight text-white border border-gray-600 px-4 py-2 rounded"
        >
          {ativos.map((a) => (
            <option key={a.symbol} value={a.symbol}>
              {a.symbol}
            </option>
          ))}
        </select>
      </div>

      {ativoSelecionado && (
        <div className="mb-4 text-sm text-gray-300">
          <p>
            <span className="font-semibold">Ativo:</span> {ativoSelecionado.name} ({ativoSelecionado.symbol})
          </p>
          <p>
            <span className="font-semibold">Quantidade total em carteira:</span> {ativoSelecionado.quantity}
          </p>
        </div>
      )}

      <TabelaHistorico transacoes={transacoes} />
    </div>
  );
}
