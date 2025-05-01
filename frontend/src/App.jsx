import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import ReverseBulkInput from './pages/bulkInput/ReverseBulkInput';
import LandingPage from './pages/landingPage/Landingpage';
import RShinyAPIPage from './pages/apiPages/RShinyAPIPage';
import PythonAPIPage from './pages/apiPages/PythonApiPage';
import FAQ from './pages/FAQ/FAQ';
import GeocodingExplanation from './pages/geocodingExplanation/GeocodingExplanation';
import NoPage from './pages/NoPage';
import ForwardBulkInput from './pages/bulkInput/ForwardBulkInput';
import ContactUs from './pages/contactUs/ContactUs';
// import ForwardBulk from "./components/apiBulkInput/forwardBulk/IntakeForwardBulk"
import ReverseBulk from './components/apiBulkInput/reverseBulk/IntakeReverseBulk.jsx';

//
// TO add a page, go to server.ts and add to list located in << const ROUTES_TO_REDIRECT >>
//

// Clear saved language in development
if (process.env.NODE_ENV === 'development') {
  localStorage.removeItem('i18nextLng');
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Render LandingPage component for both index and "/home" routes */}
        <Route index element={<LandingPage />} />
        <Route path="home" element={<LandingPage />} />
        <Route path="test" element={<ReverseBulk />} />
        {/* Render BulkInput component for the "/bulkinput" route */}
        <Route path="bulk-address-geocoding" element={<ForwardBulkInput />} />
        <Route path="reverse-geocoding-bulk" element={<ReverseBulkInput />} />
        <Route path="r-api" element={<RShinyAPIPage />} />
        <Route path="python-api" element={<PythonAPIPage />} />
        <Route path="frequently-asked-questions" element={<FAQ />} />
        <Route
          path="geocoding-results-explanation"
          element={<GeocodingExplanation />}
        />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
