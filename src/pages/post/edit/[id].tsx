import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../util/createUrqlClient';
import { useGetPostFromURL } from '../../../util/useGetPostFromURL';

interface EditPostProps {

}

const EditPost: React.FC<EditPostProps> = ({ }) => {
    const [{ data, fetching }] = useGetPostFromURL();
    const router = useRouter();
    const [, updatePost] = useUpdatePostMutation();

    return (
        <Layout variant="small">
            {(fetching || (typeof data === "undefined")) ? <Spinner /> :
                <Box p={5} shadow="md" borderWidth="1px">
                    <Formik
                        initialValues={{ text: data?.post?.text }}
                        onSubmit={async (values) => {
                            console.log(values);
                            const { error } = await updatePost({ id: (data?.post?.id ? data.post.id : -1), ...values});
                            // if (!error)
                            if (error) {
                                // display something went wrong here 
                            }
                            router.replace(`/post/${data?.post?.id}`);
                        }}
                    >
                        {/* isSubmitting is a prop in Formik */}
                        {({ isSubmitting }) => (
                            <Form>
                                <Text fontSize={32} fontWeight="bold"> {data?.post?.title} </Text>
                                <Box mt={4} mb={4}>
                                    <InputField textArea name='text' placeholder={"..."} label="text" />
                                </Box>
                                <Button type="submit" variantcolor="teal" isLoading={isSubmitting}> Update Post </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            }
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(EditPost);