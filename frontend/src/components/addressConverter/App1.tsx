import React, { useRef, useState, useEffect } from "react"

import { ParseWorker } from "./serviceWorker"
import { ParseEvent } from "./worker"

import "./xlsx-style.css"

function DeferredRender({ children, idleTimeout }: { children: JSX.Element; idleTimeout: number }) {
	const [render, setRender] = React.useState(false)

	React.useEffect(() => {
		if (render) setRender(false)
		const id = requestIdleCallback(() => setRender(true), {
			timeout: idleTimeout,
		})

		return () => cancelIdleCallback(id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idleTimeout])

	if (!render) return <p>Loading ...</p>

	return children
}

function App1({ parseWorker }: { parseWorker: ParseWorker }) {
	const inFile = useRef<HTMLInputElement | null>(null)
	const [filename, setFilename] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [previousFilename, setPreviousFilename] = useState("")
	const [isDragging, setIsDragging] = useState(false)
	const [parserStatus, setParserStatus] = useState<ParseEvent | undefined>()

	const handleMessages = (msg: any) => {
		if (typeof msg.data === "object" && msg.data.type === "ParseEvent") {
			setParserStatus(msg.data)
		}
	}
	useEffect(() => {
		parseWorker.addEventListener("message", handleMessages)

		return () => {
			parseWorker.removeEventListener("message", handleMessages)
		}
	}, [parseWorker])

	const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsDragging(false)
		if (e.dataTransfer.items) {
			const file = e.dataTransfer.items[0].getAsFile()
			if (file) {
				setFile(file)
				setFilename(file.name)
			}
		}
	}

	const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParserStatus(undefined)
		if (e.target.files && e.target.files.length === 1) {
			setFile(e.target.files[0])
			setFilename(e.target.files[0].name)
		} else {
			setFile(null)
			setFilename("")
		}
	}

	const p = (parserStatus && parserStatus.state === "DONE" && parserStatus.workbook.Props) || undefined

	return (
		<div className="">
			<header>
				<p className="title">TITLE GOES HERE </p>
			</header>
			<main>
				<form className="upload-form" onDrop={handleDrop} encType="multipart/form-data">
					<label htmlFor="writeUpFile"></label>
					<div className="custom-input">
						<input type="file" ref={inFile} onChange={onFileChanged} accept=".xlsx, .xls, .xlsb, .ods" style={{ display: "none" }} />
						<input
							onClick={() => {
								inFile && inFile.current && inFile.current.click()
							}}
							readOnly
							value={filename}
							id="label-file-upload"
							style={{ width: "100%", height: "100px", textAlign: "center" }}
							className="textAreaMultiline"
							placeholder="Drag and drop your file here or click to upload a file"
						/>
					</div>
				</form>
				<br />
				<br />
				<button
					disabled={file === null || (parserStatus && parserStatus.state === "LOADING")}
					onClick={() => {
						file && parseWorker.parse(file)
						setPreviousFilename(filename)
						setFilename("")
					}}
				>
					Analyze
				</button>
				<br />
				<br />
				{parserStatus && parserStatus.state === "LOADING" && <p>Loading...</p>}
				{parserStatus && parserStatus.state === "DONE" && p && (
					<>
						<h4> Preview : {previousFilename}</h4>
						<div style={{ maxHeight: "300px", overflow: "auto" }}>
							<DeferredRender idleTimeout={1000}>
								<pre className="docPreview">{JSON.stringify(parserStatus.sheets, null, 2)}</pre>
							</DeferredRender>
						</div>

						<button
							onClick={() => {
								alert(" Here")
							}}
						>
							{" "}
							Export
						</button>
					</>
				)}
			</main>
		</div>
	)
}

export default App1
