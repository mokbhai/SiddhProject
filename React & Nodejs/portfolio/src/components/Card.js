import React from "react";
import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Card = ({ title, description, imageSrc }) => {
  return (
    <VStack
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="lg"
      width="300px"
      bg="white"
      color="black"
    >
      <Image src={imageSrc} alt={title} />
      <VStack alignItems="flex-start" spacing={2}>
        <Heading as="h3" size="md" color="black">
          {/* Set Heading color to black */}
          {title}
        </Heading>
        <Text color="black">{description}</Text> {/* Set Text color to black */}
      </VStack>
      <HStack justify="flex-end" mt={4}>
        <FontAwesomeIcon icon={faArrowRight} size="1x" />
      </HStack>
    </VStack>
  );
};

export default Card;
