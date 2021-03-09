import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {name: string, label: string, }; //require field name

//size:_ not passing in size
export const InputField: React.FC<InputFieldProps> = ({label, size:_, ...props}) => {
    const [field, {error}] = useField(props);
    return (
        // '' => false
        // 'etasdf' => true
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}> {label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage> <WarningIcon mr={2}/>  {error}</FormErrorMessage> : null}
        </FormControl>
    )
}