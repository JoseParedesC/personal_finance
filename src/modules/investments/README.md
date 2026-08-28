# Inversiones

La funcionalidad está separada en dos páginas:

- **Configuración > Categoría**: maestro de categorías existente.
- **Configuración > Inversiones**: maestro CRUD de inversiones implementado con `@joseparedesc/master-crud`.
- **Inversiones**: proceso de inversión, operaciones, valoraciones y rentabilidad. No contiene el CRUD del maestro.

El maestro usa `createRestAdapter` contra `/investments` y `investmentConfig`.
