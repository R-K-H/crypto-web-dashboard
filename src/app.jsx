import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import SearchInput, {createFilter} from 'react-search-input';
import LazyLoad from 'react-lazyload';
import ChartJS from 'react-chartjs-wrapper';

const KEYS_TO_FILTERS = ['name']

export default class Hello extends Component {
	constructor(props) {
    super(props)
    let data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [{
      	label: 'price',
        data: [10, 20, 30, 10, 23, 24, 27, 19, 20,21,30,29,27,18,13,10,12,14],
      }]
    };
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
    };
	    this.state = {
	      currencies: [],
	      error: null,
	      changed: false,
	      searchTerm: '',
	      data: data,
      	  type: 'line',
      	  options: options
	    }
	    this.searchUpdated = this.searchUpdated.bind(this)
  	}

  componentDidMount() {
    this.ws = new WebSocket('ws://0.0.0.0/socket')
    this.ws.onmessage = e => this.setState({ currencies: Object.values(JSON.parse(e.data)) })
    this.ws.onerror = e => this.setState({ error: 'WebSocket error' })
    this.ws.onclose = e => !e.wasClean && this.setState({ error: `WebSocket error: ${e.code} ${e.reason}` })
    fetch('http://0.0.0.0/v1/market.json')
    .then(results => {
    	return results.json();
    })
    .then(data => {
    	this.setState({currencies: data})
    })
  }

  componentWillUnmount() {
    this.ws.close()
  }
  handleChange(evt) {
    //input was changed, update component state (or call parent method if child)
    this.setState({changed: true});
	}



  render() {
  	var filteredCurrencies = this.state.currencies.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    return (
      <div>
        <h1>Cryptocurrency Markets</h1>
        {this.state.error && 
          <div className="alert alert-danger">
            <a onClick={() => this.setState({ error: null })} className="pull-right">x</a>
            {this.state.error}
          </div>}
          <form>
  			<div className="form-group">
          	<SearchInput className="search-input form-control-lg w-100" onChange={this.searchUpdated} />
          	</div>
          	</form>
        <div className="row">
        	{ this.state.searchTerm === '' ? (
        		this.state.currencies.slice(0, 50).map((currency,i) => (
        <LazyLoad key={i}>
        	<div className="col-sm-6 col-md-4" key={i}>
		    	<div className="card m-3">
		    		<div className="card-header bg-success text-white">{currency.name}</div>
		    		<div className="card-body">
		    			<h6 className="card-title">Price</h6>
		    			<h1 className="card-title text-center">{currency.price_usd < 1 ? currencyFormatter.format(currency.price_usd, { precision: 4, code: 'USD' }) : currencyFormatter.format(currency.price_usd, { code: 'USD' })}</h1>
		    		</div>
		    		<ul className="list-group list-group-flush">
					    <li className="list-group-item"><h6>Market Cap</h6> {currencyFormatter.format(currency.market_cap_usd, { code: 'USD' })}</li>
					    <li className="list-group-item"><h6>24hr Volume</h6> {currencyFormatter.format(currency['24h_volume_usd'], {symbol: '',decimal: '.',thousand: ',',precision: 2,format: '%v'})}</li>
					    <li className="list-group-item"><h6>1Hour Change</h6> {currency.percent_change_1h}%</li>
					    <li className="list-group-item"><h6>24Hour Change</h6> {currency.percent_change_24h}%</li>
					    <li className="list-group-item"><h6>7Hour Change</h6> {currency.percent_change_7d}%</li>
					  </ul>
					  <div className="card-body" style={{height:100 +'px', width: 'content-box'}}><ChartJS type={this.state.type} options={this.state.options} data={this.state.data} /></div>
		    		<div className="card-footer text-muted text-center">
		    			<span className="card-text" onChange={this.handleChange}>{moment.unix(currency.last_updated).format('MMM D YYYY H:mm')}</span>
		    		</div>
		    	</div>
		    </div>
		   </LazyLoad>
				))):(
        			filteredCurrencies.slice(0, 100).map((currency,i) => (
        <LazyLoad key={i}>
        	<div className="col-sm-6 col-md-4" key={i}>
		    	<div className="card m-3">
		    		<div className="card-header bg-success text-white">{currency.name}</div>
		    		<div className="card-body">
		    			<h6 className="card-title">Price</h6>
		    			<h1 className="card-title text-center">{currencyFormatter.format(currency.price_usd, { code: 'USD' })}</h1>
		    		</div>
		    		<ul className="list-group list-group-flush">
					    <li className="list-group-item"><h6>Market Cap</h6> {currencyFormatter.format(currency.market_cap_usd, { code: 'USD' })}</li>
					    <li className="list-group-item"><h6>24hr Volume</h6> {currencyFormatter.format(currency['24h_volume_usd'], {symbol: '',decimal: '.',thousand: ',',precision: 2,format: '%v'})}</li>
					    <li className="list-group-item"><h6>1Hour Change</h6> {currency.percent_change_1h}%</li>
					    <li className="list-group-item"><h6>24Hour Change</h6> {currency.percent_change_24h}%</li>
					    <li className="list-group-item"><h6>7Hour Change</h6> {currency.percent_change_7d}%</li>
					  </ul>
					  <div className="card-body" style={{height:100 +'px', width: 'content-box'}}><ChartJS type={this.state.type} data={this.state.data} options={this.state.options}/></div>
		    		<div className="card-footer text-muted text-center">
		    			<span className="card-text" onChange={this.handleChange}>{moment.unix(currency.last_updated).format('MMM D YYYY H:mm')}</span>
		    		</div>
		    	</div>
		    </div>
		    </LazyLoad>
			)))
		}
        </div>
      </div>
    )
  }
  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
}

render(<Hello />, document.getElementById('app'));