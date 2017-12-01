'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  type: 'peritext-contextualizer',
  id: 'vegalite',
  name: 'Vega lite',
  coverage: {
    inlineStatic: false,
    blockStatic: true,
    inlineDynamic: false,
    blockDynamic: true
  },
  model: {
    acceptedResourceTypes: [{ type: 'table' }],
    block: {
      expandable: false,
      options: [{
        type: 'jsonInput',
        id: 'spec',
        title: {
          fr: 'Spécification vega lite',
          en: 'Vega lite specification'
        },
        placeholder: {
          fr: 'Écrire ou coller une spécification vega-lite (tester ici : https://vega.github.io/editor/#/custom/vega-lite)',
          en: 'Write or paste a vega specification (test here : https://vega.github.io/editor/#/custom/vega-lite)'
        }
      }, {
        id: 'thumbnailUrl',
        title: {
          fr: 'Vignette (pour les contextualisations statiques)',
          en: 'Thumbnail (for static contextualizations)'
        },
        type: 'imageUrl'
      }]
    }
  }
};