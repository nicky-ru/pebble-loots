import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Container } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useStore } from '@/store/index';

interface PropsType {
  tokenToTransfer: string;
}

export const TransferForm = observer((props: PropsType) => {
  const { ploot } = useStore();

  function validateAddress(value) {
    let error
    if (!value) {
      error = "Address is required"
    } else if (value.length !== 42) {
      error = "Address should be 42 symbols long"
    }
    return error;
  }

  async function handleTransfer(address: string) {
    try {
      await ploot.contracts[ploot.god.currentChain.chainId].transferFrom({
        params: [ploot.god.currentNetwork.account, address, props.tokenToTransfer]
      })
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  return (
    <Container textAlign={"center"}>

      <Formik
        initialValues={{ address: "" }}
        onSubmit={async (values, actions) => {
          await handleTransfer(values.address);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name="address" validate={validateAddress}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.address && form.touched.address}>
                  <FormLabel htmlFor="address">New owner address</FormLabel>
                  <Input {...field} id="address" placeholder="e.g 0xE9cebA328C78a43A492463f72DE80e4e1a2Df04d" />
                  <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Transfer
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
});
