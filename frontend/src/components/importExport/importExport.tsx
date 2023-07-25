import React, { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import "../addressConverter/xlsx-style.css";

interface XLSXConverterProps {
  onSheetJSONResult: (sheetName: string, json: any[]) => void;
  sheetData: SheetData[];
  setSheetData: React.Dispatch<React.SetStateAction<SheetData[]>>;
}

const XLSXConverter: React.FC<XLSXConverterProps> = ({
  onSheetJSONResult,
  sheetData,
  setSheetData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const inFile = useRef<HTMLInputElement | null>(null);
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previousFilename, setPreviousFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [jsonData, setJsonData] = useState<any[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.items) {
      const file = e.dataTransfer.items[0].getAsFile();
      if (file) {
        setFile(file);
        setFilename(file.name);
      }
    }
  };

  const handleFileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Handle form submission here
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data instanceof ArrayBuffer) {
          const workbook = XLSX.read(data, { type: "array" });
          const allData: any[] = [];
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const csvData = XLSX.utils.sheet_to_csv(worksheet);
            const jsonData = Papa.parse(csvData, { header: true }).data;
            allData.push(...jsonData);
            // Update the sheet data in the parent component
            onSheetJSONResult(sheetName, jsonData);
          });
          setJsonData(allData);
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleExportJSON = () => {
    const jsonToExport = JSON.stringify(sheetData, null, 2);
    const blob = new Blob([jsonToExport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_exported.json`;
    a.click();
  };

  const handleExportCSV = () => {
    // Flatten jsonData arrays for all sheets into a single array
    const allData: any[] = [];
    sheetData.forEach(({ jsonData }) => allData.push(...jsonData));

    const csvToExport = Papa.unparse(allData, { header: true });
    const blob = new Blob([csvToExport], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_exported.csv`;
    a.click();
  };

  return (
    <>
      <div>
        {/* Use handleFileSubmit as the onSubmit handler */}
        <form
          className={`upload-form ${isDragging ? "dragging" : ""}`}
          onSubmit={handleFileSubmit}
          onDrop={handleDrop}
          encType="multipart/form-data"
        >
          <label htmlFor="writeUpFile"></label>
          <div
            className="custom-input"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              ref={inFile}
              accept=".xlsx, .xls, .xlsb, .ods"
              style={{ display: "none" }}
              onChange={(event) => {
                const file = event.target.files && event.target.files[0];
                if (file) {
                  setFile(file);
                  setFilename(file.name);
                }
              }}
            />
            <input
              onClick={() => {
                inFile.current && inFile.current.click();
              }}
              readOnly
              value={filename}
              id="label-file-upload"
              style={{
                width: "100%",
                height: "100px",
                textAlign: "center",
              }}
              className="textAreaMultiline"
              placeholder="Drag and drop your file here or click to upload a file"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <br />
        {isLoading && <div>Loading...</div>}
      </div>
      {previousFilename === "" ? null : <p>Preview of : {previousFilename}</p>}

      {sheetData.length > 0 && (
        <>
          <button onClick={handleExportJSON}>Export JSON</button>
          <button onClick={handleExportCSV}>Export CSV</button>
          {/* Display parsed data when available */}
          {sheetData.map(({ sheetName, jsonData }) => (
            <div key={sheetName}>
              <h3>{sheetName}</h3>
              <pre className="docPreview">{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          ))}
        </>
      )}
    </>
  );
};

interface SheetData {
  sheetName: string;
  jsonData: any[];
}

export default function PutItAllTogether() {
  const [sheetData, setSheetData] = useState<SheetData[]>([]);

  const handleSheetJSONResult = (sheetName: string, jsonData: any[]) => {
    // Update the sheetData state only if sheetName is not empty (i.e., not a reset)
    if (sheetName !== "") {
      setSheetData((prevSheetData) => [...prevSheetData, { sheetName, jsonData }]);
    } else {
      // Reset the sheetData state if sheetName is empty (i.e., reset)
      setSheetData([]);
    }
  }

  return (
    <>
      <XLSXConverter
        onSheetJSONResult={handleSheetJSONResult}
        sheetData={sheetData}
        setSheetData={setSheetData}
      />
    </>
  );
}
