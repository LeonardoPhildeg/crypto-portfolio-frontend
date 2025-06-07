// Arquivo: src/components/GraficoEvolucao.tsx

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler, CategoryScale);

type EvolucaoItem = {
  date: string;
  valorTotal: number;
};

export default function GraficoEvolucao() {
  const [dados, setDados] = useState<EvolucaoItem[]>([]);
  const [filtroTempoUI, setFiltroTempoUI] = useState<"1y" | "2y" | "5y" | "max">("1y");
  const carregado = useRef(false); 

  const filtroTempoMap: Record<"1y" | "2y" | "5y" | "max", "month" | "quarter" | "year"> = {
    "1y": "month",
    "2y": "month",
    "5y": "quarter",
    "max": "year",
  };

  const filtroTempo = filtroTempoMap[filtroTempoUI];

  useEffect(() => {
    if (carregado.current) return;
    carregado.current = true;

    async function buscarDados() {
      try {
        const res = await api.get("/portfolio/evolucao");
        setDados(res.data);
      } catch (error) {
        console.error("Erro ao buscar dados de evolução:", error);
      }
    }
    buscarDados();
  }, []);

  const data = {
    labels: dados.map((item) => new Date(item.date)),
    datasets: [
      {
        label: "Portfolio Evolution",
        data: dados.map((item) => item.valorTotal),
        fill: true,
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: filtroTempo,
          tooltipFormat: "dd/MM/yyyy",
          displayFormats: {
            day: "dd/MM",
            month: "MM/yyyy",
            year: "yyyy",
          },
        },
        ticks: {
          color: "#ccc",
        },
      },
      y: {
        ticks: {
          color: "#ccc",
          callback: function (value: any) {
            return `$${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Value: $${context.raw.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg h-[300px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white text-lg font-semibold">Portfolio Evolution</h2>
        <div className="flex gap-2">
          {(["1y", "2y", "5y", "max"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setFiltroTempoUI(range)}
              className={`px-2 py-1 text-sm rounded ${
                filtroTempoUI === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[240px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
