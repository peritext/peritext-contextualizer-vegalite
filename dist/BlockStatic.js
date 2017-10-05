'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVegaLite = require('react-vega-lite');

var _reactVegaLite2 = _interopRequireDefault(_reactVegaLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Block = function (_Component) {
  (0, _inherits3.default)(Block, _Component);

  function Block(props) {
    (0, _classCallCheck3.default)(this, Block);
    return (0, _possibleConstructorReturn3.default)(this, (Block.__proto__ || (0, _getPrototypeOf2.default)(Block)).call(this, props));
  }

  (0, _createClass3.default)(Block, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.resource.data !== nextProps.resource.data || this.props.contextualizer.spec !== nextProps.contextualizer.spec || this.props.contextualizer.thumbnailUrl !== nextProps.contextualizer.thumbnailUrl;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$resource$data = _props.resource.data,
          data = _props$resource$data === undefined ? [] : _props$resource$data,
          _props$contextualizer = _props.contextualizer,
          _props$contextualizer2 = _props$contextualizer.spec,
          spec = _props$contextualizer2 === undefined ? {} : _props$contextualizer2,
          thumbnailUrl = _props$contextualizer.thumbnailUrl;

      var finalSpec = void 0;
      if (thumbnailUrl) {
        return _react2.default.createElement(
          'figure',
          { className: 'peritext-contextualization peritext-contextualization-block peritext-contextualization-web peritext-contextualizer-vegalite' },
          _react2.default.createElement('img', { className: 'contextualizer-thumbnail', src: thumbnailUrl })
        );
      }
      if ((!spec || !(0, _keys2.default)(spec).length) && data.length) {
        var obj = data[0];
        var fields = (0, _keys2.default)(obj);
        finalSpec = {
          "mark": "bar",
          "encoding": {
            "x": {
              "field": fields[0],
              "type": "ordinal"
            },
            "y": {
              "field": fields.length > 1 ? fields[1] : fields[0],
              "type": "ordinal"
            }
          }
        };
      } else finalSpec = spec;
      return _react2.default.createElement(
        'figure',
        { className: 'peritext-contextualization peritext-contextualization-block peritext-contextualization-web peritext-contextualizer-vegalite' },
        _react2.default.createElement(_reactVegaLite2.default, {
          spec: finalSpec,
          data: { values: data },
          renderer: 'svg'
        })
      );
    }
  }]);
  return Block;
}(_react.Component);

exports.default = Block;