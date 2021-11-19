# yourAppName

## Scripts

Comando para poder ejecutar los comando de angular cuando no está instalado angular-cli en global.

```sh
npm run ng -- [parámetros del ng]
```

Inicializa la aplicación: instala las dependencias y ejecuta los wizards de idiomas y autenticación. Este comando se
recomienda usar solamente al inicio de la aplicación.

```sh
npm run init
```

Inicia la aplicación [http://localhost:4200](http://localhost:4200)

```sh
npm run start
```

Inicia la aplicación en modo producción [http://localhost:4200](http://localhost:4200)

```sh
npm run start:pro
```

Inicia la aplicación en modo reemplazo de módulo caliente [http://localhost:4200](http://localhost:4200)

```sh
npm run start:hmr
```

Visualiza la documentación generada previamente con `npm run build:doc`, levanta un servidor para su
visualización [http://localhost:8080](http://localhost:8080)

```sh
npm run start:doc
```

Compila la aplicación.

```sh
npm run build
```

Compila la aplicación en modo producción y genera información necesaria para las herramientas source map analyzer (npm
run analyze:source-map) y webpack analyzer (npm run analyze:webpack-bundle).

```sh
npm run build:pro
```

Ejecuta la generación de la documentación. El fichero de configuración `tsconfig.doc.json` define qué ficheros se
incluyen en la documentación.

```sh
npm run build:doc
```

Genera los módulos y servicios en base a una definición swagger.

```sh
npm run build:api
```

Ejecuta los unit test en modo watch junto al code coverage para Chrome.

```sh
npm run test
```

Ejecuta los unit test en modo watch junto al code coverage para Safari.

```sh
npm run test:safari
```

Ejecuta los unit test en modo watch a false junto al code coverage para chrome.

```sh
npm run test:coverage
```

Ejecuta los unit test específico para el entorno CI/CD en modo ChromeHeadlessCI.

```sh
npm run test:ci
```

Ejecuta los test end to end.

```sh
npm run e2e
```

Ejecuta la revisión de lint, es el proceso de ejecutar un programa que analiza su código en busca de errores
programáticos y estilísticos, verifica cualquier error potencial en su código, como errores de sintaxis, nombres de
variables mal escritos etc.

```sh
npm run lint
```

Ejecuta la revisión de ESLint y trata de solucionar de forma automática todo problema detectado.

```sh
npm run lint:fix
```

Comprueba que tu código no tenga vulnerabilidades.

```sh
npm run audit
```

Ejecuta el mapa de origen, determina de qué archivo proviene cada byte en su código minimizado, muestra una
visualización de mapa de árbol para revisar de dónde proviene todo el código. Previamente ejecutar `npm run build:pro`.

```sh
npm run analyze:source-map
```

Ejecuta el webpack analyzer, esta es una herramienta visual para ver qué componentes están contribuyendo más al tamaño
de nuestro paquete. Utiliza el archivo JSON de estadísticas del paquete web para proporcionarnos una visualización de
mapa de árbol interactivo del contenido de nuestro paquete. Previamente ejecutar `npm run build:pro`.

```sh
npm run analyze:webpack-bundle
```

Ejecuta el schematic para añadir el módulo de autentificación

```sh
npm run add:login
```

Ejecuta el schematic para añadir los idiomas a soportar

```sh
npm run add:language
```

Ejecuta el schematic para añadir una nueva página

```sh
npm run add:page
```

Ejecuta el schematic para añadir un nuevo componente

```sh
npm run add:component
```

Ejecuta el schematic para añadir una nueva pipe

```sh
npm run add:pipe
```

Ejecuta el schematic para añadir una nueva directive

```sh
npm run add:directive
```

Ejecuta el schematic para añadir un nuevo servicio

```sh
npm run add:service
```

Ejecuta el schematic para añadir un nuevo modelo

```sh
npm run add:model
```

Ejecuta el schematic para añadir una nueva interfaz

```sh
npm run add:interface
```

## Documentación FWKA

Empiece a utilizar el FWK Front Angular Responsive, aprenda los fundamentos y explore temas avanzados en nuestro sitio
[web](https://mus.mercadona.com).
