# OnlinePublishingPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.21.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Features
Google Authentication using Firebase
Article listing with pagination
Search and sorting
Featured articles
Explore articles and authors
Author profiles and author search
Article details with related articles
Comments with threaded replies
Comment sorting – Newest, Oldest, Most Liked
Rich text editor using ngx-editor
Create, edit, delete and publish articles
Save articles as drafts
My Articles section
Tags – search and filter articles by tags
Responsive UI
Web Worker for background processing for search

## Technologies

* Angular 21
* TypeScript
* HTML
* SCSS
* Angular Material
* RxJS
* Angular Signals
* Reactive Forms
* JSON Server
* Vitest

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Angular CLI
* JSON Server

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Run the Application

Start the Angular application:

```bash
ng serve/npm run start
```

The application will be available at:

```text
http://localhost:4200
```

## Run Mock API

RentHub uses JSON Server as a mock backend.

Start the server using:

```bash
npm run api: 
json-server --watch db.json --port 3001
```

The API will be available at:

```text
http://localhost:3001
```

## Run Tests

Run all unit tests:

```bash
ng test
```

Run a specific test file:

```bash
ng test --include="src/app/core/services/auth.service.spec.ts"
```

## Build

To build the application:

```bash
ng build

```
## Demo Credentials
Email: rupalipatilfe@gmail.com
Password: Test@123

The production build will be generated in the `dist/` directory.
