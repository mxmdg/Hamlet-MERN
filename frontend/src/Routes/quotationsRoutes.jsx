import { Route } from "react-router-dom";
import JobFinder from "../Components/Jobs/JobFinder";
import { QuotationProperties } from "../Components/utils/PropertiesMaps/jobsMap";
import CotFetcher from "../Components/cottizations/CotFetcher";

export const quotationsRoutes = () => (
  <>
    <Route
      path="/quotations"
      element={
        <JobFinder
          entity={"quotations"}
          propertiesMap={QuotationProperties}
          inputsColor={"secondary"}
        />
      }
    />
    <Route path="/quotations/edit/:id" element={<CotFetcher />} />
  </>
);
