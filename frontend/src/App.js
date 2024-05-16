import AppFooter from "./components/Footer";
import AppHeader from "./components/Header";
import Layout from "./components/Layout";

import {
  Box,

} from "@chakra-ui/react";


function App() {
  return (
    <>
    
      <AppHeader/>
      <Box minH="calc(100vh - 350px )">
      <Layout >
        <p> This is the child</p> <br/>
       
      </Layout>
      </Box>
      <AppFooter />
      
    </>
  );
}

export default App;
