const LegendUtil = class {
    constructor() {
        this.resourceCache = {};
        this.matcherDict = {
            '> 1.25M,': 'High',
            '500K - 1.25M,': '',
            '100K - 500K,': '',
            '50K - 100K,': '',
            '25K - 50K,': '',
            '10K - 25K,': 'Normal',
            '5K - 10K,': '',
            '2.5K - 5K,': '',
            '0 - 250,': 'Low',
            'No Data,   (Typically, an intersection with a lake or reservoir.)': 'No Data'
        },
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

    processStreamAnomalyLegendData(data, layerIndex){
        return data.layers[layerIndex].legend
            .filter(portion => portion.label.includes('Stream Order: 10'))
            .map(portion => ({
                src: `data:image/png;base64,${portion.imageData}`,
                label: this.matcherDict[portion.label.split('Stream Order: 10').join('').trim()]
            }));
    }
}

export { LegendUtil };