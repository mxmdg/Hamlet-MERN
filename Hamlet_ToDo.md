# Hamlet - Lista de mejoras detectadas en code review

---

## 🔴 Bugs (cosas rotas)

### `jobs.js` (routes)
- [ ] Ruta `/:id` definida dos veces — la segunda pisa a la primera, `deleteJob` nunca se ejecuta
- [ ] `getCompleteJobs`: `query = { [Tipo[0].name]: ... }` — `Tipo` no está definido en ese scope, tira ReferenceError al filtrar por tipo

### `quotationsControl.js`
- [ ] `getDeletedQuotations`: `status: { $eq: "Rechazado" || "Rechazada" }` siempre evalúa a `"Rechazado"` — cotizaciones `"Rechazada"` nunca aparecen en el trash. Usar `$in: ["Rechazado", "Rechazada"]`

### `jobControl.js`
- [ ] `getAllParts` no filtra por tenant — devuelve partes de todos los tenants (fuga de datos entre clientes)

### `FinishingList.jsx`
- [ ] `finisherList(...)` llama a un array como función — debería ser `setFinishingCosts(...)`
- [ ] Loop potencial: `useEffect` depende de `[useFinishingCosts]` que el mismo effect modifica
- [ ] `finally` llama a `props.sendFinishingData(totalCost())` antes de que el estado esté actualizado (setState es asíncrono)
- [ ] `clearError` inicializado incorrectamente como estado con `useState(() => setError(null))`

---

## 🟡 Deuda técnica / Mejoras

### `Job.js` (modelo)
- [ ] `maxStockWeight` duplicado en `partTypeSchema` — uno de los dos debería ser `minStockWeight`
- [ ] `console.log(x, y)` de debug en la función `orientation()` — eliminar
- [ ] Getter de `Finishing` demasiado complejo — normalizar datos en el controller antes de guardar
- [ ] Campo `Finishing` usa `Mixed` — tiparlo correctamente una vez estabilizado el modelo

### `quotations.js` (modelo)
- [ ] `console.log` de debug en el `pre("save")` middleware — eliminar (se ejecuta en cada cotización nueva en producción)
- [ ] `quantity: { require: true }` — typo, debería ser `required: true`. Mongoose no valida este campo
- [ ] `data: { type: Object }` sin estructura definida — cotizaciones de distintas versiones son incompatibles silenciosamente. Evaluar schema explícito o al menos documentar la estructura esperada
- [ ] `customer` (String) y `customerId` (ObjectId) coexisten — si el cliente cambia de nombre, `customer` queda desactualizado. Aclarar si es intencional como snapshot histórico
- [ ] Definir política de inmutabilidad: ¿una cotización aprobada puede modificarse? Si no se protege, el historial pierde confiabilidad


- [ ] `Stock` es un número simple sin historial de movimientos — evaluar modelo de movimientos de stock (entrada/salida por trabajo, merma, ajuste) para trazabilidad
- [ ] `Espesor_Resma` no documenta si es espesor de resma completa (500 hojas) o de hoja individual — agregar comentario o renombrar a `Espesor_x_Resma_500`
- [ ] `Ancho_Resma` / `Alto_Resma` — aclarar si son dimensiones del pliego madre o de la hoja de resma


- [ ] Virtual `formula` no funciona: `this.Costo` es un ObjectId, no un número — requiere populate
- [ ] `console.log` de debug en el virtual `formula` — eliminar
- [ ] `jobTypesAllowed` y `partTypesAllowed` son `Object` sin estructura — definir schema o usar array de strings

### `jobControl.js`
- [ ] `updateJob` crea una instancia `new jobs.esquema(...)` que nunca se guarda — solo para el log. Eliminar, usar directamente los datos del body
- [ ] Ningún controller valida los datos del body antes de operar — agregar validación (Joi, express-validator, o validación manual)

### `jobPartControl.js` (feature pendiente)
- [ ] Controller bien escrito pero sin uso actual — evaluar features: copiar parte entre trabajos, biblioteca de partes reutilizables, plantillas por tipo de trabajo


- [ ] Hook `pre("save")` recalcula todos los porcentajes del historial en cada save — solo debería calcular el último
- [ ] Campo `Entrada` sin documentación clara — definir qué representa y si es parte de la fórmula

### `FinishingList.jsx` (componente)
- [ ] `UNSAFE_NavigationContext` importado pero nunca usado — eliminar
- [ ] `StyledTableCell` y `StyledTableRow` definidos dentro del componente — mover afuera para evitar recreación en cada render
- [ ] Lógica de cálculo de costos (switch de fórmulas) está en el frontend — debería vivir en el backend

---

## 🟠 Features / Evolución planificada

