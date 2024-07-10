# FileUploadComponent.js

The `FileUploadComponent.js` is a React component designed to handle Excel file uploads and convert data into JSON format.

## Overview

The `FileUploadComponent` utilizes the `ExcelJS` library to parse Excel files directly in the browser. It extracts data from the first sheet of the uploaded Excel file and converts it into JSON format.

### Features

- **File Handling**: Accepts Excel files (`xlsx`) through a file input field and processes the data within.
  
- **ExcelJS Integration**: Utilizes `ExcelJS` library to load and parse Excel files directly in the browser.
  
- **Data Extraction**: Reads data from the first sheet of the uploaded Excel file, extracting headers and rows into JSON format.
  
- **Event Handling**: Executes `onJsonDataLoaded` callback with the parsed JSON data upon successful file processing.
  
- **Component Interface**: Provides a simple user interface with a file input field for seamless file selection and upload.
  
- **Error Handling**: Minimal error handling is implemented; it assumes valid Excel files and skips empty rows and cells.

### Implementation
Integrate the FileUploadComponent into a parent React component, providing the onJsonDataLoaded callback to receive the parsed JSON data.

```javascript

import React, { useState } from 'react';
import FileUploadComponent from './FileUploadComponent';

function ParentComponent() {
  const [jsonData, setJsonData] = useState(null);

  const handleJsonDataLoaded = (data) => {
    setJsonData(data);
    // Further processing with jsonData
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <FileUploadComponent onJsonDataLoaded={handleJsonDataLoaded} />
      {/* Render jsonData or other components based on parsed data */}
    </div>
  );
}

export default ParentComponent;
```
## Conclusion
The FileUploadComponent offers a straightforward solution for uploading Excel files, parsing data, and integrating with React applications efficiently. It provides essential functionalities for handling Excel data within a web application environment.