import React from 'react';
import { Formik, Form } from 'formik';
import { FormControl, FormLabel, FormErrorMessage, Input, Box, Button } from "@chakra-ui/react";
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
interface registerProps {

}


const Register: React.FC<registerProps> = ({ }) => {
    return (
        <div>
            <Wrapper variant = "small">
                <Formik initialValues = {{username: "", password: ""}} onSubmit = {(values) => {console.log(values)}}>
                    {/* isSubmitting is a prop in Formik */}
                    {({isSubmitting}) => (
                        <Form>
                            <Box mt={4}>
                                <InputField name='username' placeholder="username" label="Username"/>
                                <InputField name='password' placeholder="password" label="Password" type="password"/>
                            </Box>
                            <Button mt={4} type="submit" variantColor="teal" isLoading={isSubmitting}> Register </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>

    )
}


export default Register