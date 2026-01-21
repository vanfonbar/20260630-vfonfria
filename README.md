# Mercadona Angular Framework - Archetype v3.18.0

Aplicación base del Framework Angular de Mercadona. Este arquetipo proporciona una estructura completa y optimizada para desarrollar aplicaciones frontend siguiendo las mejores prácticas y estándares corporativos.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v22.9.0 (recomendado usar [nvm](https://github.com/nvm-sh/nvm))
- **npm**: v10.8.3
- **Git**: Configurado con tu nombre y email

```bash
# Verificar versiones instaladas
npm run check:versions

# Si usas nvm, puedes cambiar a la versión correcta
nvm use
```

## 🚀 Primeros Pasos

### 1. Verificar Salud del Proyecto

```bash
npm run health
```

Este comando verifica que todas las dependencias y configuraciones estén correctas.

### 2. Inicializar el Proyecto

```bash
npm run init
```

Este comando:

- Instala todas las dependencias
- Ejecuta los wizards de configuración de idiomas
- Configura el módulo de autenticación

⚠️ **Nota**: Solo ejecutar este comando al inicio del proyecto.

### 3. Configurar el Nombre del Proyecto

**IMPORTANTE**: Configura el nombre de tu aplicación antes de empezar a desarrollar.

```bash
node scripts/config-archetype.js --appName=mi-aplicacion
```

**Parámetros**:

- `--appName`: Nombre de tu aplicación (sin espacios, sin ñ, sin puntos)
- `--scope`: (Opcional) Scope del paquete npm (ej: @mercadona)
- `--version`: (Opcional) Versión inicial (por defecto: 0.0.0)
- `--dryRun`: (Opcional) Simula los cambios sin aplicarlos
- `--keepScript`: (Opcional) No elimina el script después de ejecutarlo

**Ejemplo**:

```bash
# Configuración básica
node scripts/config-archetype.js --appName=gestion-pedidos --scope=@mercadona

# Previsualizar cambios sin aplicarlos
node scripts/config-archetype.js --appName=gestion-pedidos --dryRun=true

# Con versión específica
node scripts/config-archetype.js --appName=gestion-pedidos --scope=@mercadona --version=1.0.0
```

Este script:

- ✅ Actualiza `package.json` con el nombre y scope
- ✅ Actualiza `angular.json` con el nombre del proyecto
- ✅ Actualiza archivos de configuración
- ✅ Se auto-elimina después de ejecutarse (a menos que uses `--keepScript`)

⚠️ **Nota**: Este script NO modifica el README.md (para mantenerlo como documentación base).

### 4. Arrancar el Servidor de Desarrollo

```bash
npm start
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)

## 💻 Comandos de Desarrollo

### Servidor de Desarrollo

| Comando             | Descripción                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `npm start`         | Inicia el servidor en modo desarrollo →[localhost:4200](http://localhost:4200)   |
| `npm run start:pro` | Inicia el servidor en modo producción →[localhost:4200](http://localhost:4200)   |
| `npm run start:hmr` | Inicia con Hot Module Replacement (HMR) →[localhost:4200](http://localhost:4200) |
| `npm run start:doc` | Visualiza la documentación generada →[localhost:8080](http://localhost:8080)     |

### Build y Compilación

| Comando                 | Descripción                                          |
| ----------------------- | ---------------------------------------------------- |
| `npm run build`         | Compila la aplicación para producción                |
| `npm run build:pro`     | Compila con source maps y estadísticas para análisis |
| `npm run build:preview` | Compila en modo desarrollo para preview              |
| `npm run build:doc`     | Genera la documentación con Compodoc                 |

### Testing

| Comando                      | Descripción                                    |
| ---------------------------- | ---------------------------------------------- |
| `npm test`                   | Ejecuta tests en modo watch con Chrome         |
| `npm run test:safari`        | Ejecuta tests en modo watch con Safari         |
| `npm run test:coverage`      | Ejecuta tests sin watch (sin code coverage)    |
| `npm run test:with-coverage` | Ejecuta tests con code coverage                |
| `npm run test:local`         | Ejecuta tests en modo headless (para CI local) |
| `npm run test:ci`            | Ejecuta tests para CI/CD                       |

### Análisis de Calidad

| Comando                    | Descripción                                    |
| -------------------------- | ---------------------------------------------- |
| `npm run lint`             | Analiza errores de ESLint                      |
| `npm run lint:fix`         | Corrige automáticamente problemas de ESLint    |
| `npm run lint:errors`      | Muestra solo errores (sin warnings)            |
| `npm run lint:prettier`    | Verifica formato del código con Prettier       |
| `npm run stylelint`        | Analiza errores de CSS/SCSS                    |
| `npm run stylelint:fix`    | Corrige automáticamente problemas de estilos   |
| `npm run stylelint:errors` | Muestra solo errores de estilos (sin warnings) |
| `npm run audit`            | Verifica vulnerabilidades de seguridad         |

### Análisis de Bundle

Primero ejecuta `npm run build:pro`, luego:

| Comando                          | Descripción                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| `npm run analyze:source-map`     | Analiza el tamaño del bundle con Source Map Explorer        |
| `npm run analyze:webpack-bundle` | Analiza el contenido del bundle con Webpack Bundle Analyzer |

### Testing Avanzado

| Comando                 | Descripción                         |
| ----------------------- | ----------------------------------- |
| `npm run stryker:local` | Ejecuta mutation testing localmente |
| `npm run stryker:ci`    | Ejecuta mutation testing en CI/CD   |

## 🔧 Comandos de Mantenimiento

### Validación y Limpieza

| Comando                  | Descripción                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `npm run health`         | Verifica salud del proyecto (versiones, dependencias, config) |
| `npm run validate`       | Valida estructura y configuración del proyecto                |
| `npm run validate:quick` | Validación rápida (solo verificaciones esenciales)            |
| `npm run validate:fix`   | Valida y corrige automáticamente problemas detectados         |
| `npm run clean`          | Limpia archivos temporales y directorios de compilación       |
| `npm run clean:deep`     | Limpieza profunda (incluye caché del navegador)               |
| `npm run clean:all`      | Limpieza completa (incluye node_modules y package-lock.json)  |

### Verificación de Actualizaciones

| Comando                  | Descripción                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `npm run check:versions` | Muestra versiones de Node, npm y Angular CLI                    |
| `npm run check:outdated` | Verifica actualizaciones disponibles para dependencias          |
| `npm run check:all`      | Ejecuta todas las verificaciones (health, validate, lint, test) |

### Gestión de Entornos

| Comando                       | Descripción                                    |
| ----------------------------- | ---------------------------------------------- |
| `npm run sync:env`            | Verifica sincronización de archivos de entorno |
| `npm run sync:env:init`       | Inicializa configuración de sincronización     |
| `npm run sync:env:verbose`    | Verifica sincronización con output detallado   |
| `npm run generate:env`        | Genera archivos de configuración de entorno    |
| `npm run generate:env:status` | Muestra estado de generación de entornos       |
| `npm run generate:env:force`  | Fuerza regeneración de archivos de entorno     |

## 🎨 Generadores (Schematics)

Comandos para generar código con la estructura corporativa:

### Configuración Inicial

| Comando                | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run add:login`    | Añade módulo de autenticación                     |
| `npm run add:language` | Configura idiomas soportados                      |
| `npm run add:icons`    | Añade iconos al proyecto                          |
| `npm run add:pwa`      | Convierte la aplicación en PWA                    |
| `npm run add:swagger`  | Genera servicios desde definición Swagger/OpenAPI |

### Generación de Código

| Comando                 | Descripción                |
| ----------------------- | -------------------------- |
| `npm run add:page`      | Genera una nueva página    |
| `npm run add:component` | Genera un nuevo componente |
| `npm run add:service`   | Genera un nuevo servicio   |
| `npm run add:pipe`      | Genera una nueva pipe      |
| `npm run add:directive` | Genera una nueva directiva |
| `npm run add:model`     | Genera un nuevo modelo     |
| `npm run add:interface` | Genera una nueva interfaz  |

## 🔄 Git Hooks y Pre-commit

| Comando                             | Descripción                                       |
| ----------------------------------- | ------------------------------------------------- |
| `npm run precommit`                 | Ejecuta linters y tests locales (usado por Husky) |
| `npm run lint:staged`               | Ejecuta linters en archivos staged                |
| `npm run lint:staged:fix`           | Corrige formato y ESLint en archivos staged       |
| `npm run lint:staged:prettier:fix`  | Corrige solo formato en archivos staged           |
| `npm run lint:staged:eslint:fix`    | Corrige solo ESLint en archivos staged            |
| `npm run lint:staged:stylelint:fix` | Corrige solo Stylelint en archivos staged         |

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura limpia (Clean Architecture) con la siguiente estructura:

```
src/app/
├── presentation/      # Capa de presentación (componentes, páginas, pipes, directivas)
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Páginas de la aplicación
│   ├── pipes/        # Pipes personalizadas
│   └── directives/   # Directivas personalizadas
├── domain/           # Capa de dominio (lógica de negocio)
│   ├── use-cases/    # Casos de uso
│   ├── guards/       # Guards de navegación
│   └── interceptors/ # Interceptores HTTP
├── data/             # Capa de datos (acceso a datos)
│   ├── repositories/ # Implementación de repositorios
│   ├── mappers/      # Mapeadores DTO ↔ Modelos
│   ├── dtos/         # Data Transfer Objects
│   └── swagger/      # Servicios generados desde Swagger
├── entities/         # Entidades del dominio
│   ├── models/       # Modelos de dominio
│   ├── interfaces/   # Interfaces TypeScript
│   ├── enums/        # Enumeraciones
│   └── types/        # Tipos personalizados
└── di/               # Dependency Injection (providers, tokens)
```

### Path Aliases

El proyecto utiliza path aliases para imports más limpios:

```typescript
// Presentation
import { MyComponent } from '@/components/my-component';
import { MyPage } from '@/pages/my-page';

// Entities
import { User } from '@/models/user';
import { UserInterface } from '@/interfaces/user';
import { UserRole } from '@/enums/user-role';

// Domain
import { AuthGuard } from '@/guards/auth.guard';
import { LoginUseCase } from '@/use-cases/login';

// Data
import { UserRepository } from '@/repositories/user.repository';
import { UserMapper } from '@/mappers/user.mapper';
```

## 🛠️ Herramientas CLI

### Ejecutar comandos Angular

```bash
npm run ng -- [comando] [opciones]
```

Ejemplo:

```bash
npm run ng -- generate component shared/button
npm run ng -- serve --port 4300
```

### Instalar desde Preview/Staging

```bash
npm run install:preview
```

## 📚 Documentación y Recursos

### Documentación FWKA

Aprende los fundamentos y explora temas avanzados en el [sitio web del Framework](https://angular.srv.mercadona.com/).

### Tecnologías Principales

- **Angular**: v18.2.13
- **TypeScript**: v5.5.4
- **RxJS**: v7.8.1
- **Karma + Jasmine**: Testing
- **ESLint + Prettier + Stylelint**: Code Quality
- **Husky**: Git Hooks
- **Compodoc**: Documentación

### Configuración de Swagger

Para generar servicios desde una API Swagger/OpenAPI:

1. Configura el archivo `swagger/config.json` con la ruta a tu definición
2. Ejecuta `npm run add:swagger`
3. Los servicios se generarán en `src/app/data/swagger/`

## 🐛 Troubleshooting

### Error: Wrong Node/npm version

```bash
# Usa la versión correcta con nvm
nvm use 22.9.0

# Verifica la versión
npm run check:versions
```

### Error: Tests no se ejecutan

```bash
# Verifica la salud del proyecto
npm run health

# Reinstala dependencias
npm run clean:all
npm install
```

### Error: Husky hooks no funcionan

```bash
# Reinstala los hooks
npm run postinstall
```

### Error: Build falla

```bash
# Limpia y reconstruye
npm run clean
npm run build
```

## 📝 Flujo de Trabajo Recomendado

1. **Antes de empezar a trabajar**:

   ```bash
   npm run health
   npm run check:outdated
   ```

2. **Durante el desarrollo**:

   ```bash
   npm start  # Servidor de desarrollo
   npm test   # Tests en modo watch
   ```

3. **Antes de hacer commit**:

   ```bash
   npm run lint:staged:fix
   npm run test:local
   ```

   (Estos comandos se ejecutan automáticamente con Husky)

4. **Antes de hacer push**:

   ```bash
   npm run check:all
   ```

## 🆘 Soporte y Contacto

### Equipo FWK Angular

#### Responsable

- **Eduard Sanz Peris**
  - Email: [esanzpe@mercadona.com](mailto:esanzpe@mercadona.com)

#### Técnicos del Framework

- **David Poveda Bartolomé** - [dapoveda@mercadona.es](mailto:dapoveda@mercadona.es)
- **Anabel Chacón Fernández** - [achacofe@mercadona.es](mailto:achacofe@mercadona.es)
- **Mireia Malonda Mayor** - [mmalonda@mercadona.es](mailto:mmalonda@mercadona.es)
- **Fran Montalt Leon** - [fmontalt@mercadona.es](mailto:fmontalt@mercadona.es)
- **Rubén Sanz Rosa** - [rusanz@mercadona.es](mailto:rusanz@mercadona.es)

### 📞 Teléfono de Guardias

**96 388 8046** (Ext. 8046)

Disponible para incidencias urgentes y soporte crítico.

### 💬 Canal de Teams

Únete al canal oficial del Framework Angular para:

- 📢 Novedades y actualizaciones
- 💡 Consultas y dudas
- 🤝 Colaboración con el equipo
- 🐛 Reporte de issues

[**Únete al canal de Teams**](https://teams.microsoft.com/l/channel/19%3AkLJYvl_qZ0F3dOhpkLdzTkm2OosFkbU0pv2npykP65E1%40thread.tacv2/General?groupId=5e87a91e-f26e-4478-9b07-72246537117c&tenantId=8f04bc3b-3841-4627-b64c-594c3c7ddaac)

### 🎓 Formación y Recursos

- **[Documentación FWKA](https://angular.srv.mercadona.com/)** - Documentación completa del framework
- **[MUS Angular](https://mus-angular.mercadona.com/)** - Design System
- **[Demos de Componentes](https://componentes-angular.srv.mercadona.com/)** - Ejemplos interactivos
- **[Service Desk](https://mercadona.service-now.com/)** - Crear tickets de soporte

### 🐛 Reportar Issues

Para reportar bugs o solicitar nuevas funcionalidades:

1. **Canal de Teams** - Para consultas rápidas y discusión
2. **Service Desk** - Para tickets formales y seguimiento
3. **Email al equipo** - Para consultas específicas

### 📬 Service Desk

Para crear un ticket de soporte:

1. Accede a [Service Desk](https://mercadona.service-now.com/)
2. Categoría: **Desarrollo > Framework Angular**
3. Incluye:
   - Versión del Framework (v3.18.0)
   - Descripción detallada del problema
   - Pasos para reproducir
   - Logs de error (si aplica)
   - Capturas de pantalla (si aplica)

## 📄 Licencia

Código propietario de Mercadona. Todos los derechos reservados.
