import React from 'react';
import { Controller } from 'react-hook-form';
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Input } from "components/UI/StyleComponents/Input.styled";
import Select from 'react-select';

const FormInputFile = ({ control, name, label,onChange }) => {
    return (
        <FormGroup>
            {label ? <Label htmlFor={name}> {label}</Label>: null}
            <Controller
                name={name}
                control={control}
                defaultValue={[]}
                render={({ field: { ref, ...rest } }) => (
                    <Input
                        type="file"
                        size="sm"
                        multiple
                        onChange={async (e) => {
                            console.log(e)
                            rest.onChange([...e.target.files]);
                            if (onChange) {
                                console.log(e)
                                onChange(e)
                                
                            };
                        }}
                        ref={ref}
                    />
                )}
                rules={{ required: 'Files are required' }}

            />
        </FormGroup>

    );
};


const FormSelect = ({ control, name, options,label,components,styles, onChange }) => {


    return (
    <FormGroup>
        {label ? <Label htmlFor={name}> {label}</Label>: null}
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    options={options}
                    onChange={val => {
                        field.onChange(val);
                        if (onChange) onChange(val);
                    }}
                    components={components}
                    styles={styles}
                />
            )}
            rules={{ required: 'Please select a column' }}
        />
    </FormGroup>

    );
};


// Dynamic Form Field component
const DynamicFormField = ({ fieldType, control, name, options, label,components,styles, onChange }) => {
    switch (fieldType) {
        case 'select':
            return <FormSelect control={control} name={name} options={options} label={label} components={components} styles={styles} onChange={onChange} />;
        case 'inputFile':
            return <FormInputFile control={control} name={name} label={label} onChange={onChange} />;
        default:
            return null; // Or any fallback UI
    }
};

export { DynamicFormField, FormInputFile, FormSelect};