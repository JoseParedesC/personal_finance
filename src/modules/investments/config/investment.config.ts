import { z } from 'zod';
import type { MasterCrudConfig } from '@joseparedesc/master-crud';
import type { Investment } from '../types/investment';

const typeLabels: Record<Investment['type'], string> = { CDT: 'CDT', FUND: 'Fondo', STOCK: 'Acción', ETF: 'ETF', CRYPTO: 'Criptomoneda', BOND: 'Bono', SAVINGS: 'Ahorro remunerado', OTHER: 'Otro' };

export const investmentConfig: MasterCrudConfig<Investment> = {
  collection: 'investments', title: 'Inversiones', singularTitle: 'Inversión', codeField: 'code', nameField: 'name',
  searchableFields: ['code', 'name', 'institution'],
  columns: [
    { field: 'code', label: 'Código', sortable: true },
    { field: 'name', label: 'Nombre', sortable: true },
    { field: 'type', label: 'Tipo', render: (v) => typeLabels[v as Investment['type']] ?? String(v), sortable: true },
    { field: 'institution', label: 'Entidad', sortable: true },
    { field: 'currency', label: 'Moneda', sortable: true },
    { field: 'active', label: 'Estado' },
  ],
  formFields: [
    { name: 'code', label: 'Código', type: 'text', required: true, disabledOnEdit: true, placeholder: 'Ej: INV001' },
    { name: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: CDT Bancolombia' },
    { name: 'type', label: 'Tipo', type: 'select', required: true, options: Object.entries(typeLabels).map(([value, label]) => ({ value, label })) },
    { name: 'institution', label: 'Entidad', type: 'text', placeholder: 'Banco, broker o plataforma' },
    { name: 'currency', label: 'Moneda', type: 'text', required: true, placeholder: 'COP' },
    { name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Opcional' },
  ],
  references: [
    { collection: 'investmentOperations', field: 'investmentId', description: 'operaciones' },
    { collection: 'investmentValuations', field: 'investmentId', description: 'valoraciones' },
    { collection: 'investmentTransfers', field: 'investmentId', description: 'transferencias' },
  ],
  allowDelete: false, allowDeactivate: true,
  validationSchema: z.object({
    code: z.string().trim().min(1, 'El código es obligatorio').max(20), name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
    type: z.enum(['CDT', 'FUND', 'STOCK', 'ETF', 'CRYPTO', 'BOND', 'SAVINGS', 'OTHER']),
    institution: z.string().trim().max(100).optional(), currency: z.string().trim().regex(/^[A-Z]{3}$/, 'Usa una moneda de 3 letras, ej: COP'),
    description: z.string().trim().max(500).optional(),
  }),
};
