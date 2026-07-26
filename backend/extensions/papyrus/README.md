# Extensión Papyrus

Integración de solo-lectura con el ERP legacy **Papyrus** (Sybase/SQL) del
taller. Es una **extensión opcional**: solo aplica a tenants que tengan
configurada `settings.extensions.papyrusExtractUrl`. Un tenant sin esa URL
ignora todo esto por completo.

Todo lo relacionado con Papyrus vive en esta carpeta. El core de Hamlet no
sabe que Papyrus existe, salvo por una línea en `app.js` que monta el router.
Para desactivar la extensión, se comenta esa línea y Hamlet sigue funcionando.

## Cómo funciona

El frontend nunca manda SQL. Manda el **nombre** de una query y, si hace falta,
parámetros simples:

```
POST /Hamlet/papyrus/query
{ "query": "detalleOT", "params": { "ot": 27703 } }
```

El flujo:

1. `papyrusControl` busca la query por nombre en el registro. Si no existe,
   la rechaza (whitelist).
2. Valida y sanea cada parámetro con el validador que la query declara.
   Acá se corta cualquier inyección SQL: los valores se fuerzan a su tipo.
3. Arma el SQL (que nunca sale del backend) y se lo manda al bridge del taller.
4. Devuelve las filas.

## Archivos

- `papyrusQueries.js` — **el registro**. SQL + validación de params. Es lo
  único que crece cuando agregás una consulta.
- `papyrusControl.js` — la maquinaria. Genérica, no sabe de queries puntuales.
  Casi nunca se toca.
- `papyrusRouter.js` — un solo endpoint (`POST /query`).

## Cómo agregar una query nueva

Editás **solo** `papyrusQueries.js`. Agregás una entrada:

```js
miQueryNueva: {
  params: { codPre: { validate: validators.integer } },  // omitir si no lleva params
  sql: ({ codPre }) => `SELECT ... WHERE cod_pre = ${codPre}`,
},
```

Y ya está disponible como `{ query: "miQueryNueva", params: { codPre: 123 } }`.
No se toca el controller ni el router.

## Seguridad

- **Whitelist**: solo se pueden correr queries que estén en el registro.
- **Params saneados**: cada param pasa por un validador que fuerza su tipo
  (entero, fecha `YYYY-MM-DD`, etc.) antes de tocar el SQL.
- **Solo el backend arma SQL**: el browser nunca ve ni manda sentencias.
- **Auth**: el endpoint está detrás de `requireRoleByMethod` en el router
  maestro, así que exige token y membresía activa en el tenant.

## Pendiente (para la pasada de seguridad del bridge)

- Header secreto compartido entre Hamlet y el bridge.
- Allowlist de IP en el nginx del taller.
- Confirmar que el usuario Sybase del bridge es solo-lectura.
