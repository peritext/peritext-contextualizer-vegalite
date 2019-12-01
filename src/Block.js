import React, { Component } from 'react';
import PropTypes from 'prop-types';

import meta from './meta';
import { chooseAppropriateAsset } from 'peritext-utils';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );/* eslint no-new-func : 0 */

const inBrowser = isBrowser();

let VegaLite;
let Vega;
if (inBrowser) {
  VegaLite = require('react-vega').VegaLite;
  Vega = require('react-vega').Vega;
}


class Block extends Component {

  static contextTypes = {
    productionAssets: PropTypes.object,
    preprocessedContextualizations: PropTypes.object,
  }

  componentDidCatch = ( error ) => {
    console.error( 'vega contextualizer crashed with error:', error );/* eslint no-console: 0 */
  }
  render = () => {
    const {
      props: {
        resource,
        contextualizer = {},
        contextualization = {},
        renderingMode
      },
      context: {
        productionAssets,
        preprocessedContextualizations,
      }

    } = this;

    
    const appropriateAsset = chooseAppropriateAsset( resource, meta.profile.block.assetPickingRules.element[renderingMode], productionAssets );
    let field;
    if ( appropriateAsset ) {
      field = appropriateAsset.resourceDataField;
    }
    else {
      return null;
    }

    const {
      parameters = {}
    } = contextualizer;

    const {
      vegaLiteSpecificationCode = '', /* eslint camelcase: 0 */
      liteMode = true
    } = parameters;

    const asset = appropriateAsset.asset;

    const renderContent = () => {
      if (!inBrowser) {
        if (preprocessedContextualizations && preprocessedContextualizations[contextualization.id]) {
          if (preprocessedContextualizations[contextualization.id].svg) {
            return (
              <div dangerouslySetInnerHTML={{__html: preprocessedContextualizations[contextualization.id].svg}} />
            )
          } else if (preprocessedContextualizations[contextualization.id].base64) {
            return (
              <img src={preprocessedContextualizations[contextualization.id].base64} />
            )
          }
          
        }
        return null;
      }    
      switch ( field ) {
        case 'dataAssetId':
          let spec;
          try {
            spec = JSON.parse( vegaLiteSpecificationCode );
          }
          catch ( e ) {
            return (
              <div>
                Invalid vegaLite specification (bad JSON):
                <pre>
                  <code>
                    {vegaLiteSpecificationCode/* eslint camelcase : 0 */}
                  </code>
                </pre>
              </div>
            );
          }
          const finalData = ( asset.data || [] ).map( ( obj ) => Object.keys( obj ).reduce( ( res, key ) => ( {
                ...res,
                [key]: isNaN( +obj[key] ) ? obj[key] : +obj[key]
              } ), {} ) );

          const schemaRef = liteMode ? 'https://vega.github.io/schema/vega-lite/v4.json' : 'https://vega.github.io/schema/vega/v4.json'
          const finalSpec = {
            $schema: schemaRef,
            data: {
              name: 'dataset',
              values: finalData
            },
            ...spec,
          };
          if (liteMode) {
            return (
              <VegaLite
                spec={ finalSpec }
              />
            );
          } else {
            return (
              <Vega
                spec={ finalSpec }
              />
            );
          }
        default:
          return null;
      }
    };
    return (
      <div
        id={ contextualization.id }
        className={ `peritext-contextualization block vegaLite rendering-mode-${renderingMode} asset-field-${field}` }
      >
        {renderContent()}
      </div>
    );

  }
}

export default Block;
