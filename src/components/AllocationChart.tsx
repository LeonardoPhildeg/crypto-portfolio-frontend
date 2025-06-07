import { Ativo } from "../types";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface Props {
  ativos: Ativo[];
  caixa: number
}

export default function AllocationChart({ ativos, caixa }: Props) {

  const ativosFiltrados = ativos.filter((a) => a.symbol !== "USD");

  const total = ativosFiltrados.reduce((sum, a) => sum + a.currentValueUsd, 0) + caixa;

  const dadosOrdenados = [
    ...ativosFiltrados.map(a => ({
      label: a.symbol,
      value: a.currentValueUsd
    })),
    { label: "Cash", value: caixa }
  ].sort((a, b) => b.value - a.value);

  const data = {
    labels: dadosOrdenados.map(item => {
      const percentual = ((item.value / total) * 100).toFixed(2);
      return `${item.label} (${percentual}%)`;
    }),
    datasets: [
      {
        data: dadosOrdenados.map(item => item.value),
        backgroundColor: [
          "#4ade80", "#60a5fa", "#facc15", "#f87171", "#c084fc", "#34d399", "#f472b6", "#fbbf24", "#a3e635"
        ],
        borderWidth: 1,
        borderColor: "#1e293b"
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#ccc",
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `${context.label}: $${value.toFixed(2)}`;
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
