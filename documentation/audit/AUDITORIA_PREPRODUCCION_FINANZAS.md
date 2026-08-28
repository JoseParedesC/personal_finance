# Auditoría preproducción — Finanzas Personales

## Alcance

Se revisaron los dos archivos entregados:

- `personal_finance_backend.zip`
- `personal_finance_frontend.zip`

Se inspeccionaron estructura, servicios REST consumidos por el frontend, formularios, hooks, cálculos, autenticación, bolsillos, transferencias, presupuestos, deudas, tarjetas, importación/exportación y flujo responsive.

### Hallazgo de alcance crítico

Los dos ZIP entregados contienen esencialmente el mismo proyecto React/Vite de frontend. El archivo llamado `personal_finance_backend.zip` **no contiene un backend NestJS**: contiene `src/App.tsx`, `src/modules/*`, `vite.config.ts`, `index.html`, `package.json`, etc.

Además, el `README.md` incluido todavía describe Firebase/Firestore, mientras que el código actual usa una API REST mediante `VITE_API_URL`, JWT y Google Identity Services.

**Conclusión:** no es posible certificar la lógica del backend, Prisma/DB, transacciones atómicas, autorización por usuario ni validaciones server-side hasta disponer del backend real.

---

# Resumen ejecutivo

| Prioridad | Cantidad | Tema |
|---|---:|---|
| P0 — Bloqueante | 4 | Backend ausente, seguridad, integridad financiera y contrato API |
| P1 — Alta | 10 | Errores funcionales o estados inconsistentes |
| P2 — Media | 9 | UX, robustez, validaciones y mantenimiento |
| P3 — Baja | 5 | Limpieza, documentación y calidad |

**No recomendaría pasar a producción todavía.**

Los puntos más importantes son:

1. Entregar y auditar el backend real.
2. Garantizar que todas las operaciones monetarias sean atómicas y estén protegidas por usuario.
3. Corregir la edición de movimientos: actualmente el formulario no inicializa correctamente la categoría y puede perder relaciones con bolsillos/tarjetas inactivas.
4. Actualizar el Dashboard/Resumen después de pagos de tarjetas.
5. Evitar que se pueda cargar un bolsillo inactivo.
6. Corregir la importación para que valide esquema, duplicados y errores.
7. Sustituir errores silenciosos y `alert()/confirm()` por un sistema consistente.
8. Definir reglas contables explícitas para tarjetas, deudas, bolsillos y presupuesto.
9. Añadir pruebas automatizadas de invariantes financieras.
10. Corregir documentación y configuración de despliegue.

---

# P0 — Bloqueantes antes de producción

## P0-01 — El supuesto backend no está incluido

### Evidencia

El ZIP denominado `personal_finance_backend.zip` contiene un proyecto Vite/React:

```text
src/App.tsx
src/modules/auth/
src/modules/budgets/
src/modules/categories/
src/modules/credit-cards/
src/modules/debts/
src/modules/pockets/
src/modules/summary/
src/modules/transactions/
vite.config.ts
index.html
```

El frontend consume endpoints como:

```text
POST   /auth/google
GET    /auth/me

GET    /transactions
POST   /transactions
PATCH  /transactions/:id
DELETE /transactions/:id

GET    /pockets
POST   /pockets
PATCH  /pockets/:id
DELETE /pockets/:id

GET    /pockets/general
GET    /pockets/transfers
POST   /pockets/transfers

GET    /credit-cards
POST   /credit-cards
PATCH  /credit-cards/:id
DELETE /credit-cards/:id

GET    /credit-cards/:id/payments
POST   /credit-cards/:id/payments

GET    /budgets
GET    /budgets/summary
POST   /budgets
PATCH  /budgets/:id
DELETE /budgets/:id

GET    /debts
POST   /debts
PATCH  /debts/:id
DELETE /debts/:id
POST   /debts/:id/installments/:id/pay
POST   /debts/:id/installments/:id/unpay
```

Pero el backend que debería implementar esos contratos no está presente.

### Riesgo

No se puede comprobar:

- Autorización.
- Aislamiento de datos por usuario.
- Validación de montos.
- Integridad de saldos.
- Transacciones de base de datos.
- Prevención de duplicados.
- Control de concurrencia.
- Reglas de tarjetas.
- Reglas de deudas.
- Reglas de presupuesto.
- Eliminación segura.
- Validación de importaciones.

### Corrección

Entregar el backend real y hacer una auditoría contrato por contrato.

