"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncPrerender = void 0;

var _peritextUtils = require("peritext-utils");

var _vega = require("vega");

var _meta = _interopRequireDefault(require("./meta"));

var _vegaLite = require("vega-lite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const asyncPrerender = ({
  resource = {},
  contextualizer = {},
  contextualization = {},
  productionAssets = {},
  renderingMode = 'paged'
}) => new Promise((resolve, reject) => {
  const appropriateAsset = (0, _peritextUtils.chooseAppropriateAsset)(resource, _meta.default.profile.block.assetPickingRules.element[renderingMode], productionAssets);
  let field;

  if (appropriateAsset) {
    field = appropriateAsset.resourceDataField;
  } else {
    return null;
  }

  const {
    parameters = {}
  } = contextualizer;
  const {
    vegaLiteSpecificationCode = ''
    /* eslint camelcase: 0 */

  } = parameters;
  const asset = appropriateAsset.asset;
  let spec;

  try {
    spec = JSON.parse(vegaLiteSpecificationCode);
  } catch (e) {
    reject(e);
  }

  const finalData = (asset.data || []).map(obj => Object.keys(obj).reduce((res, key) => _objectSpread({}, res, {
    [key]: isNaN(+obj[key]) ? obj[key] : +obj[key]
  }), {}));

  const finalSpec = _objectSpread({
    $schema: 'https://vega.github.io/schema/vega-lite/v2.json'
  }, spec, {
    data: {
      name: 'data',
      values: finalData
    }
  }); // create the view


  const view = new _vega.View((0, _vega.parse)((0, _vegaLite.compile)(finalSpec).spec), {
    renderer: 'none'
  }); // generate a static SVG image
  // view.toSVG()
  //   .then(function(svg) {
  //     // process svg string
  //     resolve({svg})
  //   })
  //   .catch(reject);
  // generate a raster PNG image

  view.toCanvas().then(function (canvas) {
    const base64 = canvas.toDataURL(); // process base64 png string

    resolve({
      base64
    });
  }).catch(reject);
});

exports.asyncPrerender = asyncPrerender;