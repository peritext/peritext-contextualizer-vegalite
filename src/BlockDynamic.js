import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VegaLite from 'react-vega-lite';
import {get} from 'axios';
import dsv from 'd3-dsv';

class BlockDynamic extends Component {

  static contextTypes = {
    datasets: propTypes.object,
  }

  constructor (props) {
    super(props);
  }

  componentWillMount() {
    this.updateData(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (
        this.props.data !== nextProps.data ||
        getDataset(this.props) !== getDataset(nextProps)
      ) {
      this.updateData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.resource.data !== nextProps.resource.data ||
      this.props.contextualizer.spec !== nextProps.contextualizer.spec
    )
  }

  getDataset = (props) => {
    return this.context && 
           this.context.datasets && 
           this.context.datasets[props.data.dataset]
  }

  formatData = (data, dataset) => {
    switch(dataset.format) {
      case 'csv':
        return dsv.csvParse(data);
      case 'tsv':
        return dsv.tsvParse(data);
      case 'json':
      default:
        return data;
    }
  }

  updateData = (props) => {
    const dataset = this.getDataset(props);
    if (dataset === undefined) {
      return;
    }
    if (dataset.rawData) {
      this.setState({
        loading: false,
        data: dataset.rawData,
        error: undefined,
      })
    } else if (dataset.uri) {
      this.setState({
        loading: true,
        error: undefined,
      });
      axios.get(dataset.uri)
      .then((response) => {
        const data = this.formatData(response.data, dataset);
        this.setState({
          data,
          loading: false,
        })
      })
      .catch((error) => {
        this.setState({
          error
        })
      });
    } else {
      this.setState({
        error: 'no-dataset'
      })
    }
  }

  render() {
    const {
      props: {
        contextualizer: {
          spec = {}
        },
      },
      state: {
        data = []
      }
    } = this;
    let finalSpec;
    if ((!spec || !Object.keys(spec).length) && data.length) {
      const obj = data[0];
      const fields = Object.keys(obj);
      finalSpec = {
        "mark": "bar",
        "encoding" : {
          "x": {
            "field": fields[0],
            "type": "ordinal"
          },
          "y": {
            "field": fields.length > 1 ? fields[1] : fields[0],
            "type": "ordinal"
          },
        }
      }
    } else {
      finalSpec = spec;
    }
    return (
      <figure className="peritext-contextualization peritext-contextualization-block peritext-contextualization-web peritext-contextualizer-vegalite">
        <VegaLite 
          spec={finalSpec} 
          data={{values: data}} 
          renderer="svg"
        />
      </figure>
    );
  }
}



export default BlockDynamic;


