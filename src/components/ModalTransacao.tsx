import { useState } from 'react';
import { api } from '../services/api';
import { NumericFormat } from 'react-number-format';

interface Props {
  tipo: 'aporte' | 'venda' | 'caixa';
  onClose: () => void;
  tokensList: string[];
}

export default function ModalTransacao({ tipo, onClose, tokensList }: Props) {
  const [symbol, setSymbol] = useState(tokensList[0] || '');
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('0,000000');
  const [unitPriceUsd, setUnitPriceUsd] = useState('0,00');
  const [cashAmount, setCashAmount] = useState('0,00');

  const parseToFloat = (value: string) => {
    return Number(value.replace(',', '.'));
  };

  const handleSubmit = async () => {
    const parsedQuantity = parseToFloat(quantity);
    const parsedUnitPrice = parseToFloat(unitPriceUsd);
    const parsedCashAmount = parseToFloat(cashAmount);
    const totalUsdValue = (parsedQuantity * parsedUnitPrice).toFixed(2);

    if (tipo === 'caixa') {
      if (parsedCashAmount <= 0) {
        alert('Valor a adicionar deve ser maior que zero.');
        return;
      }

      try {
        await api.post('/cash/add', {
          amount: parsedCashAmount.toFixed(2),
        });

        onClose();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Erro ao adicionar ao caixa');
      }

      return;
    }

    if (!symbol || parsedQuantity <= 0 || parsedUnitPrice <= 0 || !date) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const payload = {
      symbol,
      quantity: parsedQuantity.toFixed(6),
      unitPriceUsd: parsedUnitPrice.toFixed(2),
      totalUsdValue,
      date,
    };

    try {
      if (tipo === 'aporte') {
        await api.post('/investments', payload);
      } else {
        await api.post('/sales', payload);
      }

      onClose();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao registrar transação');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {tipo === 'aporte'
            ? 'Novo Aporte'
            : tipo === 'venda'
              ? 'Nova Venda'
              : 'Adicionar ao Caixa'}
        </h2>

        {tipo !== 'caixa' && (
          <>
            <div className="mb-4">
              <label className="block mb-1">Criptomoeda</label>
              <select
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800 text-white"
              >
                {tokensList.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Quantidade</label>
              <NumericFormat
                value={quantity}
                onValueChange={({ value }) => setQuantity(value || '0,000000')}
                decimalSeparator=","
                decimalScale={6}
                fixedDecimalScale={true}
                allowNegative={false}
                className="w-full p-2 rounded bg-zinc-800 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Preço unitário em USD</label>
              <NumericFormat
                value={unitPriceUsd}
                onValueChange={({ value }) => setUnitPriceUsd(value || '0,00')}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                prefix="R$ "
                className="w-full p-2 rounded bg-zinc-800 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800 text-white"
              />
            </div>
          </>
        )}

        {tipo === 'caixa' && (
          <div className="mb-4">
            <label className="block mb-1">Valor a adicionar (USD)</label>
            <NumericFormat
              value={cashAmount}
              onValueChange={({ value }) => setCashAmount(value || '0,00')}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              prefix="US$ "
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded ${
              tipo === 'venda'
                ? 'bg-red-600 hover:bg-red-700'
                : tipo === 'caixa'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
