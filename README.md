# FWK Angular

## Preparación del entorno Mercadona

Si es la primera vez que accedes a utilizar el entorno de Mercadona debes ejecutar el comando:

````sh
npm login
````

Tu usuario es el acrónimo: e_xyz o de ofidona.

La contraseña es la API Key que puedes encontrar en tu perfil de usuario del Artifactory.

## Instalación

En primer lugar deberemos instalar los siguiente elementos:

- Dependencias.
- Idiomas: la aplicación ya viene configurada por defecto en Español, de todas maneras, podemos cambiar esta configuración e incluso añadir más idiomas.
- Autenticación: si la aplicación requiere de login deberemos instalar el módulo de autenticación correspondiente.

El siguiente comando le guía de forma intuitiva y sencilla a través de la instalación de todos los elementos anteriores: 

````sh
npm run init:install
````

## Ejecución

Modo desarrollo

````sh
npm run start
````

Modo producción

````sh
npm run start:pro
````

Disponible en modo HMR Hot Reload Module [+info](https://webpack.js.org/guides/hot-module-replacement)

````sh
npm run start:hmr
````

- Abrir el navegador e ir a la página [http://localhost:4200](http://localhost:4200)

## Parseado del código [lint]

Disponemos de dos scripts en el package.json para poder validar que el linteado de todo js, ts, html y scss
es correcto y cumple todas las reglas definidas a nivel de clean code: eslint y stylelint.

Las reglas de eslint están definidas en el archivo `.eslintrc.json`, y las de stylelint en `.stylelintrc.json`.

````bash
npm run lint
npm run lint:fix
````

También es recomendable que todo desarrollador introduzca en su settings del repositorio `.vscode/settings.json` las reglas contenidas en `.vscode/recommended-settings.json`. Estas reglas son una serie de reglas básicas para forzar el eslint y stylelint mientras se realiza el trabajo en el ide. Para el funcionamiento del ide con estas reglas es necesario tener los siguientes plugins instalados:

- ESLint (Dirk Baeumer - dbaeumer.vscode-eslint)
- stylelint (stylelint - stylelint.vscode-stylelint)

## Construcción

````sh
npm run build:pro
````

### Listado completo de scripts disponibles

Comando para poder ejecutar los comando de angular cuando no está instalado angular-cli en global.
````sh
npm run ng -- [parámetros del ng]
````

Inicia la aplicación.
````sh
npm run start
````

Inicia la aplicación en modo producción.
````sh
npm run start:pro
````

Inicia la aplicación en modo reemplazo de módulo caliente.
````sh
npm run start:hmr
````

Compila la aplicación.
````sh
npm run build
````

Compila la aplicación en modo producción y genera información necesaria para las herramientas source map analyzer (npm run analyze:source-map) y webpack analyzer (npm run analyze:webpack-bundle).
````sh
npm run build:pro
````

Ejecuta los unit test en modo watch junto al code coverage para Chrome.
````sh
npm run test
````

Ejecuta los unit test en modo watch junto al code coverage para Safari.
````sh
npm run test:safari
````

Ejecuta los unit test en modo watch a false junto al code coverage para chrome.
````sh
npm run test:coverage
````

Ejecuta los unit test específico para el entorno CI/CD en modo ChromeHeadlessCI.
````sh
npm run test:ci
````

Ejecuta los test end to end.
````sh
npm run e2e
````

Ejecuta la revisión de lint, es el proceso de ejecutar un programa que analiza su código en busca de errores programáticos y
estilísticos, verifica cualquier error potencial en su código, como errores de sintaxis, nombres de variables mal
escritos etc.
````sh
npm run lint
````

Ejecuta la revisión de eslint y stylelint, y trata de solucionar de forma automática todo problema detectado.
````sh
npm run lint:fix
````

Ejecuta la generación de la documentación.
````sh
npm run generate:doc
````

Genera los módulos y servicios en base a una definición swagger mirar la
documentación <https://confluence.mercadona.com/pages/viewpage.action?pageId=904103030>
````sh
npm run generate:api
````

### Comandos de análisis

Previamente ejecutar "npm run build:pro" para los siguientes comandos:

Ejecuta la el mapa de origen, determina de qué archivo proviene cada byte en su código minimizado, muestra una
visualización de mapa de árbol para revisar de dónde proviene todo el código.
````sh
npm run analyze:source-map
````

Ejecuta el webpack analyzer, esta es una herramienta visual para ver qué componentes están contribuyendo más al tamaño
de nuestro paquete. Utiliza el archivo JSON de estadísticas del paquete web para proporcionarnos una visualización de
mapa de árbol interactivo del contenido de nuestro paquete.
````sh
npm run analyze:webpack-bundle
````

## Ejemplos de ayuda al desarrollador

- Comunicación contra el backend mediante el fichero proxy.conf.js (En modo desarrollo)
- Definición swagger para la generación de servicios y modelos, dentro de la carpeta swagger se encuentran los ficheros necesarios

## Documentación

Empiece a utilizar el FWK Front Angular Responsive, aprenda los fundamentos y explore temas avanzados en nuestro sitio
web de documentación.

[1- Cómo empezar](https://mus.mercadona.com/39eafa15b/v/11842/p/401878-alta-red-mercadona)

[2- Archetype](https://mus.mercadona.com/39eafa15b/v/11842/p/09e42e-solicitar-archetype/b/877554)

[3- Módulos Core](https://mus.mercadona.com/39eafa15b/v/11842/p/855cff-mtranslate/b/9943e8)

[4- Módulos Core UI](https://mus.mercadona.com/39eafa15b/v/11842/p/543c40-mauthtoken/b/84bf44)

[5- Schematics](https://mus.mercadona.com/39eafa15b/v/11842/p/26a24f-ng-add)

[6- Componentes](https://mus.mercadona.com/39eafa15b/v/11842/p/01f2b5-componentes)

[7- Estilos](https://mus.mercadona.com/39eafa15b/v/11842/p/82cd9a-estilos)

[8- Iconos](https://mus.mercadona.com/39eafa15b/v/11842/p/767129--iconos/b/797268)

[9- Contacta con nosotros](https://confluence.mercadona.com/display/FFAR/5-+Contacta+con+nosotros)
