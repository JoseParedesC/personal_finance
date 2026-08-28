# Guía — Presupuesto mensual de ingresos

> Complementa a `README_GUIA_FINANZAS_PERSONALES.md`. Este documento cubre
> específicamente la funcionalidad de metas de ingreso, entregada sobre el
> módulo de Presupuestos ya existente (que hasta ahora solo manejaba topes
> de gasto).

## 1. Qué cambia

El módulo **Presupuestos** ahora distingue dos tipos independientes:

| Tipo | Antes | Ahora |
|---|---|---|
| `expense` (gasto) | Único tipo soportado | Se mantiene igual: tope de gasto por categoría/mes |
| `income` (ingreso) | No existía | Meta de ingreso por categoría/mes, comparada contra lo realmente recibido |

Ambos tipos conviven en el mismo mes sin interferir entre sí (un mismo mes
puede tener metas de ingreso y topes de gasto a la vez).

## 2. Modelo de datos (backend)

`Budget` ahora tiene un campo `type: "income" | "expense"` (default
`"expense"` por compatibilidad con presupuestos creados antes de este
cambio). La unicidad pasó de `(userId, categoryId, month)` a
`(userId, categoryId, month, type)`, para permitir que una misma
categoría tenga un presupuesto de gasto y otro de ingreso en el mismo mes
si en algún caso excepcional aplicara.

Al crear un presupuesto, el backend valida que la categoría elegida
corresponda al mismo `movementType` que el `type` del presupuesto (no se
puede crear una meta de ingreso apuntando a una categoría de gasto, ni
viceversa).

El cálculo de `actual` (antes llamado `spent`) usa la misma lógica en
ambos casos: suma los movimientos de esa categoría en ese mes cuyo `type`
coincide con el `type` del presupuesto, respetando la regla de
`affectsBudget` de los bolsillos (movimientos en bolsillos con
`affectsBudget: false` no cuentan, sin importar si es ingreso o gasto).

## 3. Endpoints (sin cambios de ruta, solo de payload)

- `GET /api/budgets?month=YYYY-MM&type=income|expense` — `type` es
  opcional; sin él, devuelve ambos tipos mezclados.
- `GET /api/budgets/summary?month=YYYY-MM` — ahora devuelve `income` y
  `expense` como objetos separados, cada uno con su propio
  `totalBudgeted`/`totalActual`/`totalRemaining`/`budgets`. Los campos
  raíz (`totalBudgeted`, `totalSpent`, etc.) se mantienen por
  compatibilidad y siguen reflejando solo gastos.
- `POST /api/budgets` — acepta `type` opcional en el body (default
  `"expense"`).

## 4. Frontend

La pantalla **Presupuesto mensual** ahora muestra dos secciones
independientes, cada una con sus propias tarjetas de resumen, su propio
botón de "Nuevo tope"/"Nueva meta" y su propia lista:

1. **Presupuesto de ingresos** (arriba): tarjetas "Meta" / "Real" /
   "Faltante". La barra de progreso se pinta en verde al alcanzar o
   superar la meta (a diferencia de gastos, donde superar el tope es la
   señal de alerta).
2. **Presupuesto de gastos** (abajo): mismo comportamiento que antes,
   sin cambios visuales.

El formulario de creación (`BudgetForm`) ahora empieza con un selector
Gasto/Ingreso. Cambiar el tipo reinicia la categoría elegida, porque el
buscador de categorías filtra por `movementType` según el tipo activo.

## 5. Regla de negocio a respetar

Igual que con gastos, **una transferencia entre cuenta principal/bolsillos
no debe contarse como ingreso** solo por mover dinero de un lado a otro.
Únicamente un movimiento real de tipo `income` (un ingreso genuino:
salario, venta, dividendo, etc.) debe contar hacia una meta de ingreso.
Esto ya está garantizado porque las transferencias (`PocketTransfer`) son
una entidad completamente separada de `Transaction` y nunca se incluyen
en el cálculo de `actual`.

## 6. Migración

Si ya tenías presupuestos creados antes de este cambio, corre:

```bash
npx prisma migrate dev --name add_budget_type
```

Los presupuestos existentes quedan automáticamente como `type: "expense"`
(comportamiento idéntico al que tenían).

## 7. Verificación rápida

1. Ve a Presupuesto mensual → "Nueva meta" (sección de Ingresos).
2. Elige una categoría de tipo Ingreso (ej: "Salario") y define una meta
   de $4.000.000 para el mes actual.
3. Registra un movimiento de ingreso de $3.500.000 en esa categoría.
4. La fila debe mostrar "Real: $3.500.000 (87%)" y "Faltante: $500.000",
   con la barra en ámbar (no completó la meta todavía).
5. Registra otro ingreso de $600.000 en la misma categoría → debe pasar a
   "Real: $4.100.000 (102%)" y "Superávit: $100.000", con la barra en
   verde.
6. Confirma que el presupuesto de Gastos (sección de abajo) no se vio
   afectado por estos movimientos de ingreso.
