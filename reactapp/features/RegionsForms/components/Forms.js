import React from 'react';
import { Controller } from 'react-hook-form';
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Input } from "components/UI/StyleComponents/Input.styled";
import Select from 'react-select';

// Reusable Label Component
const FormLabel = ({ htmlFor, children }) => children ? <Label htmlFor={htmlFor}>{children}</Label> : null;

const FormInputFile = ({ control, name, label, onChange }) => (
    <FormGroup>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field: { ref, ...rest } }) => (
                <Input
                    type="file"
                    size="sm"
                    multiple
                    onChange={(e) => {
                        rest.onChange([...e.target.files]);
                        if (onChange) onChange(e);
                    }}
                    ref={ref}
                />
            )}
            rules={{ required: 'Files are required' }}
        />
    </FormGroup>
);

const FormSelect = ({ control, name, options, label, components, styles, onChange }) => (
    <FormGroup>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    options={options}
                    components={components}
                    styles={styles}
                    onChange={val => {
                        field.onChange(val);
                        if (onChange) onChange(val);
                    }}
                />
            )}
            rules={{ required: 'Please select an option' }}
        />
    </FormGroup>
);

const DynamicFormField = ({ fieldType, control, name, options, label, components, styles, onChange, ...props }) => {
    switch (fieldType) {
        case 'select':
            return <FormSelect {...{ control, name, options, label, components, styles, onChange }} {...props} />;
        case 'inputFile':
            return <FormInputFile {...{ control, name, label, onChange }} {...props} />;
        default:
            return null;
    }
};

export { DynamicFormField, FormInputFile, FormSelect };