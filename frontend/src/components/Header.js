import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import Layout from "./Layout";

export default function AppHeader() {
  return (
    <Box w="100%" bg="#FFF" h="100px" my={4}>
      <Layout marginY="0" padding="0">
        <HStack justify={"space-between"}>
          <Heading>Eventual Header</Heading>
          <Text> french</Text>
        </HStack>
        <Divider borderColor="black" my={1} h="5px" />
        <Flex justify="space-around">
          <Button> Eventual Menu </Button>
          <Button> Eventual Menu </Button>
          <Button> Eventual Menu </Button>
          <Button> Eventual Menu </Button>
        </Flex>
      </Layout>
    </Box>
  );
}
