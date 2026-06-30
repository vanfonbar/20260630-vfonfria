# Prueba técnica — Gestor de Pedidos

Bienvenido/a. Esta es la base sobre la que trabajarás durante la prueba técnica.

## Arrancar el proyecto

Necesitas **dos terminales** en paralelo:

```bash
# Terminal 1 — servidor de datos mock
npm run start:mock

# Terminal 2 — aplicación Angular
npm start
```

La app estará disponible en `http://localhost:4200`.  
La API mock estará disponible en `http://localhost:3000`.

## Endpoints disponibles

| Método | URL                            | Descripción                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/productos`                   | Lista todos los productos  |
| GET    | `/productos/:id`               | Obtiene un producto por ID |
| GET    | `/productos?categoria=frescos` | Filtra por categoría       |
| GET    | `/productos?nombre_like=leche` | Búsqueda por nombre        |

## Lo que se te pide

Consulta el documento de la prueba técnica para los requerimientos detallados.

Como punto de partida, ten en cuenta que este código base **tiene errores intencionados** que deberás identificar en la Fase 1.
