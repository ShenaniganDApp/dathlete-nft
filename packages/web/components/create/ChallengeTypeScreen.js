import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { Button } from '/components/UI';
import { utils } from 'ethers';

const placeholderChallengeType = {
  id: 0,
  name: 'The Void',
  description: 'The Void',
  prtclePrice: 0,
  maxQuantity: 0,
  canPurchaseWithPrtcle: false,
  canBeTransferred: false,
  totalQuantity: 0,
};

const ChallengeTypeScreen = (props) => {
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          description: '',
          prtclePrice: '',
          maxQuantity: '',
          totalQuantity: '',
        }}
        onSubmit={async (
          { name, description, prtclePrice, maxQuantity, totalQuantity },
          actions
        ) => {
          const price = utils.parseEther(prtclePrice).toString();
          const quantity = utils.parseEther(maxQuantity).toString();
          const total = utils.parseEther(totalQuantity).toString();
          
          await props.addChallengeTypes([
            {
              name,
              description,
              prtclePrice: price,
              maxQuantity: quantity,
              totalQuantity: total,
            },
          ]);
          props.setIndex(1);

          actions.setSubmitting(false);
        }}
      >
        <FormFrame>
          <Field id="name" name="name" placeholder="Challenge Title" />
          <Field
            id="description"
            name="description"
            placeholder="Enter Description"
          >
            {({ field, form, meta }) => {
              return (
                <TextArea
                  name="description"
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          </Field>
          <Field
            id="prtclePrice"
            name="prtclePrice"
            placeholder="Starting Price (in Particle)"
          />
          <Field
            id="maxQuantity"
            name="maxQuantity"
            placeholder="Max quantity"
          />
          <Field
            id="totalQuantity"
            name="totalQuantity"
            placeholder="Total Quantity"
          />
          <button type="submit">Next</button>
        </FormFrame>
      </Formik>
    </div>
  );
};

export default ChallengeTypeScreen;

const TextArea = styled.textarea``;

const FormFrame = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
  height: 200px;
`;
