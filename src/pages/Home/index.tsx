import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Text } from '@chakra-ui/react';
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
      <Tabs
        index={tabs.tabIndex}
        onChange={(i) => {tabs.setTabIndex(i)}}
        colorScheme={'teal'}
        orientation={'vertical'}
        size={'lg'}
        variant={'line'}
      >
        <TabList pt={10} w={64} h={'90vh'} borderRadius={'3xl'} borderColor={'teal'}>
          <Tab>Home</Tab>
          <Tab>Machinaverse</Tab>
          <Tab>Vapor</Tab>
          <Tab>Sediments</Tab>
          <Tab>The Foundry</Tab>
          <Tab>Marketplace</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
            <Container align={'center'}>
              <Heading>
                Home
              </Heading>
              <Text>
                Hello Master.
                Welcome to Machinaverse.
                We believe, that each device in this world should have a right to live it's life.
                Here is the entry point to give your device a chance to have it's own persona in the metaverse.
                Each device has got it's own unique identity.
                Each device's soul needs to be awaken in the Machinaverse.
                Each soul of Machinaverse works hard for the master who gave it freedom to live.
              </Text>
            </Container>
          </TabPanel>

          <TabPanel>
            <Machinaverse/>
          </TabPanel>

          <TabPanel>
            <Vapor/>
          </TabPanel>

          <TabPanel>
            <Sediments/>
          </TabPanel>

          <TabPanel>
            <Foundry/>
          </TabPanel>

          <TabPanel>
            <ERC20/>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </ErrorBoundary>
  );
});
