import React, {Component} from 'react';
import VegaLite from 'react-vega-lite';


export default class Block extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.resource.data !== nextProps.resource.data ||
      this.props.contextualizer.spec !== nextProps.contextualizer.spec
    )
  }
  render() {
    const {
      resource: {
        data = []
      },
      contextualizer: {
        spec = {
        }
      },
      // contextualization
    } = this.props;
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
    } else finalSpec = spec;
    return <figure className="peritext-contextualization peritext-contextualization-block peritext-contextualization-web peritext-contextualizer-vegalite">
              <VegaLite 
                spec={finalSpec} 
                data={{values: data}} 
                renderer="svg"
              />
            </figure>

  }
}
