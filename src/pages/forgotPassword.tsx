import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { createUrqlClient } from '../util/createUrqlClient';
import { useForgotPasswordMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';

interface forgotPasswordProps {
    
}

const forgotPassword: React.FC<forgotPasswordProps> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [,resetPassword] = useForgotPasswordMutation();
    return (
        <Layout variant="small">
            {/* return a promise, stop spinning when promise is resolved */}
            <Formik
                initialValues= {{ email: '' }}
                onSubmit={async (values) => {
                    await resetPassword(values);
                    setComplete(true);
                }}
            >
                {/* isSubmitting is a prop in Formik */}
                {({ isSubmitting }) => complete ? <Box> if an account with that email exists, we sent you an email </Box> : (
                    <Form>
                        <Box mt={4}>
                            <InputField name='email' placeholder="email" label="Email" type="email" />
                        </Box>
                        <Flex mt={4}>
                            <Button type="submit" variantColor="teal" isLoading={isSubmitting}> Reset Password </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(forgotPassword)