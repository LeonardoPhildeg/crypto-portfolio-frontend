import { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import AllocationChart from '../components/AllocationChart';
import CardMetric from '../components/CardMetric';
import TabelaPortfolio from '../components/TabelaPortfolio';
import ModalTransacao from '../components/ModalTransacao';
import GraficoEvolucao from '../components/GraficoEvolucao';
import { Ativo } from '../types';
import { tokenIcons } from '../utils/tokenIcons';

export default function Portfolio() {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [cotacaoDolar, setCotacaoDolar] = useState<string>('0');
  const [valorInvestido, setValorInvestido] = useState<string>('0');
  const [rentabilidadeTotal, setRentabilidadeTotal] = useState<{
    valor: string;
    percentual: string;
  }>({ valor: '0', percentual: '0' });
  const [caixa, setCaixa] = useState<string>('0');
  const [modalAberto, setModalAberto] = useState<'aporte' | 'venda' | 'caixa' | null>(null);

  const carregado = useRef(false); // flag para evitar execução duplicada

  useEffect(() => {
    if (carregado.current) return;
    carregado.current = true;

    async function carregarDados() {
      try {
        const resPortfolio = await api.get('/portfolio');
        const ativos = resPortfolio.data.data;
        setAtivos(ativos);

        const investido = ativos.reduce((sum, ativo) => sum + ativo.investido, 0);
        setValorInvestido(investido);

        const valorAtual = ativos.reduce((sum, ativo) => sum + ativo.currentValueUsd, 0);
        setRentabilidadeTotal({
          valor: Number(valorAtual) - Number(investido),
          percentual: investido > 0 ? ((valorAtual - investido) / investido) * 100 : 0,
        });

        const resCaixa = await api.get('/cash');
        setCaixa(resCaixa.data.usdBalance);

        // Usar API pública para cotação do dólar
        const resDolar = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL').then(
          r => r.json()
        );
        const valorDolar = parseFloat(resDolar.USDBRL?.bid ?? '0');
        setCotacaoDolar(valorDolar);
      } catch (error) {
        console.error('Erro ao carregar dados do portfólio:', error);
      }
    }

    carregarDados();
  }, [modalAberto]);

  const totalCarteiraUsd =
    ativos.reduce((sum, ativo) => sum + Number(ativo.currentValueUsd), 0) + caixa;

  const formatUSD = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(valor);
  const formatBRL = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // console.log('Total carteira USD:', totalCarteiraUsd.toFixed(2));
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">Total Balance</h1>
          <h2 className="text-4xl font-semibold mt-2">{formatUSD(totalCarteiraUsd)}</h2>
          {
            <div className="text-xm text-gray-400">{`≈ ${formatBRL(totalCarteiraUsd * cotacaoDolar)}`}</div>
          }
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModalAberto('aporte')}
            className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700"
          >
            + Buy
          </button>
          <button
            onClick={() => setModalAberto('venda')}
            className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700"
          >
            + Sell
          </button>
          <button
            onClick={() => setModalAberto('caixa')}
            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            + Cash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <CardMetric
          title="Total Profitability"
          value={formatUSD(rentabilidadeTotal.valor)}
          subtitle={`${rentabilidadeTotal.percentual.toFixed(2)}%`}
          positive={rentabilidadeTotal.valor >= 0}
        />
        <CardMetric
          title="Amount Invested"
          value={formatUSD(valorInvestido)}
          subtitle={`≈ ${formatBRL(valorInvestido * cotacaoDolar)}`}
          positive
        />
        <CardMetric title="Dollar Quote" value={formatBRL(cotacaoDolar)} subtitle="" positive />
        <CardMetric
          title="Cash"
          value={formatUSD(caixa)}
          subtitle="Available cash in USD"
          positive
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AllocationChart ativos={ativos} caixa={caixa} />
        <GraficoEvolucao />
      </div>

      <TabelaPortfolio ativos={ativos} />

      {modalAberto && (
        <ModalTransacao
          tipo={modalAberto}
          onClose={() => {
            carregado.current = false;
            setModalAberto(null);
          }}
          tokensList={Object.keys(tokenIcons)}
        />
      )}
    </div>
  );
}
