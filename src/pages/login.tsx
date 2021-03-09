import React from 'react';
import { Formik, Form } from 'formik';
import {  Box, Button } from "@chakra-ui/react";
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { useRouter } from "next/router"
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';
interface loginProps {

}

// workflow -> add graphql queries in the graphql folder (mutation or queries). -> run npm use gen to generate typescripts code in generated file -> use custom hooks to get response from server
const Login: React.FC<loginProps> = ({}) => {
    const [,login] = useLoginMutation(); //first argument is the type of operation, second argument is our function
    const router = useRouter();
    return (
        <div>
            <Wrapper variant = "small">
                {/* return a promise, stop spinning when promise is resolved */}
                <Formik 
                    initialValues = {{username: "", password: ""}} 
                    onSubmit = { async (values, {setErrors}) => {
                        const response = await login({username: values.username, password: values.password}); 
                        if (response.data?.login.errors){
                            setErrors(toErrorMap(response.data.login.errors));
                        } else if (response.data?.login.user){
                            router.push("/");
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
                            <Button mt={4} type="submit" variantcolor="teal" isLoading={isSubmitting}> Login </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>

    )
}


export default withUrqlClient(createUrqlClient)(Login);