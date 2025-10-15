# Sistema de Gestión de Biblioteca

Este proyecto es una aplicación de frontend desarrollada en Angular para la gestión de una biblioteca. Permite administrar autores, libros, usuarios y préstamos de manera eficiente.

El sistema está construido sobre la plantilla Datta Able, utilizando Angular 18 y Bootstrap 5 para una interfaz de usuario moderna y receptiva.

## Funcionalidades Principales

*   Gestión de Autores (CRUD)
*   Gestión de Libros (CRUD)
*   Gestión de Usuarios (CRUD)
*   Gestión de Préstamos (CRUD)
*   Interfaz de administración para visualizar y operar los datos.

## Stack Tecnológico

*   **Angular:** v19.0.5
*   **Bootstrap:** v5.3.3
*   **ApexCharts:** Para visualización de datos.
*   **SweetAlert2:** Para notificaciones y alertas.
*   **ng-bootstrap:** Componentes de Bootstrap para Angular.

## Guía de Inicio

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
*   [Node.js](https://nodejs.org/) (que incluye npm)
*   [Yarn](https://yarnpkg.com/) (Opcional, pero recomendado ya que el proyecto incluye un `yarn.lock`)

### Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone <URL-DEL-REPOSITORIO>
    cd <NOMBRE-DEL-DIRECTORIO>
    ```

2.  **Instala las dependencias:**
    Puedes usar Yarn o npm.

    Usando Yarn (recomendado):
    ```sh
    yarn
    ```

    Usando npm:
    ```sh
    npm install
    ```

### Ejecución

1.  **Servidor de Desarrollo:**
    Para iniciar el servidor de desarrollo, ejecuta:
    ```sh
    yarn start
    ```
    o
    ```sh
    npm start
    ```
    Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos de origen.

2.  **Compilación (Build):**
    Para compilar el proyecto para producción, ejecuta:
    ```sh
    yarn build
    ```
    o
    ```sh
    npm run build
    ```
    Los artefactos de la compilación se almacenarán en el directorio `dist/`.

### Otras Operaciones Útiles

*   **Ejecutar Pruebas Unitarias:**
    ```sh
    yarn test
    ```
    o
    ```sh
    npm test
    ```

*   **Linter:**
    Para revisar la calidad del código, ejecuta:
    ```sh
    ng lint
    ```