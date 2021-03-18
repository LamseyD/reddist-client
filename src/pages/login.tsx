import React from 'react';
import { Formik, Form } from 'formik';
import {  Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
interface loginProps {

}

// workflow -> add graphql queries in the graphql folder (mutation or queries). -> run npm use gen to generate typescripts code in generated file -> use custom hooks to get response from server
const Login: React.FC<loginProps> = ({}) => {
    const [,login] = useLoginMutation(); //first argument is the type of operation, second argument is our function
    const router = useRouter();
    return (
        <Layout>
            <Wrapper variant = "small">
                {/* return a promise, stop spinning when promise is resolved */}
                <Formik 
                    initialValues = {{username: "", password: ""}} 
                    onSubmit = { async (values, {setErrors}) => {
                        const response = await login({username: values.username, password: values.password}); 
                        if (response.data?.login.errors){
                            setErrors(toErrorMap(response.data.login.errors));
                        } else if (response.data?.login.user){
                            if (typeof router.query.next === 'string'){
                                router.push(router.query.next);
                            } else {
                                router.push("/");
                            }
                        }
                    }}
                > 
                    {/* isSubmitting is a prop in Formik */}
                    {({isSubmitting}) => (
                        <Form>
                            <Box mt={4}>
                                <InputField name='username' placeholder="username" label="Username"/>
                                <InputField name='password' placeholder="password" label="Password" type="password"/>
                            </Box>
                            <Flex mt={4}>
                                <Button type="submit" variantcolor="teal" isLoading={isSubmitting}> Login </Button>
                                <NextLink href="/forgotPassword">
                                    <Link ml={"auto"}>
                                        reset password
                                    </Link>
                                </NextLink>
                            </Flex>
                            
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </Layout>

    )
}


export default withUrqlClient(createUrqlClient)(Login);