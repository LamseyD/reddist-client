import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../util/useIsAuth';

interface createPostProps {

}

const createPost: React.FC<createPostProps> = ({ }) => {
    const router = useRouter();
    useIsAuth();
    const [, createPost] = useCreatePostMutation();

    return (<Layout variant="small">
        <Formik
            initialValues={{ title: "", text: "" }}
            onSubmit={async (values) => {
                console.log(values);
                const { error } = await createPost({ options: values });
                if (!error)
                    router.push("/");
            }}
        >
            {/* isSubmitting is a prop in Formik */}
            {({ isSubmitting }) => (
                <Form>
                    <Box mt={4} mb={4}>
                        <InputField name='title' placeholder="title" label="Title" />
                        <InputField textArea name='text' placeholder="text..." label="body" />
                    </Box>
                    <Button type="submit" variantcolor="teal" isLoading={isSubmitting}> Create Post </Button>


                </Form>
            )}
        </Formik>
    </Layout>);
}

export default withUrqlClient(createUrqlClient, {ssr: false})(createPost);