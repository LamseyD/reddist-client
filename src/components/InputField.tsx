import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {name: string, label: string, textArea?: boolean}; //require field name

//size:_ not passing in size
export const InputField: React.FC<InputFieldProps> = ({label, textArea = false, size:_, ...props}) => {
    const [field, {error}] = useField(props);
    return (
        // '' => false
        // 'etasdf' => true
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}> {label}</FormLabel>
            { !textArea ? <Input {...field} {...props} id={field.name} /> : <Textarea {...field} {...props} id={field.name}/>}
            {error ? <FormErrorMessage> <WarningIcon mr={2}/>  {error}</FormErrorMessage> : null}
        </FormControl>
    )
}