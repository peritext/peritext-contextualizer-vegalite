"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = {
  id: 'vegaLite',
  type: 'peritext-contextualizer',
  name: 'Vega lite contextualizer',
  acceptedResourceTypes: [{
    type: 'table'
  }],
  asyncPrerender: _utils.asyncPrerender,
  profile: {
    block: {
      mutable: false,
      options: {
        liteMode: {
          type: 'boolean',
          default: true
        },
        vegaLiteSpecificationCode: {
          type: 'string',
          code: true,
          default: `{
  "mark": "circle",
  "encoding": {
    "x": {
      "type": "quantitative",
      "field": "enter a quantative field here"
    },
    "y": {
      "type": "quantitative",
      "field": "enter a quantative field here"
    }
  }
}`
        }
      },
      assetPickingRules: {
        element: {
          screened: ['dataAssetId'],
          paged: ['dataAssetId']
        }
      }
    }
  }
};
exports.default = _default;