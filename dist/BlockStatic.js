'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactVegaLite = require('react-vega-lite');

var _reactVegaLite2 = _interopRequireDefault(_reactVegaLite);

var _axios = require('axios');

var _d3Dsv = require('d3-dsv');

var _d3Dsv2 = _interopRequireDefault(_d3Dsv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockStatic = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(BlockStatic, _Component);

  function BlockStatic(props) {
    (0, _classCallCheck3.default)(this, BlockStatic);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BlockStatic.__proto__ || (0, _getPrototypeOf2.default)(BlockStatic)).call(this, props));

    _initialiseProps.call(_this);

    return _this;
  }

  (0, _createClass3.default)(BlockStatic, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateData(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.data !== nextProps.data || getDataset(this.props) !== getDataset(nextProps)) {
        this.updateData(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.resource.data !== nextProps.resource.data || this.props.contextualizer.spec !== nextProps.contextualizer.spec || this.props.contextualizer.thumbnailDataset !== nextProps.contextualizer.thumbnailDataset;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$contextualizer = this.props.contextualizer,
          _props$contextualizer2 = _props$contextualizer.spec,
          spec = _props$contextualizer2 === undefined ? {} : _props$contextualizer2,
          thumbnailDataset = _props$contextualizer.thumbnailDataset,
          _state$data = this.state.data,
          data = _state$data === undefined ? [] : _state$data,
          datasets = this.context.datasets;


      var thumbnail = datasets[thumbnailDatasets];

      if (thumbnail) {
        return _react2.default.createElement(
          'figure',
          { className: 'peritext-contextualization peritext-contextualization-block peritext-contextualization-web peritext-contextualizer-vegalite' },
          _react2.default.createElement('img', { className: 'contextualizer-thumbnail', src: thumbnail.uri })
        );
      }
      var finalSpec = void 0;
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
      } else {
        finalSpec = spec;
      }
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
  return BlockStatic;
}(_react.Component), _class.contextTypes = {
  datasets: propTypes.object
}, _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.getDataset = function (props) {
    return _this2.context && _this2.context.datasets && _this2.context.datasets[props.data.dataset];
  };

  this.formatData = function (data, dataset) {
    switch (dataset.format) {
      case 'csv':
        return _d3Dsv2.default.csvParse(data);
      case 'tsv':
        return _d3Dsv2.default.tsvParse(data);
      case 'json':
      default:
        return data;
    }
  };

  this.updateData = function (props) {
    var dataset = _this2.getDataset(props);
    if (dataset === undefined) {
      return;
    }
    if (dataset.rawData) {
      _this2.setState({
        loading: false,
        data: dataset.rawData,
        error: undefined
      });
    } else if (dataset.uri) {
      _this2.setState({
        loading: true,
        error: undefined
      });
      axios.get(dataset.uri).then(function (response) {
        var data = _this2.formatData(response.data, dataset);
        _this2.setState({
          data: data,
          loading: false
        });
      }).catch(function (error) {
        _this2.setState({
          error: error
        });
      });
    } else {
      _this2.setState({
        error: 'no-dataset'
      });
    }
  };
}, _temp);
exports.default = BlockStatic;