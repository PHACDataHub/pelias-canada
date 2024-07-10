# File Processor Component Documentation

The `FileProcessorComponent` is a React component designed to process JSON data containing physical addresses, perform geocoding via an API, and export the results to Excel and CSV formats. This document provides an overview of its structure, functionalities, and usage.


### TL;DR Summary
The FileProcessorComponent in React processes JSON data containing physical addresses, performs geocoding via an API, and supports exporting results to Excel and CSV formats. Key features include:

- State Management: Uses hooks like useState and useEffect to manage data processing, API interaction, and export functionalities.

- Data Processing: Cleans and formats JSON data, extracting physical addresses while handling special characters.

- API Interaction: Initiates API calls for each address, with retry mechanisms for reliability. Tracks progress and stores responses and errors.

- Exporting Data: Offers export to Excel and CSV formats, ensuring structured output with headers and formatted data rows.

- Component Rendering: Displays progress bar during API calls, allows setting export titles, and shows counts of confidence levels and addresses below 50% confidence.

- Usage: Requires jsonData prop as an array of objects. Provides PropTypes validation for robust integration.

- Conclusion: The component simplifies the handling of address data, facilitating geocoding and exporting results with flexibility and reliability.


## Table of Contents
- [Overview](#overview)
- [State Management](#state-management)
- [Data Processing](#data-processing)
- [API Interaction](#api-interaction)
- [Exporting Data](#exporting-data)
- [Component Rendering](#component-rendering)
- [Usage and Integration](#usage-and-integration)

## Overview

The component utilizes React hooks such as `useState`, `useEffect`, and `useCallback` for state management and handling asynchronous operations. It integrates with the `ExcelJS` library for Excel file operations and implements PropTypes for validation of incoming JSON data.

## State Management

The component utilizes several states to manage its operations:
- `processedData`: Stores processed JSON data with cleaned and formatted addresses.
- `physicalAddressArray`: Holds an array of physical addresses extracted from the JSON data.
- `apiResponses`: Accumulates responses from API calls for each address.
- `isProcessing`: Boolean flag indicating whether API calls are in progress.
- `progress`: Tracks the percentage progress of API calls.
- `results`: Stores final results from API calls, including addresses and corresponding data.
- `returnedCount`: Counts the number of API responses returned.
- `exportTitle`: State to manage the title for exported files (Excel and CSV).

## Data Processing

### Special Characters Handling
A helper function `replaceSpecialCharacters` replaces special characters in the "Physical Address" column of JSON data, excluding hyphens.

### Processing JSON Data
The `processJsonData` function cleans and formats the JSON data, extracting and sorting headers while cleaning addresses.

## API Interaction

### Sending Addresses to API
- The component initiates API calls (`sendAddressesToApi`) for each physical address extracted from JSON.
- It utilizes a retry mechanism (`fetchWithRetry`) to handle failed API requests with exponential backoff.

### Handling API Responses
- Successful responses are stored in `apiResponses` and `results`.
- Progress of API calls is tracked via `progress` state.
- Errors are logged for failed API calls.

## Exporting Data

### Export to Excel (`exportToExcel`)
- Uses `ExcelJS` to generate an Excel workbook with results.
- Handles missing or incomplete data gracefully.

### Export to CSV (`exportToCSV`)
- Constructs CSV content from `results` and initiates download.
- Ensures CSV headers and data rows are properly formatted.

## Component Rendering

The component renders:
- Progress bar during API calls (`isProcessing` state).
- Input field for setting export title.
- Buttons for exporting to Excel and CSV formats.
- Counts and displays of confidence levels from API results.
- Lists addresses with confidence levels below 50%.

## Usage and Integration

- **Props**: Requires `jsonData` prop, an array of objects containing data to process.
- **Lifecycle**: Processes data on component mount or when `jsonData` changes.
- **Exports**: Default export of `FileProcessorComponent` with PropTypes validation for `jsonData`.

### Example Usage
```jsx
import { FileProcessorComponent } from './FileProcessorComponent';

function App() {
  const jsonData = [...] // Your JSON data array

  return (
    <div className="App">
      <FileProcessorComponent jsonData={jsonData} />
    </div>
  );
}
```

## PropTypes Validation
Ensures jsonData is an array and is mandatory for the component to function correctly.


```jsx

FileProcessorComponent.propTypes = {
  jsonData: PropTypes.array.isRequired,
};

``` 
## Conclusion
The FileProcessorComponent offers a comprehensive solution for processing JSON data, conducting geocoding via API calls, and exporting results in Excel and CSV formats. It leverages React's functional components and hooks to manage state, handle asynchronous operations, and provide a user-friendly interface for data processing and export functionalities.


