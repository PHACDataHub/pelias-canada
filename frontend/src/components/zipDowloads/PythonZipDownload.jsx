import JSZip from "jszip"
import { saveAs } from "file-saver"
import { GcdsButton } from "@cdssnc/gcds-components-react"
import { useTranslation } from "react-i18next"

export default function PythonZipDownload() {
	const { t } = useTranslation()
	const handleDownload = async () => {
		const zip = new JSZip()

		// Add Python files to the zip
		const response1 = await fetch("/codeZips/python/batch_reverseGeocoder_Pelias_v4.py")
		const file1 = await response1.text()
		zip.file("batch_reverseGeocoder_Pelias_v4.py", file1)

		const response2 = await fetch("/codeZips/python/batch_forwardGeocoder_Pelias_v4.py")
		const file2 = await response2.text()
		zip.file("batch_forwardGeocoder_Pelias_v4.py", file2)

		const response3 = await fetch("/codeZips/DemoDataFowardBulk.csv")
		const file3 = await response3.text()
		zip.file("DemoDataFowardBulk.csv", file3)

		const response4 = await fetch("/codeZips/DemoDataReverseBulk.csv")
		const file4 = await response4.text()
		zip.file("DemoDataReverseBulk.csv", file4)

		// Generate the zip file
		const content = await zip.generateAsync({ type: "blob" })

		// Save the zip file
		saveAs(content, "python_peliasGeocoder_files.zip")
	}

	return (
		<GcdsButton size="small" onClick={handleDownload}>
			{t("components.CodeZips.pythonDownload")}
		</GcdsButton>
	)
}
