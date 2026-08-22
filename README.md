# Finanzas personales

Aplicación web para registrar ingresos y gastos, ver tu saldo al instante y
entender cómo se mueve tu dinero. Usa Firebase Authentication y Cloud
Firestore para autenticar usuarios y guardar sus movimientos.

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
- Los movimientos se guardan en Cloud Firestore, separados por usuario.

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (gráfica de flujo financiero)
- lucide-react (iconos)
- Firebase Authentication (login con Google)
- Cloud Firestore (persistencia de movimientos)

## Instalación local

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

La aplicación usa la configuración de Firebase definida mediante variables
`VITE_FIREBASE_*` y requiere que Cloud Firestore y Google Authentication estén
habilitados en el proyecto de Firebase.

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue en Railway

El proyecto está listo para desplegarse en [Railway](https://railway.app)
como un servicio Node. Railway detecta el proyecto con Nixpacks, instala
dependencias, corre `npm run build` automáticamente (porque existe el
script `build` en `package.json`) y luego ejecuta el comando de arranque.

Configuración incluida:

- `railway.json`: define el builder (Nixpacks) y el comando de arranque
  (`npm run start`).
- Script `start` en `package.json`: sirve la carpeta `dist` ya compilada
  con [`serve`](https://www.npmjs.com/package/serve), escuchando en el
  puerto que Railway inyecta mediante la variable de entorno `PORT`.

Pasos para desplegar:

1. Sube este proyecto a un repositorio de GitHub (o usa Railway CLI para
   subirlo directamente).
2. En Railway, crea un nuevo proyecto y selecciona **Deploy from GitHub
   repo**, apuntando a este repositorio.
3. Railway detecta el `railway.json`, instala dependencias, ejecuta
   `npm run build` y luego `npm run start`. No hace falta configurar
   variables de entorno adicionales: Railway asigna `PORT`
   automáticamente y el script `start` lo respeta.
4. Cuando el deploy termine, Railway asigna un dominio público (o puedes
   conectar uno propio). La app se sirve desde la raíz de ese dominio.

Para probar el mismo flujo en local antes de desplegar:

```bash
npm run build
npm run start
```

## Almacenamiento (Cloud Firestore)

Todos los movimientos se guardan en la subcolección
`users/{uid}/movimientos` de Cloud Firestore. La autenticación y la sesión las
gestiona Firebase Authentication; la aplicación no guarda usuarios ni
movimientos en el almacenamiento del navegador.

La sección Movimientos permite exportar un respaldo JSON e importarlo de nuevo
en Firestore para el usuario autenticado.

## Estructura del proyecto

```text
src/
├── App.tsx
├── main.tsx
├── modules/
│   ├── auth/                # autenticación, contexto y LoginPage
│   ├── dashboard/           # pantalla y componentes del dashboard
│   ├── summary/             # pantalla, resúmenes y gráfica
│   └── transactions/        # pantalla, CRUD, hook y servicio de movimientos
└── shared/
   ├── components/          # componentes reutilizables y Layout
   ├── mock/
   ├── services/            # Firebase compartido
   ├── types/
   └── utils/
```

### Sobre `TransactionManager` (el "caparazón")

`TransactionManager` es el único componente que conoce las operaciones CRUD
reales. Internamente usa `useTransactions` (que a su vez usa
`modules/transactions/services/movimientos.service.ts`) y expone un contrato estable mediante contexto
(`useTransactionManager`): datos, totales derivados, filtros y funciones
como `add`, `requestEdit`, `confirmEdit`, `requestDelete`. También es dueño
del diálogo de confirmación de borrado.

Ningún componente de presentación (formularios, listas, tarjetas) importa
`movimientos.service.ts` ni `useTransactions` directamente — todos consumen el
shell. Esto mantiene la UI desacoplada de Firestore.
