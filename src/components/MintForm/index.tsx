import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Heading } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import BigNumber from 'bignumber.js';

interface PropsType {
  handleClaim: any;
}

export const MintForm = observer((props: PropsType) => {

  function validateImei(value) {
    let error
    if (!value) {
      error = "IMEI is required"
    } else if (value.length !== 15) {
      error = "IMEI should be 15 digits long"
    } else if (!(new BigNumber(value).toNumber())) {
      error = "IMEI should contain digits only"
    }
    return error;
  }

  return (
    <>
      <Heading>Here you can mint a Loot of your device</Heading>
      <Formik
        initialValues={{ imei: "100000000000001" }}
        onSubmit={async (values, actions) => {
          await props.handleClaim(values.imei)
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name="imei" validate={validateImei}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.imei && form.touched.imei}>
                  <FormLabel htmlFor="imei">Device IMEI to mint</FormLabel>
                  <Input {...field} id="imei" placeholder="Input your device IMEI" />
                  <FormErrorMessage>{form.errors.imei}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
});
