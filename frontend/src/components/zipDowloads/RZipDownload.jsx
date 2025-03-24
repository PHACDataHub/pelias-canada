import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GcdsButton } from "@cdssnc/gcds-components-react";
import { useTranslation } from "react-i18next";

export default function RZipDownload() {
  const { t } = useTranslation();
  const handleDownload = async () => {
    const zip = new JSZip();

    // Add Python files to the zip
    const response1 = await fetch("/codeZips/R/forwardGeocode_R_script_v1.r");
    const file1 = await response1.text();
    zip.file("forwardGeocode_R_script_v1.r", file1);

    const response2 = await fetch("/codeZips/R/reverseGeocode_R_script_v1.r");
    const file2 = await response2.text();
    zip.file("reverseGeocode_R_script_v1.r", file2);

    const response3 = await fetch("/codeZips/DemoDataFowardBulk.csv");
    const file3 = await response3.text();
    zip.file("DemoDataFowardBulk.csv", file3);

    const response4 = await fetch("/codeZips/DemoDataReverseBulk.csv");
    const file4 = await response4.text();
    zip.file("DemoDataReverseBulk.csv", file4);

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Save the zip file
    saveAs(content, "r_peliasGeocoder_files.zip");
  };

  return (
    <div>
      <GcdsButton size="small" onClick={handleDownload}>
        {t("components.CodeZips.rDownload")}
      </GcdsButton>
    </div>
  );
}
