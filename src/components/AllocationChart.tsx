import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PortfolioData } from '../types';

Chart.register(ArcElement, Tooltip, Legend);

interface Props {
  portfolio: PortfolioData;
  caixa: string;
}

export default function AllocationChart({ portfolio, caixa }: Props) {
  const total = Number(portfolio.totais.valorAtualUsd) + Number(caixa);

  const dadosOrdenados = [
    ...portfolio.data.map(a => ({
      label: a.symbol,
      value: a.currentValueUsd,
    })),
    { label: 'Cash', value: caixa },
  ].sort((a, b) => Number(b.value) - Number(a.value));

  const data = {
    labels: dadosOrdenados.map(item => {
      const percentual = ((Number(item.value) / total) * 100).toFixed(2);
      return `${item.label} (${percentual}%)`;
    }),
    datasets: [
      {
        data: dadosOrdenados.map(item => item.value),
        backgroundColor: [
          '#4ade80',
          '#60a5fa',
          '#facc15',
          '#f87171',
          '#c084fc',
          '#34d399',
          '#f472b6',
          '#fbbf24',
          '#a3e635',
        ],
        borderWidth: 1,
        borderColor: '#1e293b',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#ccc',
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `${context.label}: $${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 h-[280px]">
      <h2 className="text-white text-lg font-semibold">Allocation</h2>
      <div className="h-full">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