### Modelo de Impresoras (`Printers.js`)
- [ ] Mismo bug de `pre("save")` que en Precios: recalcula todos los deltas de Billing en cada guardado — solo debería calcular el último
- [ ] Duplicación de contadores: `TotalPrints`, `ColorPrints`, etc. están tanto en el root del schema como en cada Billing — clarificar cuál es la fuente de verdad o derivar el actual del último Billing
- [ ] El modelo `billingSchema` es específico de contratos xerográficos por copia — no sirve para inkjet (consumo de tinta), offset (hora/máquina + planchas) ni plotter (m²)
- [ ] Rediseñar el modelo de impresoras para soportar múltiples paradigmas de costos cuando se expanda más allá de digital xerográfico

### Motor de precios (`formulas.js` / `Precios.js`)
- [ ] Reemplazar el sistema de fórmulas fijas por un **modelo de precios flexible** que soporte distintos tipos de contratos (Xerox, otros proveedores, offset, plotter, gigantografía, etc.)
- [ ] Modelar contratos con breakpoints configurables (ej: precio diferencial Xerox por tamaño de pliego < 356mm) como datos en la DB, no como constantes hardcodeadas en el código
- [ ] El factor 1.15 y los breakpoints [508, 660] de `pliegoPorLongitud` deben salir del código y vivir en la configuración del contrato
- [ ] Contemplar futuro soporte para: plotter, gigantografía, offset, y otros sistemas de impresión
- [ ] Módulo Papyrus: mantener o evolucionar el transpilador de fórmulas para el período de transición con CLC Papyrus

---

## 🔵 Diseño / Arquitectura

### `FinishingList.jsx`
- [ ] Componente hace demasiadas cosas: fetching, cálculo, UI y comunicación con padre — separar responsabilidades
- [ ] Refactorizar completo el componente (pendiente hasta tener panorama más amplio del proyecto)

### `CotizacionCard.jsx`
- [ ] `emailTo` hardcodeado con email de desarrollo y espacio al final — reemplazar por `job?.Company.email`
- [ ] `statusUpdater` muta `cotizacion.status` directamente (prop) y no espera `patchPrivateElement` — si el patch falla, el estado local queda incorrecto sin error visible
- [ ] Acceso frágil a `resumen[resumen.length - 1]` antes del primer return — si resumen está vacío tira error no manejado
- [ ] `localStatus.includes(statusOption.slice(0, -1))` es un hack para manejar inconsistencia `"Aprobado"/"Aprobada"` — se resuelve limpiando el enum en el modelo


- [ ] `useEffect` con setters como dependencias — debería ser `[]`
- [ ] `setLoading(true/false)` alrededor de código sincrónico en `onSubmit` — spinner innecesario
- [ ] `props.continue(props.data ? 2 : 1)` — pasa argumento a `handleNext` que lo ignora, no hace lo que parece
- [ ] `defaultValue` del campo `Owner` es una función — MUI no la ejecuta, necesita el valor directamente

### `JobsParts.jsx`
- [ ] `useEffect` principal con setters como dependencias en lugar de valores
- [ ] `filterStocks()` se llama inmediatamente después de `setStocks` — opera sobre estado anterior (setState es asíncrono)
- [ ] `useEffect(() => { /* log comentado */ }, [currentPart])` — código muerto, eliminar
- [ ] `filterStocks` retorna el error como elemento del array en el catch — errores entran al array de stocks filtrados
- [ ] Campo `Finishing` con `required: true` en `input hidden` — bloquea submit sin mostrar error visible al usuario


- [ ] `addParts` y `replacePart` tienen race condition: `getStock` es async pero no se espera — la parte se agrega con `partStock` como ID string en lugar del objeto completo
- [ ] `steps` definido dentro del render — recrea `JobsForm` y `JobParts` en cada render, desmontando y remontando con pérdida de estado. Mover a `useMemo`
- [ ] `useEffect` fetcha `jobParts` y `materiales` cada vez que cambia `useJob` o `usePartToEdit` — debería ser `[]`
- [ ] `handlePost` y `handleUpdate` mutan `useJob` directamente: `const Job = useJob; Job.Partes = useParts` — usar spread: `const Job = { ...useJob, Partes: useParts }`
- [ ] `PartCard` completamente comentado — panel lateral muestra solo "Parte N" sin contenido. ¿Feature incompleta o componente roto?
- [ ] `fechtData` — typo en nombre de función/import (debería ser `fetchData`)


- [ ] `.map()` usado como `.forEach()` en dos lugares — cambiar a `.forEach()` para claridad semántica
- [ ] Error en `res.map()` capturado pero no detiene el render — formulario se muestra sin lista de costos sin avisar al usuario
- [ ] Unidades `"kg"`, `"m2"` y `"PerCent"` definidas en el selector pero sin implementación en `formulas.js` ni en el switch de `FinishingList` — motor de finishing incompleto para esos casos


