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

Disponemos de dos scripts en el package.json para poder validar que el linteado es correcto y cumple todas las reglas definidas a nivel de clean code: eslint.

Las reglas de eslint están definidas en el archivo `.eslintrc.json`.

````bash
npm run lint
npm run lint:fix
````

### .eslintrc.json

#### Plugins utilizados

- deprecation
  - warning si una librería o método utilizado ha sido deprecado [+info](https://www.npmjs.com/package/eslint-plugin-deprecation)
- prefer-arrow
  - Recomienda arrow functions sobre functions [+info](https://www.npmjs.com/package/eslint-plugin-prefer-arrow)

#### Reglas de ESLint

Se definen cuatro grandes grupos de archivos en los que se aplican reglas específicas de ESLint:

- ["*.ts"],
- ["*.spec.ts", "*.e2e-spec.ts"]
- ["*.html"]
- ["*.js"]

Todo fichero TypeScript deberá cumplir las reglas definidas en ["*.ts"].
Los ficheros con las extensiones ["*.spec.ts", "*.e2e-spec.ts"] cumplirán todas las reglas de ["*.ts"] y además añaden la regla de no permitir `fdescribe` y `fit` en ningún test.
Los ficheros de la sección de ["*.js"] aplican el conjunto de reglas eslint:recommended, y añade reglas utilizadas en el conjunto de ["*.ts"] para mantener un código homogéneo.
Se definen reglas específicas de HTML para los ficheros de la sección ["*.html"].

Para más información acerca de las reglas de ESLint definidas en el FWKA, puedes pulsar [aquí](https://mus.mercadona.com/39eafa15b/v/11842/p/16ad9a-ficheros-de-configuracin/b/08ae6d/t/07d243)

#### Configuración de rutas para lint

En el archivo `angular.json`, sección lint, vienen reflejados que rutas van a ser validadas por ESLint. En caso de tener código necesario en nuestro repositorio en otras rutas (como un directorio `tools`) es necesario añadirlo al siguiente array.

Actualmente, y a modo de ejemplo:

- Se valida todo .ts dentro de /src
- Se valida todo .html dentro de /src
- Se valida todo .ts dentro de /e2e
- Se valida todo .html dentro de /e2e
- Se valida todo .js dentro de /src
- Se valida todo .js dentro de /scripts
- Se valida todo .js en el nivel de root del proyecto

```json
{
  "lint": {
    "builder": "@angular-eslint/builder:lint",
    "options": {
      "lintFilePatterns": [
        "src/**/*.ts",
        "src/**/*.html",
        "e2e/**/*.ts",
        "e2e/**/*.html",
        "src/**/*.js",
        "scripts/**/*.js",
        "*.js"
      ]
    }
  },
}
```

En caso de necesitar omitir el proceso de ESLint en archivos o directorios completos, se recomienda el uso de `.eslintignore`.
Por defecto viene configurada la excepción de lint sobre el directorio donde se espera tener la api autogenerada por swagger.
Utilizad el `.eslintignore` únicamente para excluir de ESLint los archivos autogenerados en el proyecto.

```bash
# See https://eslint.org/docs/user-guide/configuring/ignoring-code#the-eslintignore-file
# for more about ignoring files and paths on eslint

# API autogenerada
/src/app/api
```

También es recomendable que todo desarrollador introduzca en su settings del repositorio `.vscode/settings.json` las reglas contenidas en `.vscode/recommended-settings.json`. Estas reglas son una serie de reglas básicas para forzar el ESLint mientras se realiza el trabajo en el ide. Para el funcionamiento del ide con estas reglas es necesario tener los siguientes plugins instalados:

- ESLint (Dirk Baeumer - dbaeumer.vscode-eslint)

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

Ejecuta la revisión de ESLint y trata de solucionar de forma automática todo problema detectado.

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

## Extensiones recomendadas en VSCode

Extensiones recomendadas para linteo de código, y estilos:

- davidanson.vscode-markdownlint
  - Revisa y repara normas básicas de estilo en archivos .md
  Configuración básica en settings.json para autoFix. Revisad la documentación de la extensión para más posibilidades.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.markdownlint": true
  }
}
```

- dbaeumer.vscode-eslint
  - Integra ESLint en el IDE validando en tiempo real el código sobre las reglas definidas en todo archivo .ts

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": [ "typescript", "javascript", "html" ]
}
```

Notas: se han reportado problemas con la extensión `dbaeumer.jshint`. En caso de tenerla instalada es aconsejable deshabilitarla para que no interfiera con ESLint al validar arhivos .js

- editorconfig.editorconfig
  - Fuerza configuración del ide. Funciona con `.editorconfig`
  Configuración básica en `.editorconfig`. No modificar este archivo sin consenso por parte de todo el equipo [+info](https://editorconfig.org)

```bash
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single

[*.js]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

- redhat.vscode-yaml
  - En caso de utilizar archivos yaml en el proyecto, es altamente recomendable instalar un parseador de yaml.

```json
{
  "yaml.validate": true
}
```

Extensiones recomendadas como utilidades para el desarrollador:

- angular.ng-template
  - Permite validación en tiempo real en las templates de angular. Exige configuración en el tsconfig (tsconfig.app.json), consenso en el equipo, y configuración específica en el proyecto. Recomendada pero no configurada en archetype. Para más información: <https://angular.io/guide/template-typecheck> <https://angular.io/guide/typescript-configuration> <https://angular.io/guide/angular-compiler-options>

```json
{
  "angularCompilerOptions": {
    "strictTemplates": true
  }
}
```

- coenraads.bracket-pair-colorizer
  - Identifica cada par de corchetes con diferentes colores.

- madhusuthanan.angular-unit-testing-snippets
  - Conjunto de snippets para testeo unitario en angular con jasmine. Recomendable visitar la sección del snippet en VSCode para conocer los snippets.


- mhutchie.git-graph
  - Permite visualizar el repositorio como si fuera un grafo, permitiendo acciones de Git en el mismo.

- msjsdiag.debugger-for-chrome
  - Permite hacer debug de código en el propio chrome. Configuración en `.vscode/launch.json` [+info](https://go.microsoft.com/fwlink/?linkid=830387)

```json
{
  "version": "0.2.0",
  "configurations": [
      {
          "type": "chrome",
          "request": "launch",
          "name": "Launch Chrome against localhost",
          "url": "http://localhost:4200",
          "webRoot": "${workspaceFolder}"
      }
  ]
}
```

- shardulm94.trailing-spaces
  - Resalta todo trailing space que se deje en el código, y por defecto los elimina al guardar el archivo.

- vscode-icons-team.vscode-icons
  - Añade iconos representativos de un proyecto Angular a los ficheros según la extensión, de esta forma, es más fácil identificarlos a simple vista.

- waderyan.gitblame
  - Permite ver quien fue el autor y a qué commit pertenece cada línea.

- wayou.vscode-todo-highlight
  - Resalta el color de todo `TODO:` y `FIXME:` por defecto en el código. Con consenso del equipo, pueden definirse otras palabras clave y configurar el estilo. Repasad la documentación de la extensión en caso de ser necesario incluir más palbras clave.

- xyz.local-history
  - Permite visualizar cambios realizados cada vez que se guardó el archivo.

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
