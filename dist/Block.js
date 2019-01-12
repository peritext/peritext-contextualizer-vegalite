"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactVegaLite = _interopRequireDefault(require("react-vega-lite"));

var _meta = _interopRequireDefault(require("./meta"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
          productionAssets
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
        vegaLiteSpecificationCode = ''
        /* eslint camelcase: 0 */

      } = parameters;
      const asset = appropriateAsset.asset;

      const renderContent = () => {
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

            const finalSpec = _objectSpread({}, spec, {
              $schema: 'https://vega.github.io/schema/vegaLite/v3.json',
              data: {
                values: finalData
              }
            });

            return _react.default.createElement(_reactVegaLite.default, {
              spec: finalSpec
            });

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
  productionAssets: _propTypes.default.object
});

var _default = Block;
exports.default = _default;