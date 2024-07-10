/* eslint-disable react/no-unescaped-entities */
import APIfetch from "../../components/apiFetch/APIFetch";

export default function LandingPage() {
  return (
    <>
      <h1>Welcome to Pelias Geocoder</h1>

      <div>
        <p>
          Developing in-house, geolocation services (i.e. "batch geocoding")
          within PHAC ensuring accurate, cost-effective, secure, trusted, and
          transparency results as a common but important start of multiple
          analytical, spatial journeys. Phases include tech exploration,
          prototyping, refining based on user interaction, and expanding
          coverage. Advantages include enhanced privacy, cost savings,
          traceability, independence from external resources, flexibility, and
          modularity. Avoids reliance on third-party services, ensuring data
          stays within PHAC's network and reducing costs associated with
          external.
        </p>
      </div>
      <section> 
      <APIfetch />       
    </section>
    </>
  );
}
