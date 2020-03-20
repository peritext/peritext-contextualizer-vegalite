"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _meta = _interopRequireDefault(require("./meta"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
/* eslint no-new-func : 0 */

const inBrowser = isBrowser();
let VegaLite;
let Vega;

if (inBrowser) {
  VegaLite = require('react-vega').VegaLite;
  Vega = require('react-vega').Vega;
}

class Block extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "componentDidCatch", error => {
      console.error('vega contextualizer crashed with error:', error);
      /* eslint no-console: 0 */
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          resource,
          contextualizer = {},
          contextualization = {},
          renderingMode
        },
        context: {
          productionAssets,
          preprocessedContextualizations
        }
      } = this;
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
        vegaLiteSpecificationCode = '',

        /* eslint camelcase: 0 */
        liteMode = true
      } = parameters;
      const asset = appropriateAsset.asset;

      const renderContent = () => {
        if (!inBrowser || renderingMode === 'paged') {
          if (preprocessedContextualizations && preprocessedContextualizations[contextualization.id]) {
            if (preprocessedContextualizations[contextualization.id].svg) {
              return _react.default.createElement("div", {
                dangerouslySetInnerHTML: {
                  __html: preprocessedContextualizations[contextualization.id].svg
                }
              });
            } else if (preprocessedContextualizations[contextualization.id].base64) {
              return _react.default.createElement("img", {
                src: preprocessedContextualizations[contextualization.id].base64
              });
            }
          }

          return null;
        }

        switch (field) {
          case 'dataAssetId':
            let spec;

            try {
              spec = JSON.parse(vegaLiteSpecificationCode);
            } catch (e) {
              return _react.default.createElement("div", null, "Invalid vegaLite specification (bad JSON):", _react.default.createElement("pre", null, _react.default.createElement("code", null, vegaLiteSpecificationCode
              /* eslint camelcase : 0 */
              )));
            }

            const finalData = (asset.data || []).map(obj => Object.keys(obj).reduce((res, key) => _objectSpread({}, res, {
              [key]: isNaN(+obj[key]) ? obj[key] : +obj[key]
            }), {}));
            const schemaRef = liteMode ? 'https://vega.github.io/schema/vega-lite/v4.json' : 'https://vega.github.io/schema/vega/v4.json'; // retrieve additional data fields if any

            let specData = Array.isArray(spec.data) ? spec.data : [];
            let dataProps = {}; // retrieve additional data props if any

            if (specData.length) {
              dataProps = specData.find(d => d.name === 'data') || {}; // remove additional data element

              specData = specData.filter(d => d.name !== 'data');
            }

            if (liteMode) {
              const finalSpec = _objectSpread({
                $schema: schemaRef
              }, spec, {
                data: _objectSpread({
                  name: 'data',
                  values: finalData
                }, dataProps)
              });

              return _react.default.createElement(VegaLite, {
                spec: finalSpec
              });
            } else {
              const finalSpec = _objectSpread({
                $schema: schemaRef
              }, spec, {
                data: [_objectSpread({
                  name: 'data',
                  values: finalData
                }, dataProps), ...specData]
              });

              return _react.default.createElement(Vega, {
                spec: finalSpec
              });
            }

          default:
            return null;
        }
      };

      return _react.default.createElement("div", {
        id: contextualization.id,
        className: `peritext-contextualization block vegaLite rendering-mode-${renderingMode} asset-field-${field}`
      }, renderContent());
    });
  }

}

_defineProperty(Block, "contextTypes", {
  productionAssets: _propTypes.default.object,
  preprocessedContextualizations: _propTypes.default.object
});

var _default = Block;
exports.default = _default;