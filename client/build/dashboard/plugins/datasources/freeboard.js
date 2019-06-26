(function () {

    const TYPE_INFO = {
        type: "wms-datasource",
        name: "WMS Datasource",
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
                id: "agvIndex",
                name: "AGV Index",
                defaultValue: "0",
                type: "number"
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

            const request = new Request(window.location.href.replace(window.location.hash, '').replace('/datasource.html', '/') + '/api/methods?login=%228c46b255e370acbdf61c5b47e4696dfa%22&password=%22982063ae578804d3c36ae646ffaecb64%22&encrypted=true&model=%22wcs.job%22&ids=%5B%5D&method=%22get_agv_status%22&args=%5B%5D', {
                //mode: "no-cors"
            })
            fetch(request)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    resolve(data.method_result[parseInt(this.props.state.settings.agvIndex)])
                })
        }
    }

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);

})();
