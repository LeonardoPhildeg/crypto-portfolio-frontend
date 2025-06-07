import { Transacao } from "../pages/Historico";

interface Props {
  transacoes: Transacao[];
}

export default function TabelaHistorico({ transacoes }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-700 rounded">
        <thead className="bg-bgLight text-white">
          <tr>
            <th className="p-3">Tipo</th>
            <th className="p-3">Quantidade</th>
            <th className="p-3">Preço (USD)</th>
            <th className="p-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="p-3">{t.type === "deposit" ? "Aporte" : "Venda"}</td>
              <td className="p-3">{t.quantity}</td>
              <td className="p-3">${t.price.toFixed(2)}</td>
              <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
