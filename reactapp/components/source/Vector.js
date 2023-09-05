import VectorSource from 'ol/source/Vector.js';
export const VectorSourceLayer = (features) => {
  return new VectorSource({
    features  
});
};

// new VectorSource({
//   features: [
//     new Feature({
//       geometry: new LineString(currentReachIdGeometry),
//       name: "myid"
//     })
//   ]
  
//    // make sure features is an array
// })