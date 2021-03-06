import React, { useEffect } from 'react'
import classNames from 'classnames'
import { Line, Bar } from 'react-chartjs-2'
import { Button, ButtonGroup, Card, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import config from 'config'
import * as chartConfigs from '../../components/Charts/config'
import { chartExample1, chartExample2, chartExample3 } from './Charts'

const Dashboard: React.FC = () => {
  const [bigChartData, chartData] = React.useState({})
  const setBgChartData = (name) => {
    chartData(name)
  }
  const chart = () => {
    const now = +new Date() / 1000
    const from = new Date().setDate(new Date().getDate() - 89) / 1000

    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/passive-income/market_chart/range?vs_currency=usd&from=${from}&to=${now}`,
      )
      .then((res) => {
        const labels = res.data.prices.map((data) => {
          const date = new Date(data[0])
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        })

        const prices = res.data.prices.map((data) => {
          return data[1]
        })

        chartData({
          bigLineChart: {
            allData: [
              [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
              [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
              [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
            ],
            activeIndex: 0,
            chartData: {
              datasets: [{}],
              labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            },
            extraOptions: chartConfigs.purpleChartOptions,
            gradientColors: config.colors.primaryGradient,
            gradientStops: [1, 0.4, 0],
            categories: [],
          },
          datasets: [
            {
              fill: false,
              backgroundColor: '#1f8ef1',
              borderColor: '#42b883',
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: '#42b883',
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#42b883',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 1,
              data: prices,
              extraOptions: chartConfigs.purpleChartOptions,
              gradientColors: config.colors.primaryGradient,
              gradientStops: [1, 0.4, 0],
              categories: [],
            },
          ],
          labels,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    chart()
  }, [])

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card className="card-chart">
            <Card.Header>
              <Row>
                <Col className="text-left" sm="6">
                  <h5 className="card-category">Market Prices</h5>
                  <Card.Title>PSI</Card.Title>
                </Col>
                <Col sm="6">
                  <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
                    <Button
                      className={classNames('btn-simple', {
                        active: bigChartData,
                      })}
                      color="info"
                      id="0"
                      size="sm"
                      onClick={() => setBgChartData}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Overall</span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-single-02" />
                      </span>
                    </Button>
                    <Button
                      color="info"
                      id="1"
                      size="sm"
                      className={classNames('btn-simple', {})}
                      onClick={() => setBgChartData}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Active</span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-gift-2" />
                      </span>
                    </Button>
                    <Button
                      color="info"
                      id="2"
                      size="sm"
                      className={classNames('btn-simple', {})}
                      onClick={() => setBgChartData}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Ended</span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-tap-02" />
                      </span>
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="chart-area">
                <Line data={bigChartData} options={chartExample1.options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="4">
          <Card className="card-chart">
            <Card.Header>
              <h5 className="card-category">Total Funded</h5>
              <Card.Title>
                <i className="tim-icons icon-bell-55 text-info" /> 763.28 ETH
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="chart-area">
                <Line data={chartExample2.data} options={chartExample2.options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4">
          <Card className="card-chart">
            <Card.Header>
              <h5 className="card-category">Launch Your Project</h5>
              <Card.Title>
                <i className="tim-icons icon-delivery-fast text-primary" /> How it Works
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </div>
              <button type="button" className="btn center btn-primary" slot="footer">
                Launch
              </button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4">
          <Card className="card-chart">
            <Card.Header>
              <h5 className="card-category">Completed Projects</h5>
              <Card.Title>
                <i className="tim-icons icon-send text-success" /> 32
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="chart-area">
                <Bar data={chartExample3.data} options={chartExample3.options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
