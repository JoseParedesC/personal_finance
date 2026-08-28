# Guía funcional — Finanzas Personales

> Documento de referencia para usuarios, producto y desarrollo.
>
> Este README describe las funcionalidades visibles y el flujo de uso de los proyectos de **frontend** y **backend** entregados para la aplicación de finanzas personales.

---

## 1. ¿Qué es la aplicación?

Es una aplicación para controlar las finanzas personales desde un único lugar.

Permite:

- Registrar ingresos y gastos.
- Asociar movimientos a categorías.
- Separar dinero mediante bolsillos.
- Transferir dinero entre la cuenta principal y bolsillos.
- Controlar presupuestos.
- Registrar deudas.
- Gestionar tarjetas de crédito y sus pagos.
- Consultar saldos y resúmenes.
- Analizar el flujo financiero mediante gráficos.
- Filtrar y buscar movimientos.
- Importar y exportar información de movimientos.
- Trabajar con una interfaz responsive para escritorio, tablet y móvil.
- Mantener los datos asociados al usuario autenticado.

---

# 2. Conceptos fundamentales

Antes de utilizar la aplicación conviene diferenciar estos conceptos:

### Movimiento

Representa una operación financiera real.

Puede ser:

- **Ingreso** → dinero que recibes.
- **Gasto** → dinero que consumes.

Ejemplos:

- Salario → ingreso.
- Mercado → gasto.
- Netflix → gasto.
- Venta de un producto → ingreso.

### Cuenta principal

Representa el dinero que no está asignado a un bolsillo.

En la interfaz de bolsillos aparece como:

> **Cuenta principal (fondos sin asignar a un bolsillo)**

### Bolsillo

Es una separación lógica de dinero para organizarlo.

Ejemplos:

- Ahorros
- Mercado
- Viaje
- Emergencias
- Casa

Un bolsillo tiene su propio saldo y estadísticas.

### Transferencia

Es un movimiento de dinero **entre espacios propios de la aplicación**.

Ejemplos:

- Cuenta principal → Ahorros.
- Ahorros → Cuenta principal.
- Ahorros → Viaje.

Una transferencia **no es un ingreso ni un gasto**.

---

# 3. Inicio de sesión

La aplicación requiere una sesión de usuario.

El flujo general es:

1. Abrir la aplicación.
2. Iniciar sesión.
3. La aplicación comprueba la sesión.
4. Si existe un usuario autenticado, se muestra la aplicación.
5. Si no existe, se muestra la pantalla de acceso.

La sesión se gestiona mediante autenticación y el backend recibe el token de acceso para identificar al usuario.

---

# 4. Dashboard

El Dashboard es la vista general de la situación financiera.

Su objetivo es permitir una lectura rápida de:

- Saldo.
- Ingresos.
- Gastos.
- Evolución general de las finanzas.

Es la pantalla recomendada para consultar rápidamente cómo está la situación financiera antes de entrar al detalle.

---

# 5. Movimientos

## 5.1. ¿Qué es un movimiento?

Cada operación de dinero debe registrarse como un movimiento cuando corresponde a un ingreso o gasto real.

El formulario permite manejar:

- Tipo.
- Categoría.
- Bolsillo.
- Tarjeta de crédito.
- Valor.
- Detalle.
- Fecha.

---

## 5.2. Registrar un ingreso

Seleccionar:

**Tipo → Ingreso**

Después:

1. Elegir categoría.
2. Opcionalmente seleccionar un bolsillo.
3. Introducir el valor.
4. Escribir el detalle.
5. Seleccionar la fecha.
6. Guardar.

Ejemplo:

```text
Tipo:       Ingreso
Categoría:  Salario
Bolsillo:   Cuenta principal
Valor:      $4.000.000
Detalle:    Salario agosto
Fecha:      2026-08-27
```

---

## 5.3. Registrar un gasto

Seleccionar:

**Tipo → Gasto**

Después:

1. Elegir categoría.
2. Opcionalmente seleccionar un bolsillo.
3. Opcionalmente indicar que fue pagado con una tarjeta de crédito.
4. Introducir el valor.
5. Escribir el detalle.
6. Seleccionar la fecha.
7. Guardar.

Ejemplo:

```text
Tipo:       Gasto
Categoría:  Alimentación
Bolsillo:   Mercado
Valor:      $180.000
Detalle:    Compra supermercado
Fecha:      2026-08-27
```

