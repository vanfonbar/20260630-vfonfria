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

A su vez, la configuración de eslint se realiza gracias a dos archivos de configuración.

- Las reglas de eslint del proyecto están definidas en el archivo `.eslintrc.js`. Las reglas definidas en este archivo pueden sobreescribir, o implementar nuevas reglas sobre `.eslint-config-basic.js`
- El conjunto de reglas de eslint recomendadas, basadas en angular:recommended y eslint:recommended para archivos .ts y .js están definidas en el archivo `.eslint-config-basic.js`. Este último archivo no ha de editarse.

````bash
npm run lint
npm run lint:fix
````

### .eslintrc.js

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

Por defecto, `.eslintrc.js` extiende `.eslintrc-config-basic.js`. Podemos sobreescribir el comportamiento de las reglas de `.eslintrc-config-basic.js` o imponer nuevas editando la sección correspondiente en `.eslintrc.js`. Pero nunca, editar o desactivar el extend de `.eslintrc-config-basic.js`

```js
{
      'files': ['*.ts'],
      'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module',
        'project': [
          'tsconfig.json',
          'e2e/tsconfig.json'
        ],
        'createDefaultProgram': true
      },
      'extends': [
        './.eslint-config-basic.js'
      ],
      'rules': {
        ...
      }
    },
```

Si por ejemplo utilizamos underscore-dangle en nuestros archivos .ts, tendremos por defecto un error

```ts
const _config = 'value';
// error  Unexpected dangling '_' in '_config'          no-underscore-dangle
```

Para habilitar el uso de no-underscore-dangle en archivos .ts, aunque su uso no esté recomendado, deberemos de añadir una regla a `.eslintrc.js`

```js
{
      'files': ['*.ts'],
      'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module',
        'project': [
          'tsconfig.json',
          'e2e/tsconfig.json'
        ],
        'createDefaultProgram': true
      },
      'extends': [
        './.eslint-config-basic.js'
      ],
      'rules': {
        'no-underscore-dangle': 'off',
        ...
      }
    },
```

De esta forma sobreescribimos el comportamiento de la regla no-underscore-dangle, que viene de './.eslint-config-basic.js', que a su vez es parte de eslint:recommended

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

## tsconfig

TypeScript es el lenguaje primario para el desarrollo de aplicaciones Angular. Es un superconjunto de JavaScript con soporte en tiempo de diseño para herramientas y seguridad de tipos.

Los navegadores no pueden ejecutar TypeScript directamente. TS debe "transpilarse" a JavaScript utilizando el compilador tsc, que requiere cierta configuración.

Un espacio de trabajo de Angular determinado contiene varios archivos de configuración de TypeScript. En la raíz, el archivo tsconfig.json especifica las opciones básicas del compilador TypeScript y Angular que heredan todos los proyectos del espacio de trabajo.

Por ejemplo, dado el tsconfig.json de raíz, el tsconfig.spec.json extenderá las opciones marcadas

tsconfig.json

```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "baseUrl": "src",
    "outDir": "dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2020",
    "module": "es2020",
    "lib": [
      "es2020",
      "dom"
    ],
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@constants": ["app/app-config.constants.ts"],
      "@interfaces": ["app/app-config.interface.ts"],
      "@routings": ["app/app-routing.module"],
      "@app/pages/*": [
        "app/pages/welcome-to-fwka/*"
      ],
      "@app/*": ["app/*"],
      "@environments": ["environments"],
      "@environments/*": ["environments/*"],
      "@e2e/*": ["../e2e/src/*"],
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

tsconfig.app.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}

```

tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine"
    ]
  },
  "files": [
    "src/test.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

###  paths

Dentro del tsconfig, uno de los parámetros principales que tendremos que mantener es el paths. Se recomienda el uso de módulos de la aplicación, y con esta propiedad podremos crear aliases para poder gestionar mejor los imports.

```json
{
  "paths": {
    "@constants": ["app/app-config.constants.ts"],
    "@interfaces": ["app/app-config.interface.ts"],
    "@routings": ["app/app-routing.module"],
    "@app/pages/*": [
      "app/pages/welcome-to-fwka/*"
    ],
    "@app/*": ["app/*"],
    "@environments": ["environments"],
    "@environments/*": ["environments/*"],
    "@e2e/*": ["../e2e/src/*"],
  }
}
```

Por ejemplo, en caso de crear nuevas páginas o módulos deberemos de editar este objeto para añadir nuevas rutas.

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

Visualiza la documentación generada previamente con `npm run generate:doc`, levanta un servidor para su visualización.

````sh
npm run start:doc
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

Ejecuta la generación de la documentación. El fichero de configuración `tsconfig.doc.json` define qué ficheros se incluyen en la documentación.

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

En el archivo `.vscode/recommended-settings.json` podrás encontrar la configuración mínima recomendada para las extensiones listadas. Cada desarrollador deberá de rellenar su `.vscode/settings.json` dependiendo de las extensiones instaladas. Este último archivo por defecto no entra en el repositorio, pero puede ser editado en caso de llegar a un consenso en el equipo editando el `.gitignore` del repositorio.

###  Extensiones recomendadas para linteo de código, y estilos

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
  - Integra ESLint en el IDE validando en tiempo real el código sobre las reglas definidas en todo archivo .ts y .js. Automáticamente realizará la validación sobre el conjunto de reglas definidas en el repositorio.

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

Se puede configurar en settings que reglas de validación van a utilizarse. Se adjunta algunas de ellas, es recomendable visitar la documentación de la extensión :

```json
{
  "yaml.validate": true,
  "yaml.format.singleQuote": true,
  "yaml.format.bracketSpacing": true,
  "yaml.format.proseWrap": "preserve", // always | never
  "yaml.format.printWidth": 80, // 120, 140...
  // ...
}
```

En caso de querer definir schemas, para validar la configuración contra un conjunto de valores posibles, se recomienda revisar la sección `Using yaml.schemas settings` en el readme <https://github.com/redhat-developer/yaml-language-server/tree/master#using-yamlschemas-settings>

A falta de mejor documentación de todas las opciones, es recomendable revisar los handlers `src/languageserver/handlers/`
<https://github.com/redhat-developer/yaml-language-server/tree/master/src/languageserver/handlers>

- shardulm94.trailing-spaces
  - Resalta todo trailing space que se deje en el código, y por defecto los elimina al guardar el archivo.

- coenraads.bracket-pair-colorizer
  - Identifica cada par de corchetes con diferentes colores.

- voldemortensen.rainbow-tags
  - Pinta de colores los diferentes pares de etiquetas en archivos html

- oderwat.indent-rainbow
  - Identifica todas las identaciones y las pinta de diferentes colores para agilizar en la lectura. Se puede configurar para definir en que archivos queremos que funcione

```json
{
  "indentRainbow.includedLanguages": ["typescript", "html"],
  "indentRainbow.excludedLanguages": ["plaintext"],
  "indentRainbow.updateDelay": 100
}
```

###  Extensiones recomendadas como utilidades para el desarrollador en proyectos TS y node

- vscode-icons-team.vscode-icons
  - Añade iconos representativos de un proyecto Angular a los ficheros según la extensión, de esta forma, es más fácil identificarlos a simple vista.

- wayou.vscode-todo-highlight
  - Resalta el color de todo `TODO:` y `FIXME:` por defecto en el código. Con consenso del equipo, pueden definirse otras palabras clave y configurar el estilo. Repasad la documentación de la extensión en caso de ser necesario incluir más palbras clave.

- 42crunch.vscode-openapi
  - Añade soporte para la especificación de OpenApi <https://github.com/OAI/OpenAPI-Specification>

- angular.ng-template
  - Permite validación en tiempo real en las templates de angular. Exige configuración en el tsconfig (tsconfig.app.json), consenso en el equipo, y configuración específica en el proyecto. Recomendada pero no configurada en archetype. Para más información: <https://angular.io/guide/template-typecheck> <https://angular.io/guide/typescript-configuration> <https://angular.io/guide/angular-compiler-options>

```json
{
  "angularCompilerOptions": {
    "strictTemplates": true
  }
}
```

- madhusuthanan.angular-unit-testing-snippets
  - Conjunto de snippets para testeo unitario en angular con jasmine. Recomendable visitar la sección del snippet en VSCode para conocer los snippets. Muchos de estos atajos utilizan `async` de `@angular/core/testing`, el cual está deprecado y es necesario editarlo a `waitForAsync`. Algunos de sus atajos:
    - jat-component-basic: Unfold theunit test setup for component (Runs in isolation)
    - jat-component-with-service-mock: Component unit test setup with a sample mock service (Runs in isolation)
    - jat-mock-observable-success-service: Mock service which returns an observable, to use in useClass provider
    - jat-suite: Generates a jasmine describe block (Test suite)
    - jat-spec: Generates an it block (Test spec)
    - jat-use-value-provider: Angular useValue provider to inject mock value as dependency instead of an injection token or injected service.
    - jat-use-class-provider: Angular useClass provider to inject a mock class as dependency instead of an injection token or injected service.
    - jat-mock-router: Mock Class to use as a mock for the injected Router class (Has minimal methods like navigate, navigateByUrl etc. These can be extended)
    - jat-http-success-spec: Spec that makes use of angular HttpTestingController to test http requests
    - jat-http-error-spec: Spec that makes use of angular HttpTestingController to test http requests that may return error
    jat-dispatch-event-spec: Spec that dispatches an event to simulate user interactions in unit tests
    - jat-before-each: Generates an empty before each block
    - jat-before-each-wait-for-async: Creates an asynchronous before each block
    - jat-service-before-each : Creates a before each block for testing your service

ej:

```ts

jat-before-e // tab

beforeEach(() => {

});

jat-s // tab
it('should ', () => {

});

```

- mikael.angular-beastcode
  - Conjunto de snippets de ts y html en angular. Recomendable visitar la sección del snippet en VSCode para conocer los snippets. Es posible ver recomendaciones de los snippets posibles con la siguiente configuración. Es recomendable acceder a la ficha de la extensión para conocer todos los plugins útiles en el proyecto.
  - Grupos de sus atajos:
    - ng-: Angular Snippets
    - fx-: Angular Flex Layout Snippets
    - ngrx-: Angular NgRx Snippets
    - ngxs-: Angular Ngxs Snippets
    - m-: Angular Material Design Snippets
    - rx-: RxJS Snippets for both TypeScript and JavaScript
    - sw-: Service Workers Snippets
    - t-: Test Snippets
    - e-: Test Expect Snippets
    - pwa-: Progressive Web Applications Snippets
  - Algunos de sus atajos:
    - ng-for-trackBy: `*ngFor="let item of items; trackBy:item.id"`
    - e-ntbf: `expect().not.toBeFalsy();`
    - e-ntbt: `expect().not.toBeTruthy();`
    - e-thbc: `expect().toHaveBeenCalled();`
    - m-button: `<button mat-button>text</button>`
    - m-chip: `<mat-chip>text</mat-chip>`
    - ng-afterViewInit: `ngAfterViewInit(): void { }`
    - ng-button: `<button (click)="onClick()">name</button>`
    - ng-debug: `<pre>{{ obj | json }}</pre>`
    - ng-if-else: `<ng-container *ngIf="expression; else elseTemplate"></ng-container><ng-template #elseTemplate></ng-template>`
    - ng-pipe-lowercase: `{{ variable | lowercase }}`
    - ng-router-link: `<a [routerLink]="[ '/path', routeParam ]">name</a>`
    - ng-switch: `<span [ngSwitch]=""><p *ngSwitchCase="true"></p><p *ngSwitchCase="false"></p><p *ngSwitchDefault></p></span>`
    - ng-template: `<ng-template #name></ng-template>`
    - t-afterAll: `afterAll(() => {});`
    - t-afterEach: `afterEach(() => {});`
    - t-beforeAll: `beforeAll(() => {});`
    - t-beforeEach: `beforeEach(() => {});`
    - t-describe-it: `describe('Description', () => {it('Test', () => {expect().toBe();});});`
    - t-ite: `it('Test', () => {expect().toBe();});`

- zignd.html-css-class-completion
  - Autocompletado para las definiciones de css

```json
{
  "html-css-class-completion.HTMLLanguages": ["html"]
}
```

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

- stringham.move-ts
  - Permite mover archivos ts actualizando sus imports dentro del espacio de trabajo. En caso de querer utilizarlo, es recomendable marcarle un nuevo atajo de teclado en `keybindings.json`:

```json
{
  "key": "ctrl+alt+m",
  "command": "move-ts.move",
  "when": "editorTextFocus"
}
```

- formulahendry.auto-rename-tag
  - Permite autorenombrar el par de etiquetas HTML o XML al editarlas

```json
{
    "auto-rename-tag.activationOnLanguage": ["html", "xml"]
}
```

###  Extensiones recomendadas como utilidades para gestion de git y historia de cambios

- xyz.local-history
  - Permite visualizar cambios realizados cada vez que se guardó el archivo en local. Se recomienda su instalación siempre.

- mhutchie.git-graph
  - Permite visualizar el repositorio como si fuera un grafo, permitiendo acciones de Git en el mismo.

- eamodio.gitlens
  - Permite realizar búsquedas en el log de git, visualizar el grafo, ver diferencias entre versiones de archivos, comprar versiones, ver el autor y a que comit pertenece cada línea en la barra de status o al hacer hover etc. En caso de tener instalada esta extensión, mhutchie.git-graph, donjayamanne.githistory y waderyan.gitblame pueden omitirse al proporcionar información redundante. Es necesario tener conocimientos avanzados de git para poder utilizar todas sus funcionalidades

- pflannery.vscode-versionlens
  - Permite visualizar en los archivos package.json cual es la última versión disponible de cada librería instalada. Es necesario pulsar el botón `V` que aparece en la esquina superior derecha de la pestaña del archivo

- vivaxy.vscode-conventional-commits
  - Fuerza el estilo de los commits al formato de  Conventional Commits <https://www.conventionalcommits.org/en/v1.0.0/>. Hace uso de la configuración del repositorio <https://commitlint.js.org/#/reference-configuration> `.commitlintrc.json`. Es necesario seguir las recomendaciones de mercadona en todo repositorio para el subject de los commits: <https://confluence.mercadona.com/display/GCCICDN/Referencia+para+desarrolladores+de+aplicaciones+CNA>.
  En caso de hacer commit por bash la misma configuración será exigida por husky `.huskyrc`

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
