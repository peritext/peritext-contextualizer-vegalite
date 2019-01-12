import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VegaLite from 'react-vega-lite';

import meta from './meta';
import { chooseAppropriateAsset } from 'peritext-utils';

class Block extends Component {

  static contextTypes = {
    productionAssets: PropTypes.object,
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
      } = parameters;

      const asset = appropriateAsset.asset;

      const renderContent = () => {
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

            const finalSpec = {
              ...spec,
              $schema: 'https://vega.github.io/schema/vegaLite/v3.json',
              data: {
                values: finalData
              }
            };
            return (
              <VegaLite
                spec={ finalSpec }
              />
            );
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
