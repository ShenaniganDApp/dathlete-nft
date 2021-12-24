import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useViewerRecord } from '@self.id/framework';

const SelfIdForm = ({ videoUrl }) => {
  // const record = useViewerRecord('challengeNFT');

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        video: '',
      }}
      onSubmit={async ({ title, description }, actions) => {
        console.log('record: ', record);
        await record.set({
          title,
          description,
          image: {
            alternatives: [],
            original: {
              src: 'ipfs://QmUzgZSJxcVakAho8stC9izdWjqctYNHYyqr7hSUtmC3z8',
              height: 369,
              width: 369,
              mimeType: 'image/png',
              size: 23658,
            },
          },
        });
      
        actions.setSubmitting(false)
      }}
    >
      <FormFrame>
        <Field id="title" name="title" placeholder="Enter Title" />

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

        <Field id="video" name="video" placeholder="Enter IPFS Video URL" />
        <button type="submit">Submit</button>
      </FormFrame>
    </Formik>
  );
};

const TextArea = styled.textarea``;

const FormFrame = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
  height: 200px;
`;

export default SelfIdForm;