---

## P0-02 — Token JWT guardado en `localStorage`

El frontend utiliza:

```text
localStorage["accessToken"]
```

Esto facilita persistir la sesión, pero expone el token a robo en caso de XSS.

### Corrección recomendada

Preferiblemente:

- Access token de vida corta.
- Refresh token en cookie `HttpOnly`, `Secure`, `SameSite`.
- Rotación de refresh tokens.
- Protección CSRF si corresponde.
- Invalidación de sesión en backend.

Si se mantiene `localStorage`, debe existir una política XSS muy estricta y CSP robusta.

---

## P0-03 — La integridad financiera no puede depender del frontend

El formulario de transferencias valida:

- monto > 0;
- origen diferente del destino;
- saldo suficiente.

Pero esas validaciones son sólo UX.

Un atacante puede llamar directamente a la API.

### El backend debe validar obligatoriamente

Para transferencias:

```text
amount > 0
from != to
origen válido
destino válido
origen perteneciente al usuario
destino perteneciente al usuario
saldo suficiente
```

Y la operación debe ejecutarse dentro de **una transacción de base de datos**.

Ejemplo:

```text
BEGIN

bloquear origen
bloquear destino

comprobar saldo
restar origen
sumar destino
crear transferencia

COMMIT
```

Nunca hacer:

```text
UPDATE origen
...
UPDATE destino
...
INSERT transferencia
```

como operaciones independientes.

---

## P0-04 — Falta de pruebas de invariantes financieras

Antes de producción deben existir pruebas automáticas para garantizar invariantes.

### Invariante principal

Una transferencia interna no cambia el dinero total:

```text
total antes = total después
```

### Ejemplo

```text
Cuenta principal  5.000.000
Ahorros           1.000.000
Total             6.000.000
```

Después:

```text
Cuenta principal  4.000.000
Ahorros           2.000.000
Total             6.000.000
```

### Otras pruebas obligatorias

- No permitir saldo negativo si la regla de negocio lo prohíbe.
- No duplicar una transferencia por doble click.
- No pagar dos veces la misma cuota.
- No deshacer una cuota dos veces.
- No superar el límite de tarjeta si aplica.
- Un pago de tarjeta no debe duplicar un gasto.
- Un gasto debe afectar una sola vez el presupuesto.
- Eliminar/editar un movimiento debe recalcular correctamente.
- Importar datos no debe crear inconsistencias.
- Cada usuario sólo puede acceder a sus datos.

---

# P1 — Problemas de alta prioridad

## P1-01 — Edición de movimientos pierde la categoría inicial

En `TransactionForm.tsx`:

```text
const [category, setCategory] = useState<Category | null>(null);
```

Aunque el formulario recibe:

```text
initial?: Transaction
```

no inicializa:

```text
initial?.category
```

Por lo tanto, al editar un movimiento que ya tiene categoría, el selector puede aparecer vacío.

### Riesgo

Si el usuario edita el movimiento y guarda, puede terminar enviándose:

```text
categoryId: null
```

y perder la categoría.

### Corrección

Inicializar:

```text
useState<Category | null>(initial?.category ?? null)
```

y manejar correctamente cambios entre movimiento nuevo y edición.

---

## P1-02 — Edición puede perder bolsillo o tarjeta si están inactivos

El formulario calcula:

```text
activeCards
activePockets
```

y al guardar busca la selección dentro de esos arrays.

Si un movimiento histórico tiene:

```text
pocket = inactivo
```

el selector puede no encontrarlo y terminar enviando:

```text
pocketId: null
```

Lo mismo puede suceder con una tarjeta inactiva.

### Corrección

Al editar:

- Mostrar el valor actual aunque esté inactivo.
- Permitir conservarlo.
- Mostrarlo como `Inactivo`.
- No eliminar la relación simplemente por editar otro campo.

---

## P1-03 — Se puede abrir "Cargar bolsillo" para un bolsillo inactivo

`PocketTile` muestra el botón:

```text
Cargar bolsillo
```

incluso cuando:

```text
pocket.active === false
```

Sin embargo, `TransferForm` sólo lista bolsillos activos.

Esto genera un flujo inconsistente:

```text
Bolsillo inactivo
    ↓
Cargar bolsillo
    ↓
Formulario sin ese bolsillo disponible
```

### Corrección

Si está inactivo:

- ocultar/deshabilitar `Cargar bolsillo`;

o

- permitirlo explícitamente si esa es la regla de negocio.

