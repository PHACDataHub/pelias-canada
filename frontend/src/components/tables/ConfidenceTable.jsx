import { useTranslation } from "react-i18next"
import React, { useState, useEffect } from "react"
import "./Tables.css"

export default function ConfidenceTable({ apiResults }) {
	const { t } = useTranslation()

	// Helper function to check if item has valid confidence data
	const isValidConfidenceData = item => {
		return item?.result?.features?.[0]?.properties?.confidence !== undefined && item.result.features[0].properties.confidence !== null
	}

	// Sanitize and filter valid items only
	const validData = apiResults.filter(isValidConfidenceData)

	const totalItems = validData.length

	// Initialize counters for different confidence ranges
	const confidenceCounts = {
		100: 0,
		"80-99": 0,
		"50-80": 0,
		"30-50": 0,
		"0-30": 0,
	}

	// Categorize each valid item's confidence into the appropriate range
	validData.forEach(item => {
		const confidence = item.result.features[0]?.properties.confidence * 100

		if (confidence === 100) {
			confidenceCounts["100"]++
		} else if (confidence >= 80) {
			confidenceCounts["80-99"]++
		} else if (confidence >= 50) {
			confidenceCounts["50-80"]++
		} else if (confidence >= 30) {
			confidenceCounts["30-50"]++
		} else {
			confidenceCounts["0-30"]++
		}
	})

	// If no valid data, warn
	useEffect(() => {
		if (validData.length === 0) {
			console.warn("No valid confidence data found.")
		}
	}, [validData])

	return (
		<>
			<table border="1">
				<caption>{t("components.forwardBulk.mapReady.tableHeaderConfidence")}</caption>
				<thead>
					<tr>
						<th scope="col">{t("components.forwardBulk.mapReady.tableRange")}</th>
						<th scope="col">{t("components.forwardBulk.mapReady.tableCount")}</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(confidenceCounts).map(([range, count]) => (
						<tr key={range}>
							<td>{range}</td>
							<td>{count || 0}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
