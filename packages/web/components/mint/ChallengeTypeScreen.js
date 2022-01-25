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

export const ChallengeTypeScreen = (props) => {
  return (
    <div className="bg-white/10 p-10 rounded backdrop-blur-sm ">
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
          // const price = utils.parseEther(prtclePrice).toString();
          // const quantity = utils.parseEther(maxQuantity).toString();
          // const total = utils.parseEther(totalQuantity).toString();

          // await props.addChallengeTypes([
          //   {
          //     name,
          //     description,
          //     prtclePrice: price,
          //     maxQuantity: quantity,
          //     totalQuantity: total,
          //   },
          // ]);
          props.setIndex(1);

          actions.setSubmitting(false);
        }}
      >
        <FormFrame className="flex flex-col gap-8 ">
          <Field
            className="py-4 px-8 text-gray-800 rounded"
            id="name"
            name="name"
            placeholder="Challenge Title"
          />
          <Field
            id="description"
            name="description"
            placeholder="Enter Description"
            className="py-4 px-8 text-gray-800 rounded"
          >
            {({ field, form, meta }) => {
              return (
                <TextArea
                  name="description"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Description"
                  style={{ resize: 'none' }}
                  className="py-4 px-8 text-gray-800 rounded min-h-xl"
                />
              );
            }}
          </Field>
          <Field
            id="prtclePrice"
            name="prtclePrice"
            placeholder="Starting Price (in Particle)"
            className="py-4 px-8 text-gray-800 rounded"
          />
          <Field
            id="maxQuantity"
            name="maxQuantity"
            placeholder="Max quantity"
            className="py-4 px-8 text-gray-800 rounded"
          />
          <Field
            id="totalQuantity"
            name="totalQuantity"
            placeholder="Total Quantity"
            className="py-4 px-8 text-gray-800 rounded"
          />
          <button type="submit">Next</button>
        </FormFrame>
      </Formik>
    </div>
  );
};

const TextArea = styled.textarea``;

const FormFrame = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
`;
