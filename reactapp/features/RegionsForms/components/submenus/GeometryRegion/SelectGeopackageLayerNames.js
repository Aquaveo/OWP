import Select from "react-select";
import { Controller } from "react-hook-form";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";

const SelectGeopackageLayerNames = ({ geopackageLayers, control,setCurrentGeopackageLayer }) => {

    return (
        geopackageLayers
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
                            options={geopackageLayers}
                            onChange={async (selectedOption) => {
                                console.log(selectedOption)
                                setCurrentGeopackageLayer(selectedOption)
                                field.onChange(selectedOption); // Notify react-hook-form of the change

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