Recomendación: **deshabilitarlo**.

---

## P1-04 — El historial de transferencias puede fallar silenciosamente

En `Pockets.tsx`:

```text
try {
  setTransfers(await getTransfers());
} finally {
  setIsLoadingTransfers(false);
}
```

No existe `catch`.

Si la API falla:

- no se muestra error;
- queda el estado anterior;
- el usuario puede interpretar que no hay transferencias.

### Corrección

Mostrar:

```text
No se pudieron cargar las transferencias.
Reintentar
```

---

## P1-05 — Error de carga de movimientos se oculta

En `useTransactions.ts`:

```text
catch {
  setTransactions([]);
}
```

Esto convierte:

```text
API caída
```

en:

```text
No tienes movimientos
```

Es un problema grave de UX y soporte.

### Corrección

Mantener:

```text
transactions
error
isLoading
```

por separado.

Nunca reemplazar una colección real por `[]` sólo porque la API falló.

---

## P1-06 — Pagos de tarjeta no refrescan explícitamente el TransactionManager

El `TransactionManager` tiene una función:

```text
refreshTransactions()
```

y el módulo de deudas la utiliza después de pagar/deshacer cuotas.

El módulo de tarjetas actualiza el estado de la tarjeta, pero no llama al refresco de movimientos.

Si el backend crea un movimiento al registrar un pago de tarjeta, el Dashboard/Resumen puede quedar con datos antiguos hasta que haya una recarga.

### Corrección

Después de:

```text
addPayment()
```

si el backend genera un movimiento:

```text
await refreshTransactions()
```

y refrescar los datos dependientes.

---

## P1-07 — Pagos de tarjeta sin límite visible en frontend

El formulario valida:

```text
amount > 0
```

pero no:

```text
amount <= usedAmount
```

### Corrección

Definir la regla de negocio.

Normalmente:

```text
pago > 0
pago <= saldo adeudado
```

Si se permite pagar de más, debe definirse explícitamente cómo se representa ese crédito a favor.

La validación definitiva debe estar en backend.

---

## P1-08 — Deudas: pago de cuota y movimiento deben ser atómicos

El texto de la UI indica:

> Cada cuota pagada genera automáticamente un movimiento.

Eso exige una transacción backend:

```text
marcar cuota pagada
+
crear movimiento
```

como una sola operación.

De lo contrario puede ocurrir:

```text
cuota = pagada
movimiento = no creado
```

o:

```text
movimiento = creado
cuota = pendiente
```

### Corrección

Usar una transacción de DB.

Lo mismo para `unpay`:

```text
revertir cuota
+
eliminar/revertir movimiento asociado
```

de forma atómica.

---

## P1-09 — `unpay` puede ser peligroso si el movimiento asociado fue modificado

El modelo de cuota contiene:

```text
transactionId
```

y la UI afirma:

> Se borrará el movimiento asociado.

Antes de producción debe definirse qué sucede si el usuario:

1. paga cuota;
2. se genera movimiento;
3. edita ese movimiento;
4. intenta deshacer el pago.

### Riesgo

Borrar automáticamente el movimiento podría eliminar cambios legítimos realizados posteriormente.

### Corrección recomendada

No tratar el movimiento generado por una cuota como un movimiento completamente independiente.

Mejor:

- marcarlo como `source = debt_installment`;
- guardar `sourceId`;
- impedir ciertas modificaciones;
- o usar una operación de reversión.

---

## P1-10 — Presupuestos: evitar duplicados categoría + mes

La entidad tiene:

```text
categoryId
month
```

El flujo de creación no demuestra una validación frontend contra duplicados.

El backend debe imponer una restricción única:

```text
UNIQUE(userId, categoryId, month)
```

### Resultado esperado

No debe existir:

```text
Alimentación / 2026-08 / $500.000
Alimentación / 2026-08 / $800.000
```

como dos presupuestos independientes.

Debe existir uno solo.

---

# P2 — Prioridad media

## P2-01 — Selector de categorías no pagina realmente

`createMasterSelectorService` recibe:

```text
pageSize
```

pero solicita todos los resultados y después hace:

```text
filtered.slice(0, pageSize)
```

Además siempre devuelve:

```text
page: 1
```

Esto no es paginación real.

### Riesgo

Con muchas categorías:

- mayor transferencia de datos;
- menor rendimiento;
- resultados incompletos;
- `hasNextPage` engañoso.

### Corrección

El backend debería aceptar:

```text
search
page
pageSize
```

y devolver:

```text
items
page
pageSize
total
hasNextPage
```

---

## P2-02 — Búsqueda de categorías exige 3 caracteres

Los selectores utilizan:

```text
minSearchLength={3}
```

Por lo que una categoría como:

```text
IVA
```

funciona al límite, pero búsquedas como:

```text
Al
```

no.

No necesariamente es un bug, pero debe ser una decisión explícita de UX.

---

## P2-03 — Texto incorrecto en selector de categoría de movimientos

En `TransactionForm` aparece:

```text
placeholder="Buscar cuenta..."
```

aunque el campo es:

```text
Categoría
```

### Corrección

Cambiar a:

```text
Buscar categoría...
```

---

## P2-04 — El promedio de gasto diario no significa "promedio diario del mes"

`calculateMonthlySummary` calcula el promedio utilizando sólo días donde hubo gastos:

```text
daysWithExpense
```

Ejemplo:

```text
Día 1: $100.000
Día 2: $0
Día 3: $0
Día 4: $100.000
```

La aplicación muestra:

```text
promedio = $100.000
```

Si se esperaba promedio por día calendario:

```text
$50.000
```

### Corrección

Renombrar a:

```text
Promedio en días con gasto
```

o calcular el promedio sobre todos los días del período.

---

## P2-05 — Gráfica de balance empieza en cero histórico

`calculateFlowSeries` hace:

```text
let running = 0;
```

y acumula sólo los movimientos cargados.

Eso representa:

> balance neto desde el primer movimiento conocido

no necesariamente:

> saldo real de la cuenta en cada fecha.

Si existen movimientos anteriores no cargados, migraciones o saldo inicial, la gráfica puede ser conceptualmente incorrecta.

### Corrección

Definir:

- saldo inicial;
- fecha de inicio del historial;
- balance acumulado real.

---

## P2-06 — No existe concepto explícito de saldo inicial

Actualmente el saldo se deriva de:

```text
ingresos - gastos
```

Eso funciona si la aplicación comienza exactamente con saldo cero.

Pero si el usuario ya tenía:

```text
$3.000.000
```

antes de empezar a usar la aplicación, no existe un concepto claro de:

> Saldo inicial.

### Corrección

Agregar una operación o entidad de:

```text
Saldo inicial
```

o permitir un movimiento inicial especial.

Debe definirse cómo interactúa con bolsillos.

---

## P2-07 — El saldo del Dashboard y los bolsillos representan conceptos distintos

Dashboard:

```text
calculateBalance(transactions)
```

Bolsillos:

```text
general.balance
pocket.balance
```

Son fuentes diferentes.

Esto es válido sólo si el backend garantiza que ambas representaciones son coherentes.

### Prueba obligatoria

Debe cumplirse:

```text
Dashboard saldo total
=
Cuenta principal
+
Σ saldos de bolsillos
```

si ésa es la regla del producto.

---

## P2-08 — Eliminación de bolsillo necesita regla de negocio explícita

La UI permite:

```text
Eliminar bolsillo
```

pero un bolsillo puede tener:

- saldo;
- movimientos;
- transferencias.

Antes de producción debe definirse:

### Opción A

No permitir eliminar si tiene saldo o historial.

### Opción B

Convertirlo en inactivo.

### Opción C

Mover saldo automáticamente a cuenta principal.

### Recomendación

No eliminar físicamente un bolsillo con historial financiero. Usar:

```text
active = false
```

y conservarlo para auditoría.

---

## P2-09 — El mismo problema aplica a tarjetas y deudas

Eliminar físicamente:

- una tarjeta con movimientos;
- una deuda con cuotas;
- una categoría utilizada por movimientos;

puede romper referencias históricas.

### Recomendación

Usar desactivación/soft delete cuando exista historial.

---

# P3 — Prioridad baja / calidad

## P3-01 — README desactualizado

El README incluido todavía afirma:

```text
Firebase Authentication
Cloud Firestore
VITE_FIREBASE_*
```

pero el código actual utiliza:

```text
VITE_API_URL
VITE_GOOGLE_CLIENT_ID
JWT
API REST
Google Identity Services
```

### Corrección

Actualizar completamente la documentación.

---

## P3-02 — Comentarios heredados de Firestore

Hay comentarios como:

```text
Firestore rechazó la creación del movimiento
```

aunque el código actual llama una API REST.

También aparecen referencias a:

```text
fuente Firestore
```

en `TransactionManager`.

### Corrección

Eliminar terminología heredada para evitar confusión durante mantenimiento.

---

## P3-03 — `mockData.ts` sigue dentro del proyecto

Existe:

```text
src/shared/mock/mockData.ts
```

Si no se usa en producción:

- eliminarlo;
- o moverlo a una carpeta exclusiva de pruebas/desarrollo.

---

## P3-04 — `confirm()` y `alert()` nativos

Hay varios usos de:

```text
confirm()
alert()
```

en:

- bolsillos;
- deudas;
- presupuestos;
- tarjetas.

### Problemas

- UX inconsistente.
- Difícil de estilizar.
- Menos cómodo en móvil.
- Menor control de accesibilidad.

### Corrección

Usar el componente existente:

```text
ConfirmDialog
```

y crear un sistema de notificaciones/toasts.

---

## P3-05 — Errores de formularios no siempre se muestran fuera del modal

Algunas operaciones dependen de que el padre cierre el modal sólo después de éxito, lo cual es correcto, pero el patrón debe ser uniforme.

Conviene centralizar:

```text
loading
error
success
```

para todos los CRUD.

---

# 23. Reglas contables que deben quedar escritas antes de producción

## Transferencia

```text
Cuenta principal → Bolsillo
```

No es ingreso ni gasto.

```text
Bolsillo → Cuenta principal
```

No es ingreso ni gasto.

```text
Bolsillo → Bolsillo
```

No es ingreso ni gasto.

---

## Gasto

```text
Gasto = disminuye patrimonio disponible
```

---

## Ingreso

```text
Ingreso = aumenta patrimonio
```

---

## Tarjeta

Debe definirse exactamente:

### Compra

```text
Compra con tarjeta
→ gasto
→ aumenta deuda de tarjeta
```

### Pago

```text
Pago de tarjeta
→ reduce deuda de tarjeta
→ reduce dinero de una cuenta/pocket
→ NO debe crear un segundo gasto
```

---

## Deuda

Debe definirse:

```text
Crear deuda
≠ necesariamente ingreso
```

y:

```text
Pagar cuota
→ gasto
→ reduce obligación
```

si esa es la política contable del producto.

---

# 24. Matriz de pruebas funcionales obligatorias

## Movimientos

- [ ] Crear ingreso.
- [ ] Crear gasto.
- [ ] Editar ingreso.
- [ ] Editar gasto.
- [ ] Cambiar categoría.
- [ ] Quitar categoría.
- [ ] Cambiar bolsillo.
- [ ] Quitar bolsillo.
- [ ] Cambiar tarjeta.
- [ ] Quitar tarjeta.
- [ ] Editar movimiento asociado a bolsillo inactivo.
- [ ] Editar movimiento asociado a tarjeta inactiva.
- [ ] Eliminar movimiento.
- [ ] Doble click en guardar.
- [ ] API falla durante creación.
- [ ] API falla durante edición.
- [ ] API falla durante eliminación.

## Bolsillos

- [ ] Crear.
- [ ] Editar.
- [ ] Activar.
- [ ] Desactivar.
- [ ] Transferir desde cuenta principal.
- [ ] Transferir hacia cuenta principal.
- [ ] Transferir entre bolsillos.
- [ ] Intentar transferir más saldo.
- [ ] Intentar transferir a sí mismo.
- [ ] Cargar bolsillo inactivo.
- [ ] Eliminar bolsillo con saldo.
- [ ] Eliminar bolsillo con movimientos.

## Transferencias

- [ ] No aceptar monto cero.
- [ ] No aceptar monto negativo.
- [ ] No aceptar NaN.
- [ ] No aceptar origen = destino.
- [ ] No permitir origen ajeno.
- [ ] No permitir destino ajeno.
- [ ] No permitir doble transferencia por doble click.
- [ ] Verificar atomicidad.
- [ ] Verificar historial después de crear.
- [ ] Verificar saldos después de crear.
- [ ] Verificar consistencia tras fallo de red.

## Presupuestos

- [ ] Crear.
- [ ] Editar.
- [ ] Eliminar.
- [ ] Cambiar mes.
- [ ] Duplicar categoría/mes.
- [ ] Sobrepasar presupuesto.
- [ ] Gasto en bolsillo que afecta presupuesto.
- [ ] Gasto en bolsillo que no afecta presupuesto.

## Tarjetas

