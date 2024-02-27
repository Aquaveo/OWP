import React, { useState, Fragment, useEffect } from "react";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Controller } from 'react-hook-form';
import { Input } from "components/UI/StyleComponents/Input.styled";
import { previewGeometryFileData } from 'features/RegionsForms/lib/fileUtils'; 
import { useMapContext } from "features/Map/hooks/useMapContext";
import { LoadingText } from "components/UI/StyleComponents/Loader.styled";
import { SelectGeopackageLayerNames } from "./SelectGeopackageLayerNames";
import { previewFileDataOnChangeGeopackageLayer } from '../../../lib/fileUtils';

const GeometryFileInput = ({ isVisible, control, getValues }) => {
    const [geometryLayerRegion, setGeometryLayerRegion] = useState(null);
    const [geopackageLayers, setGeopackageLayers] = useState(null);
    const [currentGeopackageLayer, setCurrentGeopackageLayer] = useState(null)
    const [isLoadingFilePreview, setIsLoadingFilePreview] = useState(false);
    const { actions } = useMapContext();

    useEffect(() => {
        if (!geometryLayerRegion) return;
        console.log(geometryLayerRegion);
        actions.addLayer(geometryLayerRegion);
        setIsLoadingFilePreview(false);
    }, [geometryLayerRegion]);

    useEffect(() => {

        const updateFilePreview = async () => {
            if (currentGeopackageLayer) {
                if (geometryLayerRegion) {
                    actions.removeLayer(geometryLayerRegion);
                }
                const files = getValues('files');
                setIsLoadingFilePreview(true);
                let geometry = await previewFileDataOnChangeGeopackageLayer(currentGeopackageLayer, files)
                console.log(geometry)
                setGeometryLayerRegion(geometry);      
            }
        };
    
        updateFilePreview();

    }, [currentGeopackageLayer]);


    return isVisible ? (
        <Fragment>
            <FormGroup>
                <Label>Upload File (*.shp, *.json, geopackage)</Label>
                <Controller
                    name="files"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value, ref } }) => (
                        <Input
                            size="sm"
                            type="file"
                            multiple
                            onChange={async (e) => {
                                setIsLoadingFilePreview(true);
                                if (geometryLayerRegion) {
                                    actions.removeLayer(geometryLayerRegion);
                                }
                                let geometry = await previewGeometryFileData(e, setGeopackageLayers);
                                setGeometryLayerRegion(geometry);
                                onChange([...e.target.files]);
                            }}
                            ref={ref}
                        />
                    )}
                    rules={{ required: 'Files are required' }}
                />
            </FormGroup>
            {
                !isLoadingFilePreview ?
                    <SelectGeopackageLayerNames geopackageLayers={geopackageLayers} control={control} setCurrentGeopackageLayer={setCurrentGeopackageLayer}/>
                : null
            }
            {isLoadingFilePreview ? <LoadingText>Loading Region Preview ...</LoadingText> : null}

        </Fragment>
    ) : null;
};

export { GeometryFileInput };
