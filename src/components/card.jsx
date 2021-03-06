import React, { Component } from 'react';
import { render } from 'react-dom';
import ChartJS from 'react-chartjs-wrapper';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import LazyLoad from 'react-lazyload';

class Card extends Component {
  constructor(props) {
    super(props)
    
    let data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [{
        label: 'price',
        data: [10, 20, 30, 10, 23, 24, 27, 19, 20,21,30,29,27,18,13,10,12,14],
      }]
    }
    let options = {
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        scaleShowVerticalLines: false,
        showScale: false,
        responsive: true,
        scaleShowLabels: false,
        maintainAspectRatio: false,
        legend: {
            display: false
         },
         tooltips: {
            enabled: false
         },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
                display: false
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
                display: false
            }
          }]
        }
    }
    this.state = {
      changed: false,
      data: data,
          type: 'line',
          options: options
    }
  }
handleChange(evt) {
    //input was changed, update component state (or call parent method if child)
    this.setState({changed: true});
  }

 render() {
  return (
    <LazyLoad key={this.props.parentKey} height={180}>
          <div className="col-lg-3 col-md-6 mb-r" key={this.props.parentKey}>
          <div className="card card-cascade narrower">
            <div className="view gradient-card-header blue-gradient">
              <h2 className="text-white dropdown h2-responsive">
              <a className="dropdown-toggle" data-toggle="collapse" href={'#'+this.props.currency.id} aria-expanded="false" aria-controls={this.props.currency.id}>
                {this.props.currency.name}
              </a>
            </h2>
            </div>
            <div className="card-body">
              <h6 className="card-title">Price</h6>
              <h1 className="card-title text-center">{this.props.currency.price_usd < 1 ? currencyFormatter.format(this.props.currency.price_usd, { precision: 4, code: 'USD' }) : currencyFormatter.format(this.props.currency.price_usd, { code: 'USD' })}</h1>
            </div>
            <div className="collapse" id={this.props.currency.id}>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><h6>Market Cap</h6> {currencyFormatter.format(this.props.currency.market_cap_usd, { code: 'USD' })}</li>
                <li className="list-group-item"><h6>24hr Volume</h6> {currencyFormatter.format(this.props.currency['24h_volume_usd'], {symbol: '',decimal: '.',thousand: ',',precision: 2,format: '%v'})}</li>
                <li className="list-group-item"><h6>1Hour Change</h6> {this.props.currency.percent_change_1h}%</li>
                <li className="list-group-item"><h6>24Hour Change</h6> {this.props.currency.percent_change_24h}%</li>
                <li className="list-group-item"><h6>7Hour Change</h6> {this.props.currency.percent_change_7d}%</li>
              </ul>
              <div className="card-body" style={{height:100 +'px', width: 'content-box'}}>
                <ChartJS type={this.state.type} data={this.state.data} options={this.state.options}/>
                </div>
              <div className="card-footer text-muted text-center">
                <span className="card-text">{moment.unix(this.props.currency.last_updated).format('MMM D YYYY H:mm')}</span>
              </div>
            </div>
          </div>
        </div>
        </LazyLoad>
      )
  }
}


export default Card;
