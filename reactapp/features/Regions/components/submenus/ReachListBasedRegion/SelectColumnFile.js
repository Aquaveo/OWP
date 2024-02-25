import Select from "react-select";
import { Controller } from "react-hook-form";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { LoadingText } from "components/UI/StyleComponents/Loader.styled";
const SelectColumnFile = ({ columnsFile, control }) => {
    return (
            columnsFile
            ?
                <FormGroup>
                    <Label htmlFor="regionType">Select Reach ID Column </Label>
                    <Controller
                        name="File Columns"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                        <Select
                            {...field}
                            options={columnsFile}
                            onChange={(selectedOption) => {
                                console.log(selectedOption)
                                field.onChange(selectedOption); // Notify react-hook-form of the change
                                // handleRegionTypeChange(selectedOption); // Additional logic for onChange
                            }}
                        />
                        )}
                        rules={{ required: 'Please select a column' }}
                    />
                </FormGroup>
            : 
            <LoadingText>
                Loading ...
            </LoadingText>
    );
}

export {SelectColumnFile}