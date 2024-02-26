import Select from "react-select";
import { Controller } from "react-hook-form";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";

import {previewFileDataOnChangeGeopackageLayer} from '../../../lib/fileUtils';

const SelectGeopackageLayerNames = ({ layers, control }) => {

    return (
        layers.length > 0
            ?
                <FormGroup>
                    <Label>Select Geopackage Layer </Label>
                    <Controller
                        name="layers_geopackage"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                        <Select
                            {...field}
                            options={layers}
                            onChange={async (selectedOption) => {
                                console.log(selectedOption)
                                await previewFileDataOnChangeGeopackageLayer(e)
                                field.onChange(selectedOption); // Notify react-hook-form of the change
                                // handleRegionTypeChange(selectedOption); // Additional logic for onChange
                            }}
                        />
                        )}
                        rules={{ required: 'Please select a column' }}
                    />
                </FormGroup>
            : <></>

    );
}

export {SelectGeopackageLayerNames}