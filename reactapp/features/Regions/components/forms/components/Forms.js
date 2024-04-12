import React from 'react';
import { Controller } from 'react-hook-form';
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Input } from "components/UI/StyleComponents/Input.styled";
import Select from 'react-select';
import styled from "styled-components";

// Reusable Label Component

const FormContainer = styled.div`
    top: 60px;
    position: absolute;
    height: fit-content;
    z-index: 300;
    right: 10px;
    /* Media query for devices with width up to 768px */
    @media (max-width: 768px) {
      width: 100%; /* Take the full width */
      right: 0; /* Align to the right edge */
      border-radius: 0; /* Optional: removes border radius for full-width */
      flex: none; /* Override the flex property */
      margin-top: 60px; /* Adjust the top margin */
      position: fixed; /* Make position fixed to stay in view */
      top: 0; /* Align to the top */
      height: fit-content; /* Make it full height */
      overflow-y: auto; /* Add scroll for overflow content */
    }
`

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

export { DynamicFormField, FormInputFile, FormSelect, FormContainer };