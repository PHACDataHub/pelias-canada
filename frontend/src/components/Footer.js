import {
    Box,

  } from "@chakra-ui/react";
  import Layout from "./Layout";
  
  export default function AppFooter() {
    return (
      <Box w="100%" bg="#FFF" h="125px" my={4}>
        <Layout marginY="0" padding="0">
          <p> FOOTER</p>
        </Layout>
      </Box>
    );
  }
  