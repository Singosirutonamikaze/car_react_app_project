import React, { Component } from 'react';
import { prepareCommandeBarChartData } from '../../../utils/helper';
import CustomBarChart from '../charts/CustomBarChart';

class LastCommandesChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: []
        };
    }

    componentDidMount() {
        this.prepareChartData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.prepareChartData();
        }
    }

    prepareChartData() {
        const { data } = this.props;
        const transactionsData = data?.transactions || data || [];
        
        const result = prepareCommandeBarChartData(transactionsData);
        this.setState({ chartData: result });
    }

    render() {
        return (
            <div className='card col-md-6'>
                <div className='card-header'>
                    <h5 className='card-title'>Dernières commandes des 30 derniers jours</h5>
                </div>
                <div className='card-body'>
                    {this.state.chartData.length > 0 ? (
                        <CustomBarChart data={this.state.chartData} />
                    ) : (
                        <p>Aucune donnée disponible</p>
                    )}
                </div>
            </div>
        );
    }
}

export default LastCommandesChart;