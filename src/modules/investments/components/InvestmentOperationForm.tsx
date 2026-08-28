import { useState, type FormEvent } from 'react';
import { Button } from '../../../shared/components/Button';
import { Field } from '../../../shared/components/Field';
import type { OperationType } from '../types/investment';

const labels: Record<OperationType, string> = { CONTRIBUTION: 'Aporte', WITHDRAWAL: 'Retiro', BUY: 'Compra', SELL: 'Venta', INTEREST: 'Interés', DIVIDEND: 'Dividendo', FEE: 'Comisión', ADJUSTMENT: 'Ajuste' };

export function InvestmentOperationForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (v: Record<string, unknown>) => Promise<void> }) {
  const [type, setType] = useState<OperationType>('CONTRIBUTION');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(''); const [quantity, setQuantity] = useState(''); const [unitPrice, setUnitPrice] = useState(''); const [fees, setFees] = useState(''); const [description, setDescription] = useState(''); const [saving, setSaving] = useState(false);
  const needsUnits = type === 'BUY' || type === 'SELL';
  async function submit(e: FormEvent) { e.preventDefault(); setSaving(true); try { await onSubmit({ type, date, amount: Number(amount), ...(needsUnits ? { quantity: Number(quantity), unitPrice: Number(unitPrice) } : {}), fees: fees ? Number(fees) : 0, description: description || undefined }); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="space-y-4">
    <Field label="Tipo"><select value={type} onChange={e => setType(e.target.value as OperationType)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm">{Object.entries(labels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
    <Field label="Fecha"><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" required /></Field>
    <Field label="Monto"><input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" required /></Field>
    {needsUnits && <div className="grid gap-3 sm:grid-cols-2"><Field label="Cantidad"><input type="number" min="0.000001" step="0.000001" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" required /></Field><Field label="Precio por unidad"><input type="number" min="0.000001" step="0.000001" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" required /></Field></div>}
    <Field label="Comisiones"><input type="number" min="0" step="0.01" value={fees} onChange={e => setFees(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" /></Field>
    <Field label="Descripción"><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" rows={3} /></Field>
    <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Registrar'}</Button></div>
  </form>;
}