---

## 5.4. Cuenta principal vs bolsillo

Si el campo **Bolsillo** queda vacío:

> El movimiento se registra en la cuenta principal.

Si se selecciona un bolsillo:

> El movimiento se asocia a ese bolsillo.

La aplicación ofrece la opción:

> Cuenta principal (sin bolsillo)

cuando existen bolsillos activos.

---

## 5.5. Tarjeta de crédito

Para un gasto existe un campo opcional:

> Pagado con tarjeta de crédito

Si no se selecciona una tarjeta:

> No se vincula el gasto a una tarjeta.

Si se selecciona una tarjeta activa:

> El movimiento queda asociado a esa tarjeta.

---

## 5.6. Editar movimientos

Los movimientos existentes pueden editarse.

La edición permite cambiar los datos del movimiento, incluyendo:

- Tipo.
- Categoría.
- Bolsillo.
- Tarjeta.
- Valor.
- Descripción.
- Fecha.

Después de guardar, los totales derivados se actualizan.

---

## 5.7. Eliminar movimientos

Un movimiento puede eliminarse.

La aplicación utiliza una confirmación antes de borrar para evitar eliminaciones accidentales.

---

## 5.8. Filtros

La sección de movimientos permite combinar filtros.

Se contemplan:

- Tipo.
- Rango de fechas.
- Búsqueda por descripción.

Esto permite localizar rápidamente movimientos concretos.

---

## 5.9. Agrupación por fecha

Los movimientos se presentan agrupados por fecha para facilitar la lectura del historial.

---

# 6. Categorías

Las categorías permiten clasificar los movimientos.

La administración contempla:

- Código.
- Nombre.
- Estado.
- Tipo de movimiento.

El tipo distingue categorías de:

- Ingreso.
- Egreso/gasto.

La sección se encuentra dentro de:

**Configuración → Categoría**

Las categorías se utilizan posteriormente al registrar movimientos.

---

# 7. Bolsillos

## 7.1. Objetivo

Los bolsillos sirven para separar dinero y controlar diferentes objetivos o áreas financieras.

Ejemplos:

```text
Cuenta principal
├── Ahorros
├── Viaje
├── Mercado
└── Emergencias
```

---

## 7.2. Crear un bolsillo

Ir a:

**Bolsillos → Nuevo bolsillo**

Datos:

- Nombre.
- Descripción opcional.
- Configuración de presupuesto.

Ejemplo:

```text
Nombre:       Viaje
Descripción:  Dinero para vacaciones
Afecta presupuesto: Sí
```

---

## 7.3. Afecta presupuesto

Cada bolsillo tiene una configuración:

> **Los movimientos de este bolsillo afectan el presupuesto**

Si está activada:

> Los movimientos de ese bolsillo participan en el control de presupuesto.

Si está desactivada:

> Los gastos de ese bolsillo no cuentan contra los topes mensuales.

Un caso típico sería:

```text
Mercado
Afecta presupuesto: Sí

Ahorros
Afecta presupuesto: No
```

---

## 7.4. Saldo del bolsillo

Cada bolsillo muestra:

- Saldo.
- Número de movimientos.
- Información de presupuesto.
- Estado activo/inactivo.

También se calculan:

- Total de ingresos.
- Total de gastos.
- Transferencias recibidas.
- Transferencias enviadas.

---

## 7.5. Editar bolsillo

Se puede modificar:

- Nombre.
- Descripción.
- Configuración de presupuesto.

---

## 7.6. Activar/desactivar bolsillo

Un bolsillo puede marcarse como:

- Activo.
- Inactivo.

Los bolsillos inactivos se identifican visualmente.

Los formularios de movimientos y transferencias trabajan con los bolsillos activos.

---

## 7.7. Eliminar bolsillo

Un bolsillo puede eliminarse desde su tarjeta.

La aplicación solicita confirmación antes de realizar la eliminación.

> Recomendación funcional: antes de eliminar un bolsillo con saldo o movimientos, verificar las reglas de negocio del backend y decidir si debe permitirse, bloquearse o requerir primero mover el saldo.

---

# 8. Transferencias

## 8.1. ¿Qué es una transferencia?

Una transferencia mueve dinero de un origen a un destino.

Los posibles espacios son:

