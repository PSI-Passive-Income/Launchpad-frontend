import React, {useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import {Line, Bar, Bubble} from "react-chartjs-2";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";
import ApexCharts from 'apexcharts'

// core components
import {
    chartExample1,
    chartExample2,
    chartExample3,
} from "variables/charts.js";
import axios from "axios";
import config from "config";
import * as chartConfigs from "../components/Charts/config";


function Dashboard(props) {
    const [bigChartData, chartData] = React.useState({});
    const setBgChartData = (name) => {
        chartData(name);
    };
    const chart = () => {
        const now = (+new Date()) / 1000;
        const from = (new Date().setDate(new Date().getDate() - 89)) / 1000;

        console.log(now);
        console.log(from)
        axios.get(`https://api.coingecko.com/api/v3/coins/passive-income/market_chart/range?vs_currency=usd&from=` + from + `&to=` + now)
            .then(res => {
                console.log("response", res);
                const labels = res.data.prices.map(function (data) {
                    const date = new Date(data[0]);
                    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                });

                const prices = res.data.prices.map(function (data) {
                    return data[1];
                });

                console.log(labels);
                console.log(prices);

                chartData({
                    bigLineChart: {
                        allData: [
                            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
                            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
                            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
                        ],
                        activeIndex: 0,
                        chartData: {
                            datasets: [{}],
                            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                        },
                        extraOptions: chartConfigs.purpleChartOptions,
                        gradientColors: config.colors.primaryGradient,
                        gradientStops: [1, 0.4, 0],
                        categories: []
                    },
                    datasets: [
                        {
                            fill: false,
                            backgroundColor: "#1f8ef1",
                            borderColor: "#42b883",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#42b883",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#42b883",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 1,
                            data: prices,
                            extraOptions: chartConfigs.purpleChartOptions,
                            gradientColors: config.colors.primaryGradient,
                            gradientStops: [1, 0.4, 0],
                            categories: []
                        }],
                    labels: labels,

                })
            })
            .catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        chart();
    }, []);

    return (
        <>
            <div className="content">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row>
                                    <Col className="text-left" sm="6">
                                        <h5 className="card-category">Market Prices</h5>
                                        <CardTitle tag="h2">PSI</CardTitle>
                                    </Col>
                                    <Col sm="6">
                                        <ButtonGroup
                                            className="btn-group-toggle float-right"
                                            data-toggle="buttons">
                                            <Button
                                                tag="label"
                                                className={classNames("btn-simple", {
                                                    active: bigChartData,
                                                })}
                                                color="info"
                                                id="0"
                                                size="sm"
                                                onClick={() => setBgChartData}>
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Overall
                        </span>
                                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02"/>
                        </span>
                                            </Button>
                                            <Button
                                                color="info"
                                                id="1"
                                                size="sm"
                                                tag="label"
                                                className={classNames("btn-simple", {})}
                                                onClick={() => setBgChartData}
                                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Active
                        </span>
                                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2"/>
                        </span>
                                            </Button>
                                            <Button
                                                color="info"
                                                id="2"
                                                size="sm"
                                                tag="label"
                                                className={classNames("btn-simple", {})}
                                                onClick={() => setBgChartData}
                                            >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Ended
                        </span>
                                                <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02"/>
                        </span>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={bigChartData}
                                        options={chartExample1.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Total Funded</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-bell-55 text-info"/> 763.28 ETH
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample2.data}
                                        options={chartExample2.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Launch Your Project</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-delivery-fast text-primary"/>{" "}
                                    How it Works
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                    unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </div>
                                <button type="button" className="btn center btn-primary" slot="footer" fill="">
                                    Launch
                                </button>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Completed Projects</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-send text-success"/> 32
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Bar
                                        data={chartExample3.data}
                                        options={chartExample3.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Dashboard;
