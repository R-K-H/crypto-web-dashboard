import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchInput, {createFilter} from 'react-search-input';
import Card from './components/card';

const KEYS_TO_FILTERS = ['name']

export default class Market extends Component {
	constructor(props) {
    super(props)
    
	    this.state = {
	      currencies: [],
	      error: null,
	      changed: false,
	      searchTerm: ''
	    }
	    this.searchUpdated = this.searchUpdated.bind(this)
  	}

  componentDidMount() {
    this.ws = new WebSocket('ws://'+window.location.hostname+'/socket')
    this.ws.onmessage = e => this.setState({ currencies: Object.values(JSON.parse(e.data)) })
    this.ws.onerror = e => this.setState({ error: 'WebSocket error' })
    this.ws.onclose = e => !e.wasClean && this.setState({ error: `WebSocket error: ${e.code} ${e.reason}` })
    fetch('http://'+window.location.hostname+'/v1/market.json')
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
  			 <div className="md-form">
          	<SearchInput className="search-input form-control-lg w-100" onChange={this.searchUpdated} />
          </div>
        </form>
        <div className="row card-deck">
        	{ this.state.searchTerm === '' ? (
        		this.state.currencies.slice(0, 50).map((currency,i) => (
              <Card key={i} parentKey={i} currency={currency}/>
				))):(
        			filteredCurrencies.slice(0, 100).map((currency,i) => (
              <Card key={i} parentKey={i} currency={currency}/>
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

render(<Market />, document.getElementById('app'));