import { useLayer } from "features/Map/hooks/useManageLayers";
import { Fragment } from "react";
import { useMapContext } from "features/Map/hooks/useMapContext";

const Layers= ({ layers }) => {
  const {state} = useMapContext();

  layers.forEach(layer => {
    useLayer(layer);
  });
 

  return (
    <Fragment>
      {state.layers.map((layer, index) => {
        return (
          <>
            {layer}
          </>
        );
      })}
    </Fragment>
  );
};
export default Layers;