import { useTranslation } from "react-i18next"
import "./GeocodingExplanation.css"
import { GcdsHeading } from "@cdssnc/gcds-components-react"

export default function GeocodingExplanation() {
	const { t } = useTranslation()
	return (
		<div className="geocoding-explanation">
      <GcdsHeading tag="h1">{t("pages.geocodingExplanation.title")}</GcdsHeading>
			<section aria-labelledby="match-types">
				<h2 id="match-types">{t("pages.geocodingExplanation.underTitleHeader")}</h2>
				<p>{t("pages.geocodingExplanation.underTitlePara")}</p>
				<h3>{t("pages.geocodingExplanation.matchTypes.title")}</h3>
				<ul>
					<li>
						<strong>{t("pages.geocodingExplanation.matchTypes.exact")}</strong>:{t("pages.geocodingExplanation.matchTypes.exactPara")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.matchTypes.centroid")}</strong>:{t("pages.geocodingExplanation.matchTypes.centroidPara")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.matchTypes.interpolation")}</strong>: {t("pages.geocodingExplanation.matchTypes.interpolationPara")}
					</li>
				</ul>
			</section>

			<section aria-labelledby="improving-accuracy">
				<h2 id="improving-accuracy">{t("pages.geocodingExplanation.improvingAccuracy.title")}</h2>
				<p>{t("pages.geocodingExplanation.improvingAccuracy.underTitle")}:</p>
				<ol>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.verifyAddress.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.verifyAddress.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.spellingAbbrevs.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.spellingAbbrevs.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.details.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.details.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.splitIntoComponents.title")}:</strong>{" "}
						{t("pages.geocodingExplanation.improvingAccuracy.splitIntoComponents.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.billingualReqs.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.billingualReqs.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.standardDigraphs.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.standardDigraphs.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.specialChars.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.specialChars.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.capitilization.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.capitilization.para")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.improvingAccuracy.addressVars.title")}:</strong> {t("pages.geocodingExplanation.improvingAccuracy.addressVars.para")}
					</li>
				</ol>
			</section>

			<section aria-labelledby="less-accurate-matches">
				<h2 id="less-accurate-matches">{t("pages.geocodingExplanation.lessAccurateMatch.title")}</h2>
				<p>{t("pages.geocodingExplanation.lessAccurateMatch.underTitle")}</p>
				<ul>
					<li>
						<strong>{t("pages.geocodingExplanation.lessAccurateMatch.spatialAccuracy")}</strong>: {t("pages.geocodingExplanation.lessAccurateMatch.spatialAccuracyPara")}
					</li>
					<li>
						<strong>{t("pages.geocodingExplanation.lessAccurateMatch.limitedSpatialAccuracy")}</strong>:{" "}
						{t("pages.geocodingExplanation.lessAccurateMatch.limitedSpatialAccuracyPAra")}
					</li>
				</ul>
			</section>

			<section aria-labelledby="geocoding-results">
  <h2 id="geocoding-results">{t("pages.geocodingExplanation.understandingGeocodingResults")}</h2>
  <p>{t("pages.geocodingExplanation.understandingGeocodingResultsPara")}</p>

  <h3>{t("pages.geocodingExplanation.apiFeature.title")}</h3>
  <table id="features">
    <thead>
      <tr>
        <th>Property / Propriété</th>
        <th>Property Description / Description de la propriété</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>$.features</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.features")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].bbox</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.bbox")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].geometry.coordinates</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.geometry.coordinates")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].geometry.type</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.geometry.type")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].type</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.type")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.country</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.country")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.gid")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.locality_gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.locality_gid")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.neighbourhood_gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.neighbourhood_gid")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.confidence</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.confidence")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.country_a</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.country_a")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.county</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.county")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.locality</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.locality")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.accuracy</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.accuracy")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.source</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.source")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.label</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.label")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.region_a</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.region_a")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.layer</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.layer")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.country_code</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.country_code")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.street</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.street")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.neighbourhood</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.neighbourhood")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.region_gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.region_gid")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.name</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.name")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.match_type</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.match_type")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.id</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.id")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.source_id</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.source_id")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.country_gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.country_gid")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.region</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.region")}</td>
      </tr>
      <tr>
        <td><code>$.features[0].properties.county_gid</code></td>
        <td>{t("pages.geocodingExplanation.apiFeature.properties.county_gid")}</td>
      </tr>
    </tbody>
  </table>
</section>

		</div>
	)
}
