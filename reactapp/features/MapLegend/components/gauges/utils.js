const LegendUtil = class {
    constructor() {
        this.resourceCache = {},
        this.TIMEOUT_DURATION = 5000; // Timeout duration in milliseconds

    }

    _fetchLegend(url) {
        return Promise.race([
            fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), this.TIMEOUT_DURATION)
            )
        ]).catch(error => {
            console.error('Fetch legend failed:', error);
            throw error; // Re-throw the error after logging it
        });
    }

    createResource(url) {
        if (!this.resourceCache[url]) {
            let status = 'pending';
            let result;
            let suspender = this._fetchLegend(url).then(
                r => {
                    status = 'success';
                    result = r;
                },
                e => {
                    status = 'error';
                    result = e;
                }
            );

            this.resourceCache[url] = {
                read() {
                    if (status === 'pending') {
                        throw suspender;
                    } else if (status === 'error') {
                        throw result;
                    }
                    return result;
                }
            };
        }
        return this.resourceCache[url];
    }

    processGaugeLegendData(data, layerIndex){
        // return data.layers
        return data.layers[layerIndex].legend
            .map(portion => ({
                src: `data:image/png;base64,${portion.imageData}`,
                label: portion.label
            }));
    }
}

export { LegendUtil };