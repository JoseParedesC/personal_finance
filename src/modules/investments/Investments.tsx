import { useEffect, useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../auth/context/AuthContext';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { createOperation, createValuation, getInvestments, getInvestmentSummary, getOperations, getValuations } from './services/investments.service';
import type { Investment, InvestmentOperation, InvestmentValuation, OperationType } from './types/investment';
import { InvestmentOperationForm } from './components/InvestmentOperationForm';
import { InvestmentValuationForm } from './components/InvestmentValuationForm';

const money = (v: number | null | undefined, currency = 'COP') => new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 2 }).format(v ?? 0);
const opLabels: Record<OperationType, string> = { CONTRIBUTION:'Aporte', WITHDRAWAL:'Retiro', BUY:'Compra', SELL:'Venta', INTEREST:'Interés', DIVIDEND:'Dividendo', FEE:'Comisión', ADJUSTMENT:'Ajuste' };

export function Investments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [summary, setSummary] = useState<Investment | null>(null);
  const [operations, setOperations] = useState<InvestmentOperation[]>([]);
  const [valuations, setValuations] = useState<InvestmentValuation[]>([]);
  const [modal, setModal] = useState<'operation'|'valuation'|null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const rows = await getInvestments();
      setInvestments(rows);
      if (!selectedId && rows[0]) setSelectedId(rows[0].id);
      if (selectedId && !rows.some((row) => row.id === selectedId)) setSelectedId(rows[0]?.id ?? '');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function refreshDetail(id = selectedId) {
    if (!id) return;
    const [s, o, v] = await Promise.all([getInvestmentSummary(id), getOperations(id), getValuations(id)]);
    setSummary(s);
    setOperations(o);
    setValuations(v);
  }

  useEffect(() => { void refreshDetail(); }, [selectedId]);

  if (!user) return null;

  return <div className="space-y-6">
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Inversiones</h2>
      <p className="text-sm text-slate">Gestiona las operaciones y consulta la rentabilidad de tus inversiones.</p>
    </div>

    <div>
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Operaciones y rentabilidad</h3>
        <p className="text-sm text-slate">Selecciona una inversión configurada para registrar operaciones y revisar su resultado.</p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate">Inversión</label>
            <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <option value="">Selecciona una inversión</option>
              {investments.map(i=><option key={i.id} value={i.id}>{i.code} · {i.name}</option>)}
            </select>
          </div>
          <Button onClick={()=>setModal('operation')} disabled={!selectedId}><Plus size={15}/> Operación</Button>
          <Button variant="secondary" onClick={()=>setModal('valuation')} disabled={!selectedId}>Registrar valoración</Button>
        </div>

        {loading ? <p className="py-10 text-center text-sm text-slate">Cargando inversiones...</p> : !selectedId ? <Card><p className="text-sm text-slate">Crea una inversión en el maestro para comenzar.</p></Card> : summary && <><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card><p className="text-xs text-slate">Capital neto</p><p className="mt-1 font-display text-xl font-semibold">{money(summary.netCapital, summary.currency)}</p></Card>
          <Card><p className="text-xs text-slate">Valor actual</p><p className="mt-1 font-display text-xl font-semibold">{money(summary.currentValue, summary.currency)}</p></Card>
          <Card><p className="text-xs text-slate">Ganancia total</p><p className="mt-1 font-display text-xl font-semibold">{money(summary.totalGain, summary.currency)}</p></Card>
          <Card><p className="text-xs text-slate">Rentabilidad</p><p className="mt-1 flex items-center gap-1 font-display text-xl font-semibold"><TrendingUp size={18}/>{summary.returnPct?.toFixed(2) ?? '0.00'}%</p></Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><h3 className="font-display text-lg font-semibold">Resumen</h3><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate">Aportes</dt><dd className="font-medium">{money(summary.contributions, summary.currency)}</dd></div><div><dt className="text-slate">Retiros</dt><dd className="font-medium">{money(summary.withdrawals, summary.currency)}</dd></div><div><dt className="text-slate">Ganancia realizada</dt><dd className="font-medium">{money(summary.realizedGain, summary.currency)}</dd></div><div><dt className="text-slate">Ganancia no realizada</dt><dd className="font-medium">{money(summary.unrealizedGain, summary.currency)}</dd></div><div><dt className="text-slate">Intereses/dividendos</dt><dd className="font-medium">{money(summary.income, summary.currency)}</dd></div><div><dt className="text-slate">Comisiones</dt><dd className="font-medium">{money(summary.fees, summary.currency)}</dd></div></dl></Card>
          <Card><h3 className="font-display text-lg font-semibold">Valoraciones</h3><div className="mt-3 divide-y divide-line">{valuations.slice(0,6).map(v=><div key={v.id} className="flex justify-between py-2 text-sm"><span>{v.date}</span><span className="font-medium">{money(v.totalValue, summary.currency)}</span></div>)}{!valuations.length&&<p className="py-4 text-sm text-slate">Sin valoraciones registradas.</p>}</div></Card>
        </div>
        <Card><h3 className="font-display text-lg font-semibold">Operaciones</h3><div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wide text-slate"><th className="px-2 py-2">Fecha</th><th className="px-2 py-2">Tipo</th><th className="px-2 py-2">Cantidad</th><th className="px-2 py-2">Monto</th><th className="px-2 py-2">Comisión</th></tr></thead><tbody className="divide-y divide-line">{operations.slice().reverse().map(o=><tr key={o.id}><td className="px-2 py-2">{o.date}</td><td className="px-2 py-2">{opLabels[o.type]}</td><td className="px-2 py-2">{o.quantity ?? '—'}</td><td className="px-2 py-2">{money(o.amount, summary.currency)}</td><td className="px-2 py-2">{money(o.fees, summary.currency)}</td></tr>)}</tbody></table>{!operations.length&&<p className="py-6 text-center text-sm text-slate">Aún no hay operaciones.</p>}</div></Card>
        </>}
      </div>
    </div>

    <Modal isOpen={modal==='operation'} onClose={()=>setModal(null)} title="Registrar operación"><InvestmentOperationForm onCancel={()=>setModal(null)} onSubmit={async v=>{ await createOperation(selectedId, v as never); setModal(null); await refreshDetail(); }}/></Modal>
    <Modal isOpen={modal==='valuation'} onClose={()=>setModal(null)} title="Registrar valoración"><InvestmentValuationForm onCancel={()=>setModal(null)} onSubmit={async v=>{ await createValuation(selectedId, v as never); setModal(null); await refreshDetail(); }}/></Modal>
  </div>;
}
