import { useTranslation } from "react-i18next"
import { GcdsButton, GcdsHeading, GcdsSelect } from "@cdssnc/gcds-components-react"
import React, { useState, useEffect } from "react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

export default function PaginatedTable({ apiResults }) {
	const { t, i18n } = useTranslation()
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [currentPage, setCurrentPage] = useState(1)

	const getPageNumbersToDisplay = (totalPages, currentPage) => {
		const maxVisiblePages = 5
		const pages = []

		pages.push(1)

		if (currentPage > Math.floor(maxVisiblePages / 2) + 2) {
			pages.push("...")
		}

		const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
		const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2))

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1) {
			pages.push("...")
		}

		if (totalPages > 1) {
			pages.push(totalPages)
		}

		return pages
	}

	const style1 = { background: "#fff", borderRight: "1px solid #fff" }
	const style2 = { background: "#f1f2f3", borderRight: "1px solid #f1f2f3" }

	const totalItems = apiResults.length
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const handlePageChange = page => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(1)
		}
	}, [totalPages, currentPage])

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
	const paginatedData = apiResults.slice(startIndex, startIndex + itemsPerPage)

	return (
		<>
			<GcdsSelect
				selectId="itemsPerPage"
				label="Items per Page"
				name="select"
				hint="Select the number of items per page"
				onGcdsChange={e => {
					const newItemsPerPage = Number(e.target.value)
					setItemsPerPage(newItemsPerPage)
					setCurrentPage(1) // Reset to page 1 when items per page change
				}}
				lang={i18n.language}
			>
				<option value="10">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="3">Testing</option>
				<option value="1">Testing 2</option>
			</GcdsSelect>

			<table>
				<caption>
					Displaying Items {startIndex + 1} - {endIndex} of {totalItems}
				</caption>
				<thead>
					<tr>
						<th>{t("components.forwardBulk.mapReady.outputTable.inputID")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.address")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.lat")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.lon")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.confidenceLevel")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.matchType")}</th>
						<th>{t("components.forwardBulk.mapReady.outputTable.accuracy")}</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((result, index) => (
						<tr key={index} style={{ background: "grey", border: "1px solid grey" }}>
							<td style={index % 2 === 0 ? style1 : style2}>{startIndex + index + 1 || "N/A"}</td>
							<td style={index % 2 === 0 ? style1 : style2} id="address">
								{result.apiData.geocoding.query.text || "N/A"}
							</td>
							<td style={index % 2 === 0 ? style1 : style2}>
								{result.apiData.features && result.apiData.features[0]?.geometry?.coordinates ? result.apiData.features[0].geometry.coordinates[1] : "N/A"}
							</td>
							<td style={index % 2 === 0 ? style1 : style2}>
								{result.apiData.features && result.apiData.features[0]?.geometry?.coordinates ? result.apiData.features[0].geometry.coordinates[0] : "N/A"}
							</td>
							<td style={index % 2 === 0 ? style1 : style2}>
								{result.apiData.features && result.apiData.features[0]?.properties?.confidence !== undefined ? `${result.apiData.features[0].properties.confidence * 100}%` : "N/A"}
							</td>
							<td style={index % 2 === 0 ? style1 : style2}>{(result.apiData.features && result.apiData.features[0]?.properties?.match_type) || "N/A"}</td>
							<td style={index % 2 === 0 ? style1 : style2}>{(result.apiData.features && result.apiData.features[0]?.properties?.accuracy) || "N/A"}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							paddingTop: "16px",
							width: "full",
							flexWrap: "wrap",
						}}
					>
						{getPageNumbersToDisplay(totalPages, currentPage).map((page, index) => (
							<React.Fragment key={index}>
								{page === "..." ? (
									<span style={{ margin: "0 8px" }}>...</span>
								) : (
									<GcdsButton
										size="small"
										buttonRole={currentPage === page ? "primary" : "secondary"}
										onClick={() => handlePageChange(page)}
										aria-label={currentPage === page ? currentPage : page}
										disabled={currentPage === page}
									>
										{page}
									</GcdsButton>
								)}
							</React.Fragment>
						))}
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							padding: "16px",
							width: "full",
							flexWrap: "wrap",
						}}
					>
						{currentPage > 1 && (
							<GcdsButton size="small" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous Page">
								<FaAngleLeft /> Previous
							</GcdsButton>
						)}

						{currentPage < totalPages && (
							<GcdsButton size="small" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next Page">
								Next <FaAngleRight />
							</GcdsButton>
						)}
					</div>
				</div>
			)}

			{/* Announce the page number change */}
			<div aria-live="polite" style={{ position: "absolute", top: "-9999px" }}>
				Page {currentPage} of {totalPages}
			</div>
		</>
	)
}
