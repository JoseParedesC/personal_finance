# Finanzas personales

Aplicación web para registrar ingresos y gastos, ver tu saldo al instante y
entender cómo se mueve tu dinero. Corre completamente en el navegador: no
tiene backend, no tiene login, no envía datos a ningún servidor.

## Funcionalidades

- Registro rápido de movimientos (ingreso o gasto), con edición y eliminación.
- Saldo, ingresos y gastos calculados automáticamente.
- Listado de movimientos agrupado por fecha.
- Filtros combinables: tipo, rango de fechas y búsqueda por descripción.
- Resumen diario y resumen mensual (con promedio de gasto diario y día de
  mayor gasto).
- Gráfica de flujo financiero (ingresos, gastos y balance acumulado).
- Exportar e importar un respaldo en JSON (`finanzas-backup.json`).
- Formato de moneda en pesos colombianos (COP).
- 100% responsive: desktop, tablet y móvil.
- Todo se guarda en `localStorage`: tus datos persisten al cerrar el
  navegador y nunca salen de tu equipo.

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (gráfica de flujo financiero)
- lucide-react (iconos)
- `localStorage` como única persistencia (sin backend)

## Instalación local

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

En desarrollo, si no hay movimientos guardados, la app carga automáticamente
algunos datos de prueba (ver `src/mock/mockData.ts`). Esto **no** ocurre en
producción.

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

El proyecto incluye un workflow (`.github/workflows/deploy.yml`) que hace
build y publica automáticamente en GitHub Pages cada vez que haces push a
`main`.

Pasos para activarlo en un repositorio nuevo:

1. Sube este proyecto a un repositorio de GitHub.
2. En el repositorio, ve a **Settings → Pages** y en "Source" selecciona
   **GitHub Actions**.
3. Haz push a `main`. El workflow construye el proyecto y lo publica.

La aplicación se sirve bajo una subruta
(`https://usuario.github.io/nombre-del-repositorio/`), no en la raíz. Esto
está resuelto en `vite.config.ts`, que toma el nombre del repositorio desde
la variable de entorno `VITE_BASE_PATH` (el workflow la define
automáticamente a partir del nombre del repo). Si prefieres fijarlo a mano
para pruebas locales de build:

```bash
VITE_BASE_PATH=nombre-del-repositorio npm run build
```

## Almacenamiento (localStorage)

Todos los movimientos se guardan bajo la clave `finanzas:transactions` en
`localStorage` del navegador. Toda la lógica de lectura/escritura vive en
`src/services/storage.ts`, que es la única parte de la app que sabe que el
almacenamiento es `localStorage`. El resto del código pasa por el hook
`useTransactions` y, más arriba, por el componente `TransactionManager`.

Como los datos viven únicamente en el navegador, usa **Exportar datos** en
la sección Movimientos para generar un respaldo (`finanzas-backup.json`) y
**Importar datos** para restaurarlo en otro navegador o equipo.

## Estructura del proyecto

```text
src/
├── components/
│   ├── TransactionManager/   # shell: controla el CRUD internamente
│   ├── Dashboard/
│   ├── TransactionForm/
│   ├── TransactionList/
│   ├── Summary/
│   ├── Charts/
│   ├── Filters/
│   ├── Layout/
│   └── common/
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   └── Summary.tsx
├── hooks/
│   └── useTransactions.ts
├── services/
│   └── storage.ts
├── utils/
│   ├── currency.ts
│   ├── dates.ts
│   └── calculations.ts
├── types/
│   └── transaction.ts
├── mock/
│   ├── mockData.ts
│   └── seedDev.ts
├── App.tsx
└── main.tsx
```

### Sobre `TransactionManager` (el "caparazón")

`TransactionManager` es el único componente que conoce las operaciones CRUD
reales. Internamente usa `useTransactions` (que a su vez usa
`services/storage.ts`) y expone un contrato estable mediante contexto
(`useTransactionManager`): datos, totales derivados, filtros y funciones
como `add`, `requestEdit`, `confirmEdit`, `requestDelete`. También es dueño
del diálogo de confirmación de borrado.

Ningún componente de presentación (formularios, listas, tarjetas) importa
`storage.ts` ni `useTransactions` directamente — todos consumen el shell.
Esto permite cambiar cómo o dónde se guardan los datos sin tocar la UI.
