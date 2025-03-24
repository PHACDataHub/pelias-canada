import { useTranslation } from "react-i18next";
import "./GeocodingExplanation.css";
import { GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react";

export default function GeocodingExplanation() {
  const featuresData = [
    [
      {
        key: "$.features",
        description: "pages.geocodingExplanation.apiFeature.features",
      },
      {
        key: "$.features[0].bbox",
        description: "pages.geocodingExplanation.apiFeature.bbox",
      },
      {
        key: "$.features[0].geometry.coordinates",
        description:
          "pages.geocodingExplanation.apiFeature.geometry.coordinates",
      },
      {
        key: "$.features[0].geometry.type",
        description: "pages.geocodingExplanation.apiFeature.geometry.type",
      },
      {
        key: "$.features[0].type",
        description: "pages.geocodingExplanation.apiFeature.type",
      },
      {
        key: "$.features[0].properties",
        description:
          "pages.geocodingExplanation.apiFeature.properties.properties",
      },
      {
        key: "$.features[0].properties.country",
        description: "pages.geocodingExplanation.apiFeature.properties.country",
      },
      {
        key: "$.features[0].properties.gid",
        description: "pages.geocodingExplanation.apiFeature.properties.gid",
      },
      {
        key: "$.features[0].properties.locality_gid",
        description:
          "pages.geocodingExplanation.apiFeature.properties.locality_gid",
      },
      {
        key: "$.features[0].properties.neighbourhood_gid",
        description:
          "pages.geocodingExplanation.apiFeature.properties.neighbourhood_gid",
      },
      {
        key: "$.features[0].properties.confidence",
        description:
          "pages.geocodingExplanation.apiFeature.properties.confidence",
      },
      {
        key: "$.features[0].properties.country_a",
        description:
          "pages.geocodingExplanation.apiFeature.properties.country_a",
      },
      {
        key: "$.features[0].properties.county",
        description: "pages.geocodingExplanation.apiFeature.properties.county",
      },
      {
        key: "$.features[0].properties.locality",
        description:
          "pages.geocodingExplanation.apiFeature.properties.locality",
      },
      {
        key: "$.features[0].properties.accuracy",
        description:
          "pages.geocodingExplanation.apiFeature.properties.accuracy",
      },
      {
        key: "$.features[0].properties.source",
        description: "pages.geocodingExplanation.apiFeature.properties.source",
      },
      {
        key: "$.features[0].properties.label",
        description: "pages.geocodingExplanation.apiFeature.properties.label",
      },
      {
        key: "$.features[0].properties.region_a",
        description:
          "pages.geocodingExplanation.apiFeature.properties.region_a",
      },
      {
        key: "$.features[0].properties.layer",
        description: "pages.geocodingExplanation.apiFeature.properties.layer",
      },
      {
        key: "$.features[0].properties.country_code",
        description:
          "pages.geocodingExplanation.apiFeature.properties.country_code",
      },
      {
        key: "$.features[0].properties.street",
        description: "pages.geocodingExplanation.apiFeature.properties.street",
      },
      {
        key: "$.features[0].properties.neighbourhood",
        description:
          "pages.geocodingExplanation.apiFeature.properties.neighbourhood",
      },
      {
        key: "$.features[0].properties.region_gid",
        description:
          "pages.geocodingExplanation.apiFeature.properties.region_gid",
      },
      {
        key: "$.features[0].properties.name",
        description: "pages.geocodingExplanation.apiFeature.properties.name",
      },
      {
        key: "$.features[0].properties.match_type",
        description:
          "pages.geocodingExplanation.apiFeature.properties.match_type",
      },
      {
        key: "$.features[0].properties.id",
        description: "pages.geocodingExplanation.apiFeature.properties.id",
      },
      {
        key: "$.features[0].properties.source_id",
        description:
          "pages.geocodingExplanation.apiFeature.properties.source_id",
      },
      {
        key: "$.features[0].properties.country_gid",
        description:
          "pages.geocodingExplanation.apiFeature.properties.country_gid",
      },
      {
        key: "$.features[0].properties.region",
        description: "pages.geocodingExplanation.apiFeature.properties.region",
      },
      {
        key: "$.features[0].properties.county_gid",
        description:
          "pages.geocodingExplanation.apiFeature.properties.county_gid",
      },
    ],
  ];
  const { t } = useTranslation();
  return (
    <div className="geocoding-explanation">
      <GcdsHeading tag="h1">
        {t("pages.geocodingExplanation.title")}
      </GcdsHeading>
      <section>
        <GcdsHeading tag="h2" characterLimit="false" id="match-types">
          {t("pages.geocodingExplanation.underTitleHeader")}
        </GcdsHeading>
        <GcdsText characterLimit="false">
          {" "}
          {t("pages.geocodingExplanation.underTitlePara")}
        </GcdsText>
        <GcdsHeading tag="h3" characterLimit="false">
          {t("pages.geocodingExplanation.matchTypes.title")}
        </GcdsHeading>
        <ul>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t("pages.geocodingExplanation.matchTypes.exact")}
              </strong>
              :{t("pages.geocodingExplanation.matchTypes.exactPara")}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t("pages.geocodingExplanation.matchTypes.centroid")}
              </strong>
              :{t("pages.geocodingExplanation.matchTypes.centroidPara")}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t("pages.geocodingExplanation.matchTypes.interpolation")}
              </strong>
              : {t("pages.geocodingExplanation.matchTypes.interpolationPara")}
            </GcdsText>
          </li>
        </ul>
      </section>
      <section>
        <GcdsHeading tag="h2" characterLimit="false" id="improving-accuracy">
          {t("pages.geocodingExplanation.improvingAccuracy.title")}
        </GcdsHeading>
        <GcdsText characterLimit="false">
          {t("pages.geocodingExplanation.improvingAccuracy.underTitle")}:
        </GcdsText>
        <ol>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.verifyAddress.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.verifyAddress.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.spellingAbbrevs.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.spellingAbbrevs.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.details.title",
                )}
                :
              </strong>{" "}
              {t("pages.geocodingExplanation.improvingAccuracy.details.para")}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.splitIntoComponents.title",
                )}
                :
              </strong>
              {t(
                "pages.geocodingExplanation.improvingAccuracy.splitIntoComponents.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.billingualReqs.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.billingualReqs.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.standardDigraphs.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.standardDigraphs.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.specialChars.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.specialChars.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.capitilization.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.capitilization.para",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.improvingAccuracy.addressVars.title",
                )}
                :
              </strong>{" "}
              {t(
                "pages.geocodingExplanation.improvingAccuracy.addressVars.para",
              )}
            </GcdsText>
          </li>
        </ol>
      </section>

      <section>
        <GcdsHeading tag="h2" characterLimit="false" id="less-accurate-matches">
          {t("pages.geocodingExplanation.lessAccurateMatch.title")}
        </GcdsHeading>
        <GcdsText characterLimit="false">
          {" "}
          {t("pages.geocodingExplanation.lessAccurateMatch.underTitle")}
        </GcdsText>
        <ul>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.lessAccurateMatch.spatialAccuracy",
                )}
              </strong>
              :{" "}
              {t(
                "pages.geocodingExplanation.lessAccurateMatch.spatialAccuracyPara",
              )}
            </GcdsText>
          </li>
          <li>
            <GcdsText characterLimit="false">
              <strong>
                {t(
                  "pages.geocodingExplanation.lessAccurateMatch.limitedSpatialAccuracy",
                )}
              </strong>
              :
              {t(
                "pages.geocodingExplanation.lessAccurateMatch.limitedSpatialAccuracyPAra",
              )}
            </GcdsText>
          </li>
        </ul>
      </section>

      <section>
        <GcdsHeading tag="h2" characterLimit="false">
          {t("pages.geocodingExplanation.apiFeature.title")}
        </GcdsHeading>
        <div className="table-wrapper" tabIndex="0">
          <table
            id="features"
            aria-label={t("pages.geocodingExplanation.apiFeature.tableTitle")}
          >
            <thead>
              <tr>
                <th>
                  <GcdsText characterLimit="false" textRole="light">
                    {t("pages.geocodingExplanation.property")}
                  </GcdsText>
                </th>
                <th>
                  <GcdsText textRole="light" characterLimit="false">
                    {t("pages.geocodingExplanation.description")}
                  </GcdsText>
                </th>
              </tr>
            </thead>
            <tbody>
              {featuresData[0].map((feature, index) => (
                <tr key={index + feature.key}>
                  <td>
                    <GcdsText
                      textRole="primary"
                      characterLimit="false"
                      marginBottom="0"
                    >
                      <code>{feature.key}</code>
                    </GcdsText>
                  </td>
                  <td>
                    <GcdsText
                      textRole="primary"
                      characterLimit="false"
                      marginBottom="0"
                    >
                      {t(feature.description)}
                    </GcdsText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
