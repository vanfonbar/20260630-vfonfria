# FWK Angular

## Preparación del entorno Mercadona

Si es la primera vez que accedes a utilizar el entorno de Mercadona debes ejecutar el comando:

````sh
npm login
````

Tu usuario es el acrónimo: e_xyz o de ofidona.

La contraseña es la API Key que puedes encontrar en tu perfil de usuario del Artifactory.

## Instalación

Ejecutar los comandos en el siguiente orden:

Instalar las dependencias

````sh
npm install
````

Añadir la configuración necesaria del proyecto:

- Pedirá los idiomas a soportar por la aplicación por defecto ya viene configurado en Español, si desea utilizar otro
  idioma ejecutar el siguiente comando

````sh
ng add @mercadona-fwk-front/schematics
````

Si la aplicación requiere de login ejecutar el siguiente comando:

````sh
ng generate @mercadona-fwk-front/schematics:login
````

## Ejecución

Modo desarrollo

````sh
npm start
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
es correcto y cumple todas las reglas definidas a nivel de clean code: eslint, prettier y stylelint.

Las reglas de eslint están definidas en el archivo `.eslintrc.json`, las de prettier en `.prettierrc.json` y las de stylelint en `.stylelintrc.json`.
En caso de tener directorios en el repositorio que no queremos que sean analizados por prettier, deberemos añadirlos al archivo `.prettierignore`.

````bash
npm run lint
npm run lint:fix
````

También es recomendable que todo desarrollador introduzca en su settings del repositorio `.vscode/settings.json` las reglas contenidas en `.vscode/recommended-settings.json`. Estas reglas son una serie de reglas básicas para forzar el eslint, prettier y stylelint mientras se realiza el trabajo en el ide. Para el funcionamiento del ide con estas reglas es necesario tener los siguientes plugins instalados:

- ESLint (Dirk Baeumer - dbaeumer.vscode-eslint)
- Prettier - Code formatter (Prettier - esbenp.prettier-vscode)
- stylelint (stylelint - stylelint.vscode-stylelint)

## Construcción

````sh
npm run build:pro
````

### Listado completo de scripts disponibles

Mediante el comando "npm run command" siendo command:

- **ng**

Comando para poder ejecutar los comando de angular cuando no está instalado angular-cli en global.

- **start**

Inicia la aplicación

- **start:pro**

Inicia la aplicación en modo producción

- **start:hmr**

Inicia la aplicación en modo remplazo de módulo caliente

- **build**

Compila la aplicación

- **build:pro**

Compila la aplicación en modo producción y genera información necesaria para las herramientas source map analyzer (npm run analyze:source-map) y webpack analyzer (npm run analyze:webpack-bundle)

- **test**

Ejecuta los unit test en modo watch junto al code coverage para Chrome

- **test:safari**

Ejecuta los unit test en modo watch junto al code coverage para Safari

- **test:coverage**

Ejecuta los unit test en modo watch a false junto al code coverage para chrome

- **test:ci**

Ejecuta los unit test específico para el entorno CI/CD en modo ChromeHeadlessCI

- **e2e**

Ejecuta los test end to end

- **lint**

Ejecuta la revisión de lint, es el proceso de ejecutar un programa que analiza su código en busca de errores programáticos y
estilísticos, verifica cualquier error potencial en su código, como errores de sintaxis, nombres de variables mal
escritos etc...

- **lint:fix**

Ejecuta la revisión de lint junto a prettier y stylelint, y trata de solucionar de forma automática todo problema detectado.

- **generate:doc**

Ejecuta la generación de la documentación

- **generate:api**

Genera los módulos y servicios en base a una definición swagger mirar la
documentación <https://confluence.mercadona.com/pages/viewpage.action?pageId=904103030>

### Comandos de análisis

Previamente ejecutar "npm run build:dev" para los siguientes comandos.

- **analyze:source-map**

Ejecuta la el mapa de origen, determina de qué archivo proviene cada byte en su código minimizado, muestra una
visualización de mapa de árbol para revisar de dónde proviene todo el código.

- **analyze:webpack-bundle**

Ejecuta el webpack analyzer, esta es una herramienta visual para ver qué componentes están contribuyendo más al tamaño
de nuestro paquete. Utiliza el archivo JSON de estadísticas del paquete web para proporcionarnos una visualización de
mapa de árbol interactivo del contenido de nuestro paquete.

## Ejemplos de ayuda al desarrollador

- Comunicación contra el backend mediante el fichero proxy.conf.js (En modo desarrollo)
- Definición swagger para la generación de servicios y modelos, dentro de la carpeta swagger se encuentran los ficheros
  necesarios

## Documentación

Empiece a utilizar el FWK Front Angular Responsive, aprenda los fundamentos y explore temas avanzados en nuestro sitio
web de documentación.

[1- Introducción al "FWK Front Angular Responsive"](https://confluence.mercadona.com/pages/viewpage.action?pageId=906293117)

[2- Criterios de uso "FWK Front Angular Responsive"](https://confluence.mercadona.com/pages/viewpage.action?pageId=908092204)

[3- Conocimientos previos para desarrollar](https://confluence.mercadona.com/display/FFAR/3-+Conocimientos+previos+para+desarrollar)

[4- Manual del desarrollador](https://confluence.mercadona.com/display/FFAR/4+-+Manual+del+desarrollador)

[5- Contacta con nosotros](https://confluence.mercadona.com/display/FFAR/5-+Contacta+con+nosotros)

## Dependencias FWKA

- [Librería de core](https://mercadona.zeroheight.com/styleguide/s/42749/p/5669a0-mdulos-core)
- [Librería de core-ui](https://mercadona.zeroheight.com/styleguide/s/42749/p/81121e-mdulos-core-ui)
- [Librería de componentes](https://mercadona.zeroheight.com/styleguide/s/42749/p/906f72-componentes-web)
- [Librería de styles](https://mercadona.zeroheight.com/styleguide/s/42749/p/82cd9a-estilos-para-desarrollo)
- [Librería de iconos](https://mercadona.zeroheight.com/styleguide/s/42749/p/767129--iconos/b/797268)

## Módulos FWKA

- [Error handler (MErrorHandlerModule)](https://mercadona.zeroheight.com/styleguide/s/42749/p/76850c-merrorhandler/b/92f686)
- [Módulo de gestión de logs (MLoggerModule)](https://mercadona.zeroheight.com/styleguide/s/42749/p/34cc9b-mlogger/b/78ba4d)
- [Módulo de traducciones (MTranslateModule)](https://zeroheight.com/39eafa15b/v/latest/p/55c539-iniciar-el-proyecto)
- [Integración con portales (MPlatformModule)](https://zeroheight.com/39eafa15b/v/latest/p/55c539-iniciar-el-proyecto)
- [Página not found (MPageNotFoundModule)](https://zeroheight.com/39eafa15b/v/latest/p/55c539-iniciar-el-proyecto)
- [Página de error (MPageErrorModule)](https://zeroheight.com/39eafa15b/v/latest/p/55c539-iniciar-el-proyecto)
