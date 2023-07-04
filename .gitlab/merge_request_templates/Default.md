[[_TOC_]]

# Descripción

Describe el motivo y la solución. Incluye un resumen de los cambios y de la tarea relacionada, además del resultado.
Es posible añadir información relevante para contextualizar como imágenes.

## Ticket

- [APP-XXX](https://jira.mercadona.com/browse/APP-XXX)

## Tipo de cambio

- [ ] `fix` (cambio no rupturista el cual corrige un problema)
- [ ] `feature` (cambio no rupturista el cual añade una funcionalidad)
- [ ] `refactor` (cambio no rupturista que no es un `feature` ni un `fix`)
- [ ] `docs` (cambios de documentación)
- [ ] `chore` (cambios que no modifican archivos internos de `src` o de `test`)
- [ ] `ci` (cambios para la configuración de CI)
- [ ] `perf` (cambios que mejoran el rendimiento)
- [ ] `style` (cambios que no afectan al resultado del código, por ejemplo correción de espacios en blanco o saltos de línea)
- [ ] `test` (añade test o corrige existentes)
- [ ] `breaking change` (cambio rupturista para corregir o actualizar un comportamiento no esperado o antiguo)

Si el cambio es considerado rupturista, el título de la MR debe contener una exclamación `!`.

# ¿Cómo se ha testeado?

Describe los test que has ejecutado para verificar los cambios.
Es posible aportar las instrucciones necesarias para reproducirlo.
Si alguno no aplica se puede tachar.

## Tipos de test realizados

- [ ] Test unitarios
- [ ] ~~Test E2E~~

## Validación

- [ ] He probado en web. 🖥
- [ ] He probado en web mobile. 📱
- [ ] He probado en app Android. 🤖
- [ ] He probado en app iOs (iPhone). 🍏
- [ ] He probado en app iOs (iPad). 🍎

# Comprobaciones de código

- [ ] Lint de código afectado
- [ ] Test de código afectado
- [ ] Build de código afectado
