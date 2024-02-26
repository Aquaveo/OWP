import React, { useState, Fragment, useEffect } from "react";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Controller } from 'react-hook-form';
import { Input } from "components/UI/StyleComponents/Input.styled";
import { previewGeometryFileData } from 'features/RegionsForms/lib/fileUtils'; 
import { useMapContext } from "features/Map/hooks/useMapContext";
import { LoadingText } from "components/UI/StyleComponents/Loader.styled";

const GeometryFileInput = ({ isVisible, control }) => {
    const [geometryLayerRegion, setGeometryLayerRegion] = useState(null);
    const [isLoadingFilePreview, setIsLoadingFilePreview] = useState(false);
    const { actions } = useMapContext();

    useEffect(() => {
        if (!geometryLayerRegion) return;
        actions.addLayer(geometryLayerRegion);
        setIsLoadingFilePreview(false);
    }, [geometryLayerRegion]);

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
                                let geometry = await previewGeometryFileData(e);
                                setGeometryLayerRegion(geometry);
                                onChange([...e.target.files]);
                            }}
                            ref={ref}
                        />
                    )}
                    rules={{ required: 'Files are required' }}
                />
            </FormGroup>
            {isLoadingFilePreview ? <LoadingText>Loading Region Preview ...</LoadingText> : null}
        </Fragment>
    ) : null;
};

export { GeometryFileInput };
