import { useEffect, useRef, useState } from 'react';
import AllocationChart from '../components/AllocationChart';
import CardMetric from '../components/CardMetric';
import GraficoEvolucao from '../components/GraficoEvolucao';
import ModalTransacao from '../components/ModalTransacao';
import TabelaPortfolio from '../components/TabelaPortfolio';
import { api } from '../services/api';
import { PortfolioData } from '../types';
import { tokenIcons } from '../utils/tokenIcons';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    data: [],
    totais: {
      valorInvestido: '0',
      percentualLucroTotal: '0',
      valorLucroTotal: '0',
      valorAtualUsd: '0',
      valorAtualBrl: '0',
    },
  });
  const [cotacaoDolar, setCotacaoDolar] = useState<string>('0');
  const [caixa, setCaixa] = useState<string>('0');
  const [modalAberto, setModalAberto] = useState<'aporte' | 'venda' | 'caixa' | null>(null);

  const carregado = useRef(false); // flag para evitar execução duplicada

  useEffect(() => {
    if (carregado.current) return;
    carregado.current = true;

    async function carregarDados() {
      try {
        const resPortfolio = await api.get('/portfolio');
        const portfolio = resPortfolio.data;
        setPortfolio(portfolio);
        console.log('Dados do portfólio carregados:', portfolio);

        setCotacaoDolar(portfolio.cotacaoDolar);

        // console.log('Total carteira USD:', totalCarteiraUsd.toFixed(2));

        const resCaixa = await api.get('/cash');
        setCaixa(resCaixa.data.usdBalance);
      } catch (error) {
        console.error('Erro ao carregar dados do portfólio:', error);
      }
    }

    carregarDados();
  }, [modalAberto]);

  const formatCurrency = (valor: string, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(valor));

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">Total Balance</h1>
          <h2 className="text-4xl font-semibold mt-2">{`${formatCurrency(portfolio.totais.valorAtualUsd, 'USD')}`}</h2>
          {
            <div className="text-xm text-gray-400">{`≈ ${formatCurrency(portfolio.totais.valorAtualBrl, 'BRL')}`}</div>
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
          value={formatCurrency(portfolio.totais.valorAtualUsd, 'USD')}
          subtitle={`${portfolio.totais.percentualLucroTotal}%`}
          positive={Number(portfolio.totais.percentualLucroTotal) >= 0}
        />
        <CardMetric
          title="Amount Invested"
          value={formatCurrency(portfolio.totais.valorInvestido, 'USD')}
          subtitle={`≈ ${formatCurrency(String(Number(portfolio.totais.valorInvestido) * Number(cotacaoDolar)), 'BRL')}`}
          positive
        />
        <CardMetric
          title="Dollar Quote"
          value={formatCurrency(cotacaoDolar, 'BRL')}
          subtitle=""
          positive
        />
        <CardMetric
          title="Cash"
          value={formatCurrency(caixa, 'USD')}
          subtitle="Available cash in USD"
          positive
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AllocationChart portfolio={portfolio} caixa={caixa} />
        <GraficoEvolucao />
      </div>

      <TabelaPortfolio ativos={portfolio.data} />

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
