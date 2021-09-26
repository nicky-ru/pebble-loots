import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, LinkBox, SimpleGrid, LinkOverlay, Stack, Image } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { ToolConfig } from '../../config/ToolConfig';
import { Badge, Text } from '@chakra-ui/layout';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export const Home = observer(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container maxW="7xl">
        <SimpleGrid minChildWidth="200px" spacing="10px" py="6">
          {ToolConfig.map((i) => (
            <LinkBox as="article" w="full" p="4" borderWidth="1px" rounded="md" key={i.name}>
              <LinkOverlay as={Link} to={i.path} target="_self">
                <Text>{i.name}</Text>
              </LinkOverlay>
              {i.tags && (
                <Stack direction="row" mt="2">
                  {i.tags.map((i) => (
                    <Badge key={i} variant="outline" colorScheme="green">
                      {i}
                    </Badge>
                  ))}
                </Stack>
              )}
            </LinkBox>
          ))}
        </SimpleGrid>
      </Container>
      <Image mt={-24} width={"100vw"} src={"/images/pebble-loots-how-to.svg"}/>
    </ErrorBoundary>
  );
});
