import React from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useToast,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useStore } from '@/store/index';
import { helper } from '@/lib/helper';
import { BooleanState } from '@/store/standard/base';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"

interface PropsType {
  isOpen: boolean;
  onClose: any;
  deviceImei: string;
  recordId: number;
}

export const MintModal = observer((props: PropsType) => {
  const toast = useToast();
  const { token, god, dpLoot, rec } = useStore();

  const store = useLocalStore(() => ({
    loading: new BooleanState(),
    minting: new BooleanState(),
    isApproved: new BooleanState()
  }))

  async function approve() {
    store.loading.setValue(true);
    const pbl = token.tokens[god.currentChain.chainId].filter((token) => token.symbol == 'PBL')[0];

    const [err, res] = await helper.promise.runAsync(
      pbl.approve({
        params: [dpLoot.contracts[god.currentChain.chainId].address, 1000]
      })
    )

    if (err) {
      toast({
        title: "Transaction reverted.",
        description: err.data.message,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    } else {
      const receipt = await res.wait();
      if (receipt.status) {
        toast({
          title: "PBL has been approved",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        store.isApproved.setValue(true);
      }
    }
    store.loading.setValue(false);
  }

  async function mint() {
    store.minting.setValue(true)
    const [err, res] = await helper.promise.runAsync(rec.mint(props.deviceImei, props.recordId));
    if (err) {
      toast({
        title: "Transaction reverted.",
        description: err.data.message,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    } else {
      const receipt = await res.wait();
      if (receipt.status) {
        toast({
          title: "Vapor has been solidified",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        store.isApproved.setValue(true);
      }
    }
    store.minting.setValue(false)
  }

  const elementTable = () => {
    if (rec.records.map[props.deviceImei]?.decodedRecords[props.recordId]) {
      return(
        <Table variant="simple" size={'sm'}>
          <TableCaption placement={'top'} mt={-2}>Contents of the Vapor</TableCaption>
          <Thead>
            <Tr>
              <Th>Element name:</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td>A</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].snr}</Td>
            </Tr>
            <Tr>
              <Td>B</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].vbat}</Td>
            </Tr>
            <Tr>
              <Td>C</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].latitude.toString()}</Td>
            </Tr>
            <Tr>
              <Td>D</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].longitude.toString()}</Td>
            </Tr>
            <Tr>
              <Td>E</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].gasResistance}</Td>
            </Tr>
            <Tr>
              <Td>F</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].temperature}</Td>
            </Tr>
            <Tr>
              <Td>G</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].pressure}</Td>
            </Tr>
            <Tr>
              <Td>H</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].humidity}</Td>
            </Tr>
            <Tr>
              <Td>I</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].light}</Td>
            </Tr>
            <Tr>
              <Td>J</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].gyroscope}</Td>
            </Tr>
            <Tr>
              <Td>K</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].accelerometer}</Td>
            </Tr>
            <Tr>
              <Td>L</Td>
              <Td isNumeric>{rec.records.map[props.deviceImei].decodedRecords[props.recordId].random}</Td>
            </Tr>
          </Tbody>
        </Table>
      )
    }
    else {
      return (<Text>Cannot fetch element data</Text>)
    }
  }

  return (
    <Modal
      isOpen={props.isOpen}
      isCentered size={'lg'}
      onClose={
        props.onClose
      }
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Solidify the Vapor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {elementTable()}
        </ModalBody>
        <ModalFooter>
          {
            store.isApproved.value
              ?
              <Button colorScheme="blue" disabled={true} mr={3}>
                Approved
              </Button>
              :
              <>
                {
                  store.loading.value
                    ?
                    <Button colorScheme="blue" mr={3}>
                      <Spinner />
                    </Button>
                    :
                    <Button
                      colorScheme="blue" mr={3}
                      onClick={() => {
                        approve();
                      }}
                    >
                      Approve
                    </Button>
                }
              </>
          }
          {
            store.isApproved.value
              ?
              <>
                {
                  store.minting.value ?
                    <Button variant={'ghost'}>
                      <Spinner />
                    </Button> :
                    <Button
                      onClick={() => {
                        mint()
                      }}
                    >
                      Mint
                    </Button>
                }
              </>
              :
              <Button
                disabled={true}
              >
                Mint
              </Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
