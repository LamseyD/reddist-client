import React from 'react';
import { Formik, Form } from 'formik';
import {  Box, Button } from "@chakra-ui/react";
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { useRouter } from "next/router"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../util/createUrqlClient';
interface registerProps {

}

// workflow -> add graphql queries in the graphql folder (mutation or queries). -> run npm use gen to generate typescripts code in generated file -> use custom hooks to get response from server
const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation(); //first argument is the type of operation, second argument is our function
    const router = useRouter();
    return (
        <div>
            <Wrapper variant = "small">
                {/* return a promise, stop spinning when promise is resolved */}
                <Formik 
                    initialValues = {{username: "", password: "", email: ""}} 
                    onSubmit = { async (values, {setErrors}) => {
                        const response = await register({options: values}); 
                        if (response.data?.register.errors){
                            setErrors(toErrorMap(response.data.register.errors));
                        } else if (response.data?.register.user){
                            router.push("/");
                        }
                    }}
                > 
                    {/* isSubmitting is a prop in Formik */}
                    {({isSubmitting}) => (
                        <Form>
                            <Box mt={4}>
                                <InputField name='username' placeholder="username" label="Username"/>
                                <InputField name='email' placeholder="email" label="Email"/>
                                <InputField name='password' placeholder="password" label="Password" type="password"/>
                            </Box>
                            <Button mt={4} type="submit" variantcolor="teal" isLoading={isSubmitting}> Register </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>

    )
}


export default withUrqlClient(createUrqlClient)(Register);