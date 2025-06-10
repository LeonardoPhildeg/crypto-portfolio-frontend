// Arquivo: src/types.ts

export interface Ativo {
  symbol: string;
  name: string;
  quantity: string;
  averagePrice: string;
  currentPriceUsd: string;
  currentValueUsd: string;
  currentValueBrl: string;
  rentabilidadeTotal: string;
  investidoTotal: string;
  valorRentabilidadeTotal: string;
}

export interface PortfolioData {
  data: Ativo[];
  totais: {
    valorInvestido: string;
    percentualLucroTotal: string;
    valorLucroTotal: string;
    valorAtualUsd: string;
    valorAtualBrl: string;
  };
}
