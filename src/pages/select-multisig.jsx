import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
// TODO: Research import variants
import * as Yup from 'yup';
// import SelectCustom from '../components/SelectCustom';
import CardMultisigType from '../components/CardMultisigType';
import { bs58Validation } from '../utils/helpers';

const Bold = styled.span`
  font-weight: 800;
`;

const Regular = styled.span`
  font-weight: 400;
`;

const SelectMultisigStyled = styled.section`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 53px;

  @media (${({ theme }) => theme.smDown}) {
    margin-top: 0;
  }
`;

const schema = Yup.object({
  address: Yup.string()
    .trim()
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

// const availableContracts = [
//   'KT1fffffffffffffffffffffffffffffffff',
//   'KT1NtGnEjacAkBph7k9HWVrN38PoYjcXTxdY',
//   'KT1cvvvvvvvvvvdvvfdDDvvvvvvvvvvvvvvd',
// ];

const SelectMultisig = () => {
  const history = useHistory();

  return (
    <SelectMultisigStyled>
      <CardMultisigType
        title="Create a new multisig"
        icon="wallet"
        text={
          <>
            Create a new multisig wallet by declaring owners, signature
            thresholds and more. <br />
            <Bold>Note: </Bold>
            <Regular>Requires contract deployment cost.</Regular>
          </>
        }
      >
        <Button as={Link} variant="primary" size="lg" to="/create-multisig">
          Create
        </Button>
      </CardMultisigType>

      <CardMultisigType
        title="Manage an existing multisig"
        icon="cogs"
        text="Enter a contract address that has an owner associated with the account
        that is currently connected."
      >
        <Formik
          initialValues={{ address: '' }}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            history.push(`/multisig/${values.address}`);
          }}
        >
          {/* setFieldValue */}
          {({ isSubmitting, errors, touched }) => (
            <FForm as={BForm} style={{ maxWidth: '380px', margin: '0 auto' }}>
              <BForm.Group style={{ marginBottom: '10px' }}>
                <InputGroup style={{ textAlign: 'right' }}>
                  <Field
                    as={BForm.Control}
                    type="text"
                    name="address"
                    aria-label="address"
                    placeholder="KT1..."
                    size="sm"
                    isInvalid={!!errors.address && touched.address}
                    isValid={!errors.address && touched.address}
                    style={{ height: 'auto' }}
                  />

                  {/* <InputGroup.Append> */}
                  {/*  <SelectCustom */}
                  {/*    options={availableContracts} */}
                  {/*    displayValue={false} */}
                  {/*    onChange={(value) => { */}
                  {/*      setFieldValue('address', value.value); */}
                  {/*    }} */}
                  {/*  /> */}
                  {/* </InputGroup.Append> */}

                  <ErrorMessage
                    component={BForm.Control.Feedback}
                    style={{ textAlign: 'left' }}
                    name="address"
                    type="invalid"
                  />
                </InputGroup>
              </BForm.Group>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Manage
              </Button>
            </FForm>
          )}
        </Formik>
      </CardMultisigType>
    </SelectMultisigStyled>
  );
};

export default SelectMultisig;
