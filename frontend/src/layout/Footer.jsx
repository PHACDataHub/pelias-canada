import { GcdsFooter } from "@cdssnc/gcds-components-react";
import "./TopNav.css";
import { useTranslation } from "react-i18next";

// This is a temporary component
export default function Footer() {
  const { t, i18n } = useTranslation();

  // Declare the contextualLinks object outside JSX
  const contextualLinks = {
    [t("footer.resultsExplained")]: "/geocoding-results-explanation",
    [t("footer.faq")]: "/frequently-asked-questions"
  };

  return (
    <>
      {/* <GcdsContainer size="xl" centered padding="200">
        <h4 style={{color: "white"}}>{t("footer.additionalNav")}</h4>
        <div style={{ display: "flex", w: "100%", paddingTop: "0px", gap: "5%" }} className="body">
          <NavLink to="/geocoding-results-explanation" style={{ color: "white" }}>
            {t("footer.resultsExplained")}
          </NavLink>
          <NavLink to="/frequently-asked-questions" style={{ color: "white" }}>
            {t("footer.faq")}
          </NavLink>
        </div>
      </GcdsContainer> */}

      <GcdsFooter
        lang={i18n.language}
        contextualHeading="Pelias Geocoder"
        contextualLinks={contextualLinks} // Pass the object here
      />
    </>
  );
}
