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
				selectId={t("components.tablePageation.itemsID")}
				label={t("components.tablePageation.itemsPerPage")}
				name={t("components.tablePageation.itemsID")}
				hint={t("components.tablePageation.hint")}
				onGcdsChange={e => {
					const newItemsPerPage = Number(e.target.value)
					setItemsPerPage(newItemsPerPage)
					setCurrentPage(1)
				}}
				lang={i18n.language}
			>
				<option value="10">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="3">3</option>
			</GcdsSelect>

			<table>
				<caption>
					{i18n.language === "en"
						? `Displaying Items ${startIndex + 1} - ${endIndex} of ${totalItems}`
						: `
					Affichage des articles ${startIndex + 1} - ${endIndex} de ${totalItems} `}
				</caption>
				<thead>
					<tr>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.inputID")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.address")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.lat")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.lon")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.confidenceLevel")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.matchType")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.outputTable.accuracy")}</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((result, index) => (
						<tr key={index} style={{ background: index % 2 === 0 ? "#ffffff" : "#e0e0e0" }}>
							<td>{startIndex + index + 1 || "N/A"}</td>
							<td>{result?.result?.geocoding?.query?.text || "N/A"}</td>
							<td>{result?.result?.features?.[0]?.geometry?.coordinates?.[1] ?? "N/A"}</td>
							<td>{result?.result?.features?.[0]?.geometry?.coordinates?.[0] ?? "N/A"}</td>
							<td>{result?.result?.features?.[0]?.properties?.confidence !== undefined ? `${result.result.features[0].properties.confidence * 100}%` : "N/A"}</td>
							<td>{result?.result?.features?.[0]?.properties?.match_type || "N/A"}</td>
							<td>{result?.result?.features?.[0]?.properties?.accuracy || "N/A"}</td>
						</tr>
					))}
				</tbody>
			</table>

			{totalPages > 1 && (
				<nav aria-label="Pagination">
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
									<span aria-hidden="true">...</span>
								) : (
									<GcdsButton
										size="small"
										buttonRole={currentPage === page ? "primary" : "secondary"}
										onClick={() => handlePageChange(page)}
										aria-label={`${t("components.tablePageation.goToPage")} ${page}`}
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
							<GcdsButton size="small" onClick={() => handlePageChange(currentPage - 1)} aria-label={t("components.tablePageation.ariaPrevious")}>
								<FaAngleLeft /> {t("components.tablePageation.previous")}
							</GcdsButton>
						)}

						{currentPage < totalPages && (
							<GcdsButton size="small" onClick={() => handlePageChange(currentPage + 1)} aria-label={t("components.tablePageation.ariaNext")}>
								{t("components.tablePageation.next")} <FaAngleRight />
							</GcdsButton>
						)}
					</div>
				</nav>
			)}
			{i18n.language === "en" ? "" : ""}
			<div className="sr-only" aria-live="polite">
				Page {currentPage} of {totalPages}
				{i18n.language === "en" ? `Page ${currentPage} of ${totalPages}` : `Page ${currentPage} de ${totalPages}`}
			</div>
		</>
	)
}
