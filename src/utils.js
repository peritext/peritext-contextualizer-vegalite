import {chooseAppropriateAsset} from 'peritext-utils';
import {View, parse} from 'vega';
import meta from './meta'
import {compile} from 'vega-lite';

export const asyncPrerender = ({
  resource = {},
  contextualizer = {},
  contextualization = {},
  productionAssets = {},
  renderingMode = 'paged'
}) => new Promise((resolve, reject) => {
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
    liteMode = true,
  } = parameters;

  const asset = appropriateAsset.asset;

  let spec;

  try {
    spec = JSON.parse( vegaLiteSpecificationCode );
  }
  catch ( e ) {
    reject(e)
  }
  const finalData = ( asset.data || [] ).map( ( obj ) => Object.keys( obj ).reduce( ( res, key ) => ( {
        ...res,
        [key]: isNaN( +obj[key] ) ? obj[key] : +obj[key]
      } ), {} ) );
  const schemaRef = liteMode ? 'https://vega.github.io/schema/vega-lite/v4.json' : 'https://vega.github.io/schema/vega/v4.json'
  const finalSpec = {
    $schema: schemaRef,
    data: {
      name: 'data',
      values: finalData
    },
    ...spec,
  };
  // create the view
  let view;
  if (liteMode) {
    view = new View(parse(compile(finalSpec).spec), {renderer: 'none'});
  } else {
    view = new View(parse(finalSpec), {renderer: 'none'});

  }
  // generate a static SVG image
  // view.toSVG()
  //   .then(function(svg) {
  //     // process svg string
  //     resolve({svg})
  //   })
  //   .catch(reject);

 // generate a raster PNG image
  view.toCanvas()
    .then(function(canvas) {
      const base64 = canvas.toDataURL();
      // process base64 png string
      resolve({base64})
    })
    .catch(reject);
})