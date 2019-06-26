(function () {

    const TYPE_INFO = {
        type: "json-datasource",
        name: "JSON Datasource",
        version: "0.0.1",
        author: "Farrell Rafi",
        kind: "datasource",
        description: "Fetch parsed data from a REST API",
        settings: [
            {
                id: "fetchInterval",
                name: "Fetch Interval",
                description: "How ofter should data be fetched in ms",
                defaultValue: "1000",
                type: "number"
            },
            {
                id: "baseUrl",
                name: "Base Url (trailing slash)",
                description: "REST API Url",
                required: true,
                type: "string"
            }
        ]
    };

    class Datasource {

        initialize(props) {
            if (props.state.settings.fetchInterval) {
                props.setFetchInterval(props.state.settings.fetchInterval);
            }
        }

        datasourceWillReceiveSettings(nextSettings) {
            if (nextSettings.fetchInterval) {
                this.props.setFetchInterval(nextSettings.fetchInterval);
            }
        }

        getLatestRecivedAt() {

        }

        fetchData(resolve, reject) {

            const settings = this.props.state.settings;
            let receivedAfter = null;

            const request = new Request(settings.baseUrl, {
                //mode: "no-cors"
            })
            fetch(request)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    resolve(data)
                })
        }
    }

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);

})();