- Cuenta principal.
- Bolsillo activo.

Por tanto existen tres escenarios:

```text
Cuenta principal → Bolsillo
Bolsillo → Cuenta principal
Bolsillo → Bolsillo
```

---

## 8.2. Transferir dinero a un bolsillo

Desde:

**Bolsillos → Transferir**

o mediante:

**Cargar bolsillo**

El botón **Cargar bolsillo** abre el formulario con el bolsillo seleccionado como destino.

Ejemplo:

```text
Origen:     Cuenta principal
Destino:    Ahorros
Monto:      $500.000
```

Resultado conceptual:

```text
Cuenta principal:  -$500.000
Ahorros:           +$500.000
```

El dinero total no cambia.

---

## 8.3. Retirar dinero de un bolsillo

Ejemplo:

```text
Origen:     Ahorros
Destino:    Cuenta principal
Monto:      $200.000
```

Resultado:

```text
Ahorros:           -$200.000
Cuenta principal:  +$200.000
```

---

## 8.4. Transferir entre bolsillos

Ejemplo:

```text
Origen:     Ahorros
Destino:    Viaje
Monto:      $300.000
```

Resultado:

```text
Ahorros:  -$300.000
Viaje:    +$300.000
```

---

## 8.5. Validaciones de transferencias

El formulario valida:

- Debe existir un origen.
- Debe existir un destino.
- Origen y destino no pueden ser iguales.
- El monto debe ser mayor que cero.
- La fecha es obligatoria.
- El origen debe tener saldo suficiente.

También muestra el saldo disponible del origen.

Si se intenta transferir más dinero del disponible, se muestra un error de saldo insuficiente.

---

## 8.6. Fecha y nota

Una transferencia tiene:

- Monto.
- Fecha.
- Nota opcional.

Ejemplo:

```text
Monto:  $500.000
Fecha:  2026-08-27
Nota:   Ahorro mensual
```

---

## 8.7. Historial de transferencias

La sección de bolsillos mantiene un historial específico de transferencias.

Muestra:

- Origen.
- Destino.
- Monto.
- Fecha.

Ejemplo:

```text
Cuenta principal → Ahorros     $500.000
Ahorros → Viaje                $200.000
Viaje → Cuenta principal       $50.000
```

Este historial debe interpretarse separado del historial de gastos e ingresos.

---

# 9. Regla crítica: transferencia ≠ gasto

Esta es la regla más importante para utilizar correctamente la aplicación.

### Transferencia

```text
Cuenta principal → Ahorros
$1.000.000
```

Significa:

> "Estoy moviendo dinero mío."

No es un gasto.

### Gasto

```text
Ahorros → Supermercado
$200.000
```

Significa:

> "Estoy consumiendo dinero."

Sí es un gasto.

Por tanto:

> **Nunca registrar una transferencia interna como un gasto.**

---

# 10. Presupuestos

La aplicación dispone de una sección:

**Presupuestos**

El objetivo es controlar límites de gasto.

Los presupuestos se relacionan con el comportamiento de los movimientos y con la configuración `affectsBudget` de los bolsillos.

Un bolsillo configurado para afectar presupuesto hace que sus movimientos participen en el control presupuestario.

Un bolsillo configurado como:

> No afecta presupuesto

queda fuera de esos topes para sus gastos.

---

# 11. Deudas

La aplicación incluye una sección:

**Deudas**

Permite gestionar información relacionada con obligaciones financieras.

La estructura del módulo incluye:

- Listado de deudas.
- Formulario de deuda.
- Tarjetas/resúmenes individuales.
- Hook de gestión.
- Servicio de persistencia.

La finalidad es mantener las obligaciones separadas de los movimientos normales y facilitar su seguimiento.

---

# 12. Tarjetas de crédito

La aplicación incluye:

**Tarjetas de crédito**

El módulo contempla:

- Crear tarjetas.
- Gestionar tarjetas.
- Mostrar tarjetas individualmente.
- Registrar pagos.
- Consultar pagos.
- Abrir el historial/modal de pagos.
- Asociar gastos a tarjetas activas.

---

## 12.1. Registrar un gasto con tarjeta

En un gasto se puede seleccionar:

> Pagado con tarjeta de crédito

Después se selecciona una tarjeta activa.

Esto vincula el movimiento con la tarjeta.

---

## 12.2. Pagos de tarjeta

Los pagos de tarjeta tienen su propio flujo y formulario.

Esto permite diferenciar:

> **Compra realizada con tarjeta**

de:

> **Pago realizado a la tarjeta**

Esta separación es importante para evitar contabilizar dos veces el mismo gasto.

---

# 13. Resumen

La sección:

**Resumen**

está orientada al análisis financiero.

Incluye:

### Resumen diario

Permite revisar el comportamiento diario.

### Resumen mensual

Incluye métricas como:

- Promedio de gasto diario.
- Día de mayor gasto.
- Totales del período.

### Flujo financiero

Incluye una gráfica para visualizar:

- Ingresos.
- Gastos.
- Balance acumulado.

---

# 14. Importación y exportación

La aplicación contempla respaldo de movimientos mediante JSON.

El archivo de respaldo se maneja como:

```text
finanzas-backup.json
```

## Exportar

Se genera un respaldo de los movimientos.

## Importar

Los movimientos de un respaldo pueden enviarse nuevamente a la aplicación.

La importación conserva información relevante del movimiento, incluyendo:

- Valor.
- Tipo.
- Descripción.
- Fecha.
- Categoría.
- Tarjeta.
- Bolsillo.
- Fecha de creación.

> Recomendación: utilizar los respaldos como mecanismo de recuperación/migración y conservar una copia antes de hacer importaciones grandes.

---

# 15. Diseño responsive y móvil

La aplicación está preparada para:

- Escritorio.
- Tablet.
- Teléfono.

En móvil existe un acceso flotante para:

> **Agregar nuevo movimiento**

Esto permite registrar un movimiento aunque el menú o las acciones principales no estén visibles por el reducido tamaño de pantalla.

El botón abre directamente:

**Nuevo movimiento**

---

# 16. Flujo recomendado para el usuario

Una rutina sencilla sería:

### Al recibir dinero

1. Registrar el ingreso.
2. Dejarlo en cuenta principal o asignarlo al bolsillo correspondiente.

### Al separar dinero

1. Ir a Bolsillos.
2. Elegir el bolsillo.
3. Usar **Cargar bolsillo**.
4. Transferir el dinero.

### Al gastar

1. Crear un movimiento.
2. Seleccionar **Gasto**.
3. Seleccionar categoría.
4. Seleccionar bolsillo si corresponde.
5. Seleccionar tarjeta si fue una compra con crédito.
6. Guardar.

### Al devolver dinero de un bolsillo

Utilizar:

**Transferencia**

y no un ingreso.

### Al mover dinero entre bolsillos

Utilizar:

**Transferencia**

y no un gasto ni un ingreso.

---

# 17. Ejemplo de un mes completo

Supongamos que recibes:

```text
Salario = $5.000.000
```

Registras:

```text
Ingreso
$5.000.000
Cuenta principal
```

Después decides separar:

```text
Ahorros  = $1.000.000
Mercado  = $800.000
Viaje    = $500.000
```

Realizas tres transferencias:

```text
Cuenta principal → Ahorros   $1.000.000
Cuenta principal → Mercado     $800.000
Cuenta principal → Viaje       $500.000
```

La distribución queda:

```text
Cuenta principal   $2.700.000
Ahorros            $1.000.000
Mercado              $800.000
Viaje                 $500.000
--------------------------------
Total               $5.000.000
```

Después compras mercado:

```text
Gasto
$250.000
Bolsillo: Mercado
```

Ahora:

```text
Cuenta principal   $2.700.000
Ahorros            $1.000.000
Mercado              $550.000
Viaje                 $500.000
--------------------------------
Total               $4.750.000
```

La diferencia de $250.000 sí representa consumo real.

---

# 18. Errores que se deben evitar

### ❌ Registrar una transferencia como gasto

Incorrecto:

```text
Gasto → Ahorros → $500.000
```

Correcto:

```text
Transferencia
Cuenta principal → Ahorros
$500.000
```

---

### ❌ Registrar el retiro de un bolsillo como ingreso

Incorrecto:

```text
Ingreso → Cuenta principal → $300.000
```

Correcto:

```text
Transferencia
Ahorros → Cuenta principal
$300.000
```

---

### ❌ Registrar el pago de una tarjeta como si fuera otra compra

La compra con tarjeta y el pago de la tarjeta son eventos diferentes.

Debe evitarse duplicar el gasto.

---

### ❌ Crear bolsillos para representar bancos diferentes sin una regla clara

Un bolsillo es una separación lógica dentro de la aplicación.

Si se quiere representar cuentas bancarias reales, conviene definir primero una regla de producto clara para no mezclar:

- cuentas bancarias,
- bolsillos,
- tarjetas,
- efectivo.

---

# 19. Resumen de cuándo utilizar cada funcionalidad

| Necesidad | Funcionalidad |
|---|---|
| Recibí dinero | **Ingreso** |
| Gasté dinero | **Gasto** |
| Quiero separar dinero | **Transferencia** |
| Quiero ahorrar | **Bolsillo + Transferencia** |
| Quiero devolver dinero del bolsillo | **Transferencia** |
| Quiero mover dinero entre bolsillos | **Transferencia** |
| Quiero clasificar una operación | **Categoría** |
| Quiero controlar un límite | **Presupuesto** |
| Tengo una obligación | **Deuda** |
| Compré con crédito | **Movimiento + Tarjeta** |
| Pagué la tarjeta | **Pago de tarjeta** |
| Quiero analizar mis finanzas | **Resumen** |
| Quiero revisar rápidamente mi situación | **Dashboard** |
| Necesito buscar una operación | **Movimientos + filtros** |
| Necesito recuperar/migrar movimientos | **Importar/Exportar** |

---

# 20. Modelo mental de toda la aplicación

La forma más sencilla de entender el producto es:

```text
                         MIS FINANZAS
                              │
             ┌────────────────┼────────────────┐
             │                │                │
        MOVIMIENTOS       BOLSILLOS        TARJETAS
             │                │                │
        ┌────┴────┐       Transferencias     Pagos
        │         │
     INGRESOS   GASTOS
        │         │
        └────┬────┘
             │
        CATEGORÍAS
             │
        PRESUPUESTOS
             │
          RESUMEN
             │
         DASHBOARD
```

Y la regla contable central es:

```text
INGRESO       = entra dinero
GASTO         = sale dinero
TRANSFERENCIA = cambia de ubicación
```

---

# 21. Referencia técnica de alto nivel

El frontend está construido con:

- React 18.
- TypeScript.
- Vite.
- Tailwind CSS.
- Recharts.
- lucide-react.
- Componentes reutilizables.

La aplicación está organizada por módulos:

```text
src/modules/
├── auth/
├── dashboard/
├── transactions/
├── summary/
├── categories/
├── debts/
├── credit-cards/
├── budgets/
└── pockets/
```

El módulo de movimientos centraliza las operaciones CRUD mediante `TransactionManager`, evitando que los componentes visuales accedan directamente al servicio de persistencia.

Los módulos de bolsillos y transferencias cuentan con sus propios:

- tipos,
- servicios,
- hooks,
- formularios,
- componentes visuales.

La comunicación con el backend se realiza mediante una capa `apiFetch`.

---

# 22. Referencia rápida para soporte

Cuando un usuario pregunte:

**"¿Dónde pongo que recibí dinero?"**

→ Movimiento → Ingreso.

**"¿Dónde pongo que gasté?"**

→ Movimiento → Gasto.

**"Quiero separar $500.000 para ahorrar."**

→ Bolsillo Ahorros → Cargar bolsillo → Transferencia.

**"Quiero sacar $200.000 de ahorros."**

→ Transferencia Ahorros → Cuenta principal.

**"Quiero pasar $100.000 de Ahorros a Viaje."**

→ Transferencia Ahorros → Viaje.

**"Quiero que mis gastos de ahorro no afecten mi presupuesto."**

→ Editar bolsillo → desactivar **Afecta presupuesto**.

**"Quiero ver en qué gasté."**

→ Movimientos / Resumen.

**"Quiero saber cuánto dinero tengo."**

→ Dashboard / Cuenta principal / Bolsillos.

---

## Nota final

Este documento describe el funcionamiento funcional observado en los proyectos entregados. Para decisiones contables más estrictas —por ejemplo, cómo debe afectar una compra con tarjeta al saldo disponible, cómo contabilizar pagos de tarjeta, o qué debe ocurrir al eliminar un bolsillo con saldo— conviene definir explícitamente las reglas de negocio del backend antes de considerar esas decisiones como reglas contables definitivas.

