import { Ativo } from '../types';
import { tokenIcons } from '../utils/tokenIcons';

interface Props {
  ativos: Ativo[];
}

export default function TabelaPortfolio({ ativos }: Props) {
  const ativosFiltrados = ativos.filter(a => a.symbol !== 'USD');

  return (
    <div className="mt-6 overflow-x-auto rounded-xl shadow bg-zinc-900 p-4">
      <h3 className="text-white text-lg font-semibold mb-3">Portfolio Assets</h3>
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th className="py-2 px-2">Name</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Value / Amount</th>
            <th className="py-2 px-2">Average Price</th>
            <th className="py-2 px-2">Profitability</th>
          </tr>
        </thead>
        <tbody>
          {ativosFiltrados.map(ativo => (
            <tr key={ativo.symbol} className="border-t border-gray-800 hover:bg-zinc-800/50">
              <td className="py-2 px-2">
                <div className="flex items-center gap-2">
                  <img
                    src={tokenIcons[ativo.symbol] || 'https://via.placeholder.com/20'}
                    alt={ativo.symbol}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-semibold">{ativo.symbol}</span>
                </div>
              </td>
              <td className="py-2 px-2">{`US$ ${ativo.currentPriceUsd}`}</td>
              <td className="py-2 px-2">
                {`US$ ${ativo.currentValueUsd}`} <br />
                <span className="text-xs text-gray-400">{ativo.quantity} tokens</span>
              </td>
              <td className="py-2 px-2">{`US$ ${ativo.averagePrice}`}</td>
              <td className="py-2 px-2">
                <span
                  className={
                    Number(ativo.rentabilidadeTotal) >= 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {`US$ ${ativo.rentabilidadeTotal}`} <br />({`${ativo.valorRentabilidadeTotal}%`})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
