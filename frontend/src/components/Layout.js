import { Center, Container, Heading } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";

export default function Layout({ children, className, marginY, padding }) {
  const isAbove600px = useMediaQuery({ minWidth: 605 });

  return (
    <>
      {/* For all screens above 610px in width */}
      {isAbove600px && (
        <Container
          maxW="600px"
          bg="#fff"
          marginY={marginY || 4}
          padding={padding || 4}
          className={className}
        >
          {children}
        </Container>
      )}

      {/* This is below the 610px required for width */}
      {!isAbove600px && (
        <Container>
          <Center h="98vh">
            <Heading size="large" textAlign={"center"}>
              {" "}
              This application is requires a larger screen. Please use a larger
              screen size to continue{" "}
            </Heading>
          </Center>
        </Container>
      )}
    </>
  );
}
