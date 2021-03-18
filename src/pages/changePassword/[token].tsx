//name contains variable -> convention

import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link'
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';
import { toErrorMap } from '../../util/toErrorMap';

interface changePasswordProps {
}


const ChangePassword: NextPage<changePasswordProps> = ({}) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({ newPassword: values.newPassword, token: typeof router.query.token === 'string' ? router.query.token : ""});
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {/* isSubmitting is a prop in Formik */}
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField name='newPassword' placeholder="password" label="New Password" type="password" />
                        </Box>

                        {tokenError ? (
                            <Flex>
                                <Box mr={2} color='red'>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgotPassword">
                                    <Link> Get a new token </Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button mt={4} type="submit" variantcolor="teal" isLoading={isSubmitting}> Change Password </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>);
}

// getInitialProps -> static page
// ChangePassword.getInitialProps = ({ query }) => {
//     return {
//         token: query.token as string
//     }
// }
export default withUrqlClient(createUrqlClient)(ChangePassword);