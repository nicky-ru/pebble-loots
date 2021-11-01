import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Text, Flex, Box, Image } from '@chakra-ui/react';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { Machinaverse } from '@/components/Machinaverse';
import { Sediments } from '@/components/Sediments';
import { Foundry } from '@/components/Foundry';
import { ERC20 } from '../ERC20';
import { Vapor } from '@/components/Vapor';
import { useStore } from '@/store/index';

export const Home = observer(() => {
  const { tabs } = useStore();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box position={'absolute'} h={'96vh'} w={'96vh'} bg={'#E4F9FF'} zIndex={-1}/>
      <Box>
        <Image position={'absolute'} ml={64} zIndex={-1} maxH={'96vh'} src={'./images/pixel_bg.webp'}/>
        <Tabs
          index={tabs.tabIndex}
          onChange={(i) => {
            tabs.setTabIndex(i);
          }}
          colorScheme={'green'}
          orientation={'vertical'}
          size={'lg'}
          variant={'soft-rounded'}
        >
          <Flex
            mt={'2vh'}
            minH={'94vh'}
            borderTopRightRadius={'3xl'}


            justifyContent={'space-between'}
            flexDir={'column'}
            boxShadow={'dark-lg'}
            bg={'blue.50'}
          >
            <TabList
              w={64}
            >
              <Tab _hover={{transform: "scale(1.1)"}} >Home</Tab>
              <Tab _hover={{transform: "scale(1.1)"}} >Machinaverse</Tab>
              <Tab _hover={{transform: "scale(1.1)"}} >Vapor</Tab>
              <Tab _hover={{transform: "scale(1.1)"}} >Sediments</Tab>
              <Tab _hover={{transform: "scale(1.1)"}} >The Foundry</Tab>
              <Tab _hover={{transform: "scale(1.1)"}} >Marketplace</Tab>
            </TabList>
            <Box m={8}>
              <Text>Plasma Token Price (PMT)</Text>
              <Text fontWeight={'bold'}>13$</Text>
            </Box>
          </Flex>

          <TabPanels>
            <TabPanel>
              <Container align={'center'} maxW={'container.lg'} p={16}>
                <Heading textColor={'green.500'}>Home</Heading>
                <Text fontWeight={'semibold'} fontSize={'xl'} textColor={'green.800'}>
                  Hello Master. Welcome to Machinaverse. We believe, that each device in this world should have a right to live it's life. Here is the entry point to give your device a chance to have
                  it's own persona in the metaverse. Each device has got it's own unique identity. Each device's soul needs to be awaken in the Machinaverse. Each soul of Machinaverse works hard for the
                  master who gave it freedom to live.
                </Text>
              </Container>
            </TabPanel>

            <TabPanel>
              <Machinaverse />
            </TabPanel>

            <TabPanel>
              <Vapor />
            </TabPanel>

            <TabPanel>
              <Sediments />
            </TabPanel>

            <TabPanel>
              <Foundry />
            </TabPanel>

            <TabPanel>
              <ERC20 />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ErrorBoundary>
  );
});
