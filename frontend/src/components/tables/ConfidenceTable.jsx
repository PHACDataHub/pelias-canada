import { useTranslation } from "react-i18next"
import { GcdsButton, GcdsHeading, GcdsSelect } from "@cdssnc/gcds-components-react"
import React, { useState, useEffect } from "react"

// Accept data as a prop
export default function ConfidenceTable({ data }) {
    const { t } = useTranslation()

    const style1 = { background: "#fff", borderRight: "1px solid #fff" }
    const style2 = { background: "#f1f2f3", borderRight: "1px solid #f1f2f3" }

    const totalItems = data.length

    // Helper function to check for missing or malformed confidence data
    const checkConfidenceData = (item) => {
        if (!item.apiData.features || !item.apiData.features[0]?.properties?.confidence) {
            console.warn("Missing or malformed confidence data:", item);
            return false;
        }
        return true;
    }

    // Filter counts with added validation for each item
    const count_100 = data.filter(item => checkConfidenceData(item) && item.apiData.features[0]?.properties?.confidence * 100 === 100).length
    const count_80_to_99 = data.filter(item => checkConfidenceData(item) && item.apiData.features[0]?.properties?.confidence * 100 >= 80 && item.apiData.features[0]?.properties?.confidence * 100 < 100).length
    const count_50_to_80 = data.filter(item => checkConfidenceData(item) && item.apiData.features[0]?.properties?.confidence * 100 >= 50 && item.apiData.features[0]?.properties?.confidence * 100 < 80).length
    const count_30_to_50 = data.filter(item => checkConfidenceData(item) && item.apiData.features[0]?.properties?.confidence * 100 >= 30 && item.apiData.features[0]?.properties?.confidence * 100 < 50).length
    const count_0_to_30 = data.filter(item => checkConfidenceData(item) && item.apiData.features[0]?.properties?.confidence * 100 >= 0 && item.apiData.features[0]?.properties?.confidence * 100 < 30).length

    // Log a warning if all counts are zero
    useEffect(() => {
        if ([count_100, count_80_to_99, count_50_to_80, count_30_to_50, count_0_to_30].every(count => count === 0)) {
            console.warn("No data in any confidence range.");
        }
    }, [count_100, count_80_to_99, count_50_to_80, count_30_to_50, count_0_to_30])

    return (
        <>
            <table border="1">
                <caption>Confidence levels for the {totalItems} items</caption>
                <thead>
                    <tr>
                        <th> {t("components.forwardBulk.mapReady.tableRange")}</th>
                        <th> {t("components.forwardBulk.mapReady.tableCount")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>100%</td>
                        <td>{count_100 || 0}</td>
                    </tr>
                    <tr>
                        <td>80% - 99%</td>
                        <td>{count_80_to_99 || 0}</td>
                    </tr>
                    <tr>
                        <td>50% - 80%</td>
                        <td>{count_50_to_80 || 0}</td>
                    </tr>
                    <tr>
                        <td>30% - 50%</td>
                        <td>{count_30_to_50 || 0}</td>
                    </tr>
                    <tr>
                        <td>0% - 30%</td>
                        <td>{count_0_to_30 || 0}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}
