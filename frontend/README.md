# Frontend

## File Structure

### /src

- **main.jsx**: Entry point of the application.
- **App.jsx**: Manages the routing for the application.
- **Layout**: Contains the headers, top navigation, breadcrumbs, main content (Outlet), and footer.
- **/pages**: Contains the different pages of the application.
- **/components**: Contains reusable component groups.

### /public

- **public**: Contains the CSV file for the FAQ.

## Running the Application Locally

To run the application in a development environment:

```sh
cd frontend/
npm install
npm run dev
```

## Running the Local Server
To run the local server using Deno:

```sh
cd frontend/
npm install
deno run --allow-net server.ts
```
## Building the Docker Image
To build the Docker image for the frontend:

```sh
cd frontend/
npm install
docker build . -t frontend
```