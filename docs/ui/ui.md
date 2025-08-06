# Pelias Frontend Documentation

## Overview
The Pelias UI is a web application designed to provide a centralized interface for geocoding operations powered by the Pelias engine. It brings together essential search tools, contextual information, and map visualization into a single, user-friendly platform. The UI leverages modern design principles for consistency, accessibility, and responsiveness, ensuring an optimal user experience across devices.

---

## Key Objectives
- **Unified Geocoding Access:** Centralize forward geocoding, reverse geocoding, and autocomplete functionality.
- **Contextual Clarity:** Provide clear feedback, confidence scores, and metadata alongside search results.
- **Interactive Mapping:** Enable map-based navigation, selection, and visualization of geocoded results.
- **Scalability:** Support modular components for easy integration with other Pelias services and tools.

---

## Technology Stack

### React
The Pelias UI is built with **React**, ensuring a component-driven architecture, maintainability, and real-time UI updates.

### Vite
The frontend uses **Vite** as the build tool for fast development and optimized production builds.

### Leaflet
**Leaflet.js** is used for rendering maps and visualizing search results, offering smooth performance and interactivity.

### Design System
The interface is styled using the **GC Design System** for accessibility and consistency with Canadian government design standards.
https://design-system.alpha.canada.ca/en/components/

### Pelias frontend API endpoints
The UI communicates with the Pelias backend via its REST API endpoints:
- `/v1/search?text=<address>` – Forward geocoding
- `/v1/reverse?point.lat=<lat>&point.lon=<lon>` – Reverse geocoding


---

## Key Features
- **Forward & Reverse Geocoding:** Search by address or coordinates.
- **Map Visualization:** Display search results, zoom, and pan interactively.
- **Structured Input Forms:** Separate fields for detailed address components.
- **Responsive Design:** Optimized for desktop use
- **Contextual Data:** Confidence scores and result data displayed for user clarity.

---

## Local Setup
To run the Pelias UI locally:

1. **enter Frontend Folder:**
```bash
cd frontend/
```

2. **Install dependencies:**
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```


## Docker image ##

1. **enter Frontend Folder:**
```bash
cd frontend/
```

2. **Build images:**
```bash
docker build . -t frontend
```
3. Start the development server:
```bash
docker run --rm -p 3000:3000 frontend
```

## References
- [Pelias Documentation](https://github.com/pelias/documentation)
- [GC Design System](https://design-system.digital.canada.ca/)
- [Leaflet.js](https://leafletjs.com/)
- [React](https://reactjs.org/)
- [vite](https://vite.dev/guide/)
