import { Formik, Form, Field, useFormik } from 'formik';
import Button from '../components/UI/Button';
import { useDropzone } from 'react-dropzone';

const fields = [
  {
    id: 'title',
    name: 'title',
    placeholder: 'Title',
    as: 'input',
    required: true,
  },
  {
    id: 'description',
    name: 'description',
    placeholder: 'Description',
    as: 'textarea',
  },
  {
    id: 'believerOption',
    name: 'believerOption',
    placeholder: 'Option for the believers',
    as: 'input',
  },
  {
    id: 'doubterOption',
    name: 'doubterOption',
    placeholder: 'Option for the doubters',
    as: 'input',
  },
];

const Make = () => {
  const onSubmit = (vals) => {
    console.log(vals);
  };

  return (
    <div className=" h-screen flex flex-col justify-around items-center">
      <Formik
        initialValues={{
          title: '',
          description: '',
          believerOption: '',
          doubterOption: '',
        }}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <>
            <Form className="flex flex-col gap-5 w-[60%]">
              {fields.map((field, i) => (
                <Field
                  className="rounded-xl p-5 text-black"
                  key={i}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  as={field.as}
                  type={field.type}
                  required
                />
              ))}
              <UploadComponent setFieldValue={setFieldValue} />

              <Button type="submit">Make</Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

const UploadComponent = (props) => {
  const { setFieldValue } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('files', acceptedFiles);
    },
    multiple: false,
  });
  return (
    <div>
      {}
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag 'n' drop an image file here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default Make;