- [ ] Crear.
- [ ] Editar.
- [ ] Activar/desactivar.
- [ ] Registrar compra.
- [ ] Registrar pago.
- [ ] Pago parcial.
- [ ] Pago total.
- [ ] Pago superior a deuda.
- [ ] Doble pago.
- [ ] Actualizar Dashboard después del pago.
- [ ] Actualizar movimientos después del pago.

## Deudas

- [ ] Crear deuda.
- [ ] Generar cuotas.
- [ ] Pagar cuota.
- [ ] Pagar dos veces.
- [ ] Deshacer pago.
- [ ] Editar movimiento generado.
- [ ] Eliminar deuda con cuotas.
- [ ] Verificar atomicidad cuota + movimiento.

## Importación

- [ ] JSON válido.
- [ ] JSON inválido.
- [ ] Array vacío.
- [ ] Propiedades faltantes.
- [ ] Montos negativos.
- [ ] Tipos inválidos.
- [ ] Categoría inexistente.
- [ ] Tarjeta inexistente.
- [ ] Bolsillo inexistente.
- [ ] IDs duplicados.
- [ ] Fechas inválidas.
- [ ] Archivo demasiado grande.
- [ ] Fallo parcial.
- [ ] Reimportar el mismo archivo.

## Autenticación

- [ ] Login correcto.
- [ ] Login cancelado.
- [ ] Token expirado.
- [ ] Token inválido.
- [ ] Logout.
- [ ] Recargar página.
- [ ] Acceso a datos de otro usuario.
- [ ] Usuario eliminado/desactivado.

---

# 25. Orden recomendado de corrección

## Fase 1 — Seguridad e infraestructura

1. Entregar backend real.
2. Validar JWT.
3. Validar ownership por usuario.
4. Configurar cookies/token strategy.
5. Configurar CORS.
6. Rate limiting.
7. Validación de DTOs.
8. Logs y monitoreo.
9. Manejo centralizado de errores.
10. HTTPS.

## Fase 2 — Integridad financiera

11. Transferencias atómicas.
12. Pagos de tarjetas atómicos.
13. Pagos de deudas atómicos.
14. Restricciones únicas.
15. Control de concurrencia.
16. Auditoría de operaciones.
17. Saldo inicial.
18. Reglas de eliminación/soft delete.

## Fase 3 — Correcciones frontend

19. Corregir categoría al editar.
20. Conservar pocket/card inactivos al editar.
21. Deshabilitar "Cargar bolsillo" para inactivos.
22. Refrescar movimientos después de pagos.
23. Manejar errores de transferencias.
24. No ocultar errores de carga.
25. Validar importación.
26. Corregir textos.

## Fase 4 — Calidad

27. Actualizar README.
28. Eliminar comentarios Firebase.
29. Eliminar mocks no utilizados.
30. Sustituir alert/confirm.
31. Añadir pruebas E2E.
32. Añadir pruebas de regresión.
33. Prueba móvil.
34. Prueba de concurrencia.
35. Prueba de recuperación ante errores.

---

# 26. Criterio para considerar el producto "listo"

No debería considerarse listo para producción hasta que se cumpla:

```text
Backend real disponible
        +
Autenticación segura
        +
Aislamiento por usuario
        +
Operaciones monetarias atómicas
        +
Invariantes financieras comprobadas
        +
Pruebas E2E
        +
Manejo de errores
        +
Importación segura
        +
Reglas contables documentadas
        +
Responsive probado
```

## Resultado actual

**Estado recomendado: NO PRODUCCIÓN.**

La aplicación tiene una base funcional bastante completa en frontend, pero el mayor bloqueo es que el archivo entregado como backend no es un backend. Además existen varios problemas concretos de consistencia en edición, bolsillos, tarjetas, errores de red y sincronización de datos que conviene corregir antes del lanzamiento.

---

# 27. Top 10 para corregir primero

Si se quiere avanzar rápidamente, este es el orden que más impacto tendría:

1. **Conseguir el backend real.**
2. **Auditar autorización y aislamiento de datos por usuario.**
3. **Hacer transferencias atómicas.**
4. **Hacer pagos de tarjetas/deudas atómicos.**
5. **Corregir edición de categoría/pocket/tarjeta.**
6. **Evitar operaciones sobre bolsillos inactivos.**
7. **Actualizar movimientos después de pagos de tarjeta.**
8. **No ocultar errores de API como listas vacías.**
9. **Validar y asegurar importaciones.**
10. **Crear pruebas automáticas de todas las invariantes financieras.**
