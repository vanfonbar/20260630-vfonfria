# Fase 4 — Elige entre dos implementaciones

## Ejercicio 1

### ¿Cuál de las dos implementaciones elegirías para este proyecto y por qué?

Elegiria la solución B, porque con la opción A al usar forkJoin espera a que se completen todos los observables para emitir un evento. En cambio el combineLastest cada vez que recibe u evento emite en un Array con el último valor de cada entrada y reaccionaría a solo un cambio de filtro

### ¿Detectas algún problema en la solución que no elegiste??

Si, la opción A ademas no hace uso del takeUntil para liberar memoria cuando se completa el observable

## Ejercicio 2

### ¿Cuál de las dos implementaciones es más apropiada para este requisito y por qué?

Elegiría la solución B, porque en este caso el Servicio no utiliza providedIn: 'root' y su estado no persiste en toda la aplicación. De esta manera al cargar el provider en @Component esta generando un única instancia para ese Card en concreto.

### ¿Qué problema concreto causa la que descartaste en esta app?

La opción A al usar @Injectable({ providedIn: 'root' }) " registra el servicio en el injector raíz de la aplicación y sería la misma instancia para todas las cards y en este caso se necesita que cada tarjeta del catálogo gestione su propio estado
