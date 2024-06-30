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
        };
    }

    _fetchLegend(url) {
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
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
}

export { LegendUtil };