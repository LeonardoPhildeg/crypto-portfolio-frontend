interface Props {
  title: string;
  value: string;
  subtitle?: string;
  positive?: boolean;
}

export default function CardMetric({ title, value, subtitle, positive = true }: Props) {
  const corTexto = positive ? "text-green-400" : "text-red-400";
  const corFundo = positive ? "bg-green-400/10" : "bg-red-400/10";

  return (
    <div className={`rounded-xl p-4 shadow ${corFundo}`}>
      <div className="text-sm text-gray-300 font-medium mb-1">{title}</div>
      <div className={`text-xl font-bold ${corTexto}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
}
