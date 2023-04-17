import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function Chart({ chart }) {
    const options = {
        chart: {
            type: chart.chart.type,
        },
        title: {
            text: chart.title.text,
            style: {
                color: chart.title.style.color,
            },
        },
        xAxis: {
            categories: chart.xAxis.categories,
            style: {
                color: chart.xAxis.style.color,
            },
        },
        yAxis: {
            title: {
                text: chart.yAxis.title.text,
                style: {
                    color: chart.yAxis.title.style.color,
                },
            },
        },
        labels: {
            style: {
                color: chart.labels.style.color,
            },
        },
        series: chart.series,
    };

    return (
        <div ref={(chartContainer) => { if (chartContainer && chartContainer.chart) { chartContainer.chart.reflow(); } }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}