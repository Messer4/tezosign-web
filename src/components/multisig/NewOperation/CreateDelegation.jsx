// useState
import React from 'react';
import PropTypes from 'prop-types';
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
// import SelectCustom from '../../SelectCustom';
// import AccentText from '../../styled/AccentText';
// import BreakTxt from '../../styled/BreakTxt';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import { bs58Validation } from '../../../utils/helpers';
import useAPI from '../../../hooks/useApi';

const schema = Yup.object({
  baker: Yup.string()
    .trim()
    .required(
      "This field cannot be empty. If you want to undelegate, click the button 'Undelegate'.",
    )
    .matches('tz1|tz2|tz3', 'Tezos baker address must start with tz1, tz2, tz3')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

// const delegatingTo = 'tz1Ldzz6k1BHdhuKvAtMRX7h5kJSMHESMHLC';

// const bakers = [
//   {
//     value: 'tz1123333333333333322222222222222222',
//     label: 'Test baker 1',
//   },
//   {
//     value: 'tz1123333333333333326666666666666666',
//     label: 'Test baker 2',
//   },
// ];

const CreateDelegation = ({ contractAddress, onCreate }) => {
  // const [alias, setAlias] = useState('');
  const { sendOperation } = useAPI();

  return (
    <div>
      {/* <div style={{ marginBottom: '20px' }}> */}
      {/*  <FormLabel as="p" style={{ marginBottom: '0' }}> */}
      {/*    Currently delegating to: */}
      {/*  </FormLabel> */}
      {/*  <AccentText> */}
      {/*    <BreakTxt>{delegatingTo}</BreakTxt> */}
      {/*  </AccentText> */}
      {/* </div> */}

      <Formik
        initialValues={{ baker: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const newDelegation = await sendOperation({
              contract_id: contractAddress,
              type: 'delegation',
              to: values.baker,
            });
            onCreate(newDelegation.data);
          } catch (e) {
            console.error(e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          // setFieldValue,
          handleBlur,
          handleChange,
          isSubmitting,
          errors,
          touched,
          setSubmitting,
        }) => (
          <Form>
            <BForm.Group controlId="baker" style={{ marginBottom: 0 }}>
              <FormLabel>Delegate to baker address</FormLabel>
              <InputGroup>
                <Field
                  as={BForm.Control}
                  type="text"
                  name="baker"
                  aria-label="baker"
                  placeholder="tz1..."
                  size="sm"
                  isInvalid={!!errors.baker && touched.baker}
                  isValid={!errors.baker && touched.baker}
                  onChange={(value) => {
                    handleChange(value);
                    // setAlias('');
                  }}
                  onBlur={handleBlur}
                />
                {/* <InputGroup.Append> */}
                {/*  <SelectCustom */}
                {/*    options={bakers} */}
                {/*    displayValue={false} */}
                {/*    onChange={(value) => { */}
                {/*      setFieldValue('baker', value.value); */}
                {/*      setAlias(value.label); */}
                {/*    }} */}
                {/*  /> */}
                {/* </InputGroup.Append> */}

                <ErrorMessage
                  name="baker"
                  component={BForm.Control.Feedback}
                  type="invalid"
                />
              </InputGroup>

              {/* <BForm.Text> */}
              {/*  <AccentText>{alias}</AccentText> */}
              {/* </BForm.Text> */}
            </BForm.Group>

            <FormSubmit>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Delegate
              </Button>
              <Button
                variant="danger"
                size="lg"
                style={{ marginLeft: '10px' }}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    const newDelegation = await sendOperation({
                      contract_id: contractAddress,
                      type: 'delegation',
                    });
                    onCreate(newDelegation.data);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                Undelegate
              </Button>
            </FormSubmit>
          </Form>
        )}
      </Formik>
    </div>
  );
};

CreateDelegation.propTypes = {
  contractAddress: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateDelegation;