- [ ] `typeof item.value !== String` en `convertirArrayAObjeto` — siempre evalúa `true`, debería ser `typeof item.value !== "string"`
- [ ] `const [useSubTitle, setSubTitle] = [props.subtitle || props.task]` — no es un `useState`, `setSubTitle` es `undefined`
- [ ] `useEffect(() => {}, [selectedCheckboxItems, useValue])` al final — completamente vacío, eliminar
- [ ] `useEffect` principal tiene `[setItem]` como dependencia — debería ser `[]`
- [ ] `submitHandler` convierte manualmente los valores del formulario siendo que React Hook Form ya los provee en el objeto `e` — simplificar
- [ ] `typeOfInput` es una función enorme (150+ líneas) que devuelve JSX — dividir en componentes: `<SelectInput />`, `<CheckboxInput />`, `<TextInput />`
- [ ] El sistema no soporta fácilmente: campos dependientes entre sí, validaciones cruzadas, o visibilidad condicional — evaluar extensión del modelo de configuración


- [ ] `PartDetail` definida como función interna y llamada como `PartDetail(parte)` en lugar de `<PartDetail />` — rompe el ciclo de vida de React y el comportamiento de los hooks
- [ ] Extraer `PartDetail` como componente independiente en su propio archivo
- [ ] `useEffect` de imposición tiene dependencias incorrectas: `setPartFinishingData` (setter) y `stockCalculated.cantidadDePliegos` (valor derivado) pueden causar loops
- [ ] Eliminar todos los bloques de código comentado (Avatar, CardHeader, Item styled, etc.)
- [ ] `stockRequired` se inicializa como array pero se le asigna un string — limpiar tipo
- [ ] `calcularLomo` es lógica de negocio suelta en el componente — mover a utils o al backend
- [ ] Separar modos "edit" y "quotation" en componentes o rutas distintas

### General
- [ ] Las fórmulas de costo (`productoPorUnidad`, `cantidadDePliegos`, `pliegoPorLongitud`, etc.) viven en el frontend — evaluar mover al backend

### `formSimulators.js` (contratos de impresión)
- [ ] Breakpoints y factores contractuales hardcodeados en el código: Nuvera (355mm→1.6), iGenBN (488mm→1.25), iGenColor (488mm→1.4), Laminado (520mm→1.15) — cuando se renegocia un contrato hay que tocar el código
- [ ] `Laminado` tiene orden de parámetros invertido respecto a todas las demás funciones: `(entrada, valor, minimo, ...)` vs `(valor, minimo, entrada, ...)` — trampa garantizada
- [ ] `Laminado` recibe parámetro `duplex` que nunca se usa
- [ ] `Encuadernacion` usa fórmula `valor * (entrada + cantidad)` en lugar de `entrada + cantidad * valor` — verificar si es intencional o bug
- [ ] `Nuvera`, `iGenBN`, `iGenColor` son conceptualmente la misma fórmula con distintos parámetros contractuales — reemplazar por una función genérica que lea el contrato desde la DB
- [ ] `totalResume(AllData)` se ejecuta en cada render — envolver en `useMemo`
- [ ] `usePrices` se usa dentro de `totalResume` antes de estar cargado — primer render siempre calcula costo de papel como 0 sin error visible
- [ ] `printerCostFunction` recibe `largoPliego` como parámetro pero lo sobreescribe inmediatamente — eliminar el parámetro o no sobreescribirlo
- [ ] `resumen[resumen.length - 1]` como acceso a totales globales es frágil — depende del orden de inserción de propiedades en el objeto `totals`; reemplazar por una propiedad explícita `totals.summary`
- [ ] `Encuadernacion` y `Laminado` importados desde `formSimulators` pero nunca usados — eliminar
- [ ] `Nuvera`, `iGenBN`, `iGenColor` son nombres de productos Xerox hardcodeados como funciones — parte de la deuda del motor de precios que necesita refactor general


- [ ] `Canvas` e `ImpositionDraw` duplican el bloque de escalado y `handleResize` — extraer a función utilitaria compartida `scaleToCanvas(data, canvasWidth, canvasHeight)`
- [ ] `Canvas` muta el objeto `data` directamente al escalar — reemplazar por copia con spread: `const scaledData = { ...data, ... }`
- [ ] `useEffect` en `Canvas` tiene `[setCanvasSize]` como dependencia — debería ser `[]`
- [ ] `props.save(false)` en `Canvas.handleImpoClick` — propósito no documentado, revisar
- [ ] `ImpoContext` importa `useNavigate` pero nunca lo usa — eliminar
- [ ] Valores iniciales hardcodeados en `ImpoProvider` (450, 320, 90, 50) — parecen valores de prueba, evaluar si deben ser null
- [ ] `console.log` de debug en `Canvas.handleResize` — eliminar

---

*Actualizado durante code review — seguir agregando a medida que avanza la revisión.*
