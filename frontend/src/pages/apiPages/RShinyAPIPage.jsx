import { useState, useEffect } from "react";
import {
  GcdsButton,
  GcdsDetails,
  GcdsHeading,
} from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css"; // Import the CSS file if necessary
import { copyToClipboard } from "../../assets/copyToClipboard.jsx"; // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import RZipDownload from "../../components/zipDowloads/RZipDownload.jsx";

export default function RShinyAPIPage() {
  const [rForwardCode, setRForwardCode] = useState("");
  const [rReverseCode, setRReverseCode] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          "/codeZips/R/forwardGeocode_R_script_v1.r",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        setRForwardCode(text);
      } catch (error) {
        console.error("Failed to fetch R script:", error);
      }
    };

    fetchRScript();
  }, []);

  useEffect(() => {
    const fetchRScript = async () => {
      try {
        const response = await fetch(
          "/codeZips/R/reverseGeocode_R_script_v1.r",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        setRReverseCode(text);
      } catch (error) {
        console.error("Failed to fetch R script:", error);
      }
    };

    fetchRScript();
  }, []);

  const handleCopyRForward = () => {
    copyToClipboard(rForwardCode, () => {
      toast.success(t("codeCopied"), {
        "aria-live": "assertive", // Ensure it's announced by screen readers
      });
    });
  };

  const handleCopyRReverse = () => {
    copyToClipboard(rReverseCode, () => {
      toast.success(t("codeCopied"), {
        "aria-live": "assertive", // Ensure it's announced by screen readers
      });
    });
  };

  const codeBlockStyles = {
    marginTop: "20px",
    overflowWrap: "break-word",
    overflowX: "auto",
  };

  return (
    <>
      <GcdsHeading tag="h1">{t("pages.rshiny.title")}</GcdsHeading>
      <div style={{ overflow: "auto" }}>
        <p>{t("pages.rshiny.rshinyParagraph")}</p>
      </div>
      <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <RZipDownload />
        <br />

        <GcdsDetails detailsTitle={t("pages.rshiny.forwardRDetails")}>
          <div>
            <GcdsButton
              size="small"
              onClick={handleCopyRForward}
              aria-label={t("pages.rshiny.CopyForwardRCode")}
            >
              {t("copyCode")}
            </GcdsButton>
          </div>
          <div>
            <pre style={codeBlockStyles}>
              <code
                style={codeBlockStyles}
                aria-label={t("pages.rshiny.forwardRCode")}
              >
                {rForwardCode}
              </code>
            </pre>
          </div>
        </GcdsDetails>
        <br />
        <GcdsDetails detailsTitle={t("pages.rshiny.reverseRDetails")}>
          <div>
            <GcdsButton
              size="small"
              onClick={handleCopyRReverse}
              aria-label={t("pages.rshiny.CopyReverseRCode")}
            >
              {t("copyCode")}
            </GcdsButton>
          </div>
          <pre style={codeBlockStyles}>
            <code
              style={codeBlockStyles}
              aria-label={t("pages.rshiny.reverseRCode")}
            >
              {rReverseCode}
            </code>
          </pre>
        </GcdsDetails>

        {/* 

				<div style={commonStyles}>
					<h2
						id="reverseRCodeHeader"
						onClick={() => setIsReverseOpen(!isReverseOpen)}
						onKeyDown={event => handleKeyDown(event, setIsReverseOpen)}
						style={{ cursor: "pointer" }}
						aria-expanded={isReverseOpen}
						aria-controls="reverseRCodeContent"
						tabIndex="0"
					>
						{t("pages.rshiny.reverseRCode")}
					</h2>
					{isReverseOpen && (
						<div id="reverseRCodeContent" tabIndex="0">
							<div style={{ position: "absolute", top: "10px", right: "10px" }}>
								<GcdsButton size="small" onClick={handleCopyRReverse} aria-label="Copy Reverse Geocoding R code to clipboard">
									{t("copyCode")}
								</GcdsButton>
							</div>
							<pre style={codeBlockStyles}>
								<code style={codeBlockStyles} aria-label="Reverse Geocoding R Code">
									{rReverseCode}
								</code>
							</pre>
						</div>
					)}
				</div> */}
      </div>
      <ToastContainer />
    </>
  );
}
