import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts/lib/echarts';
import CSSModule from 'react-css-modules';
import 'echarts/lib/chart/graph';
import getOption from './chartConfig';
import style from './mapGraph.scss';
import { redirect } from '../../utils/history';
import bebounceDecorator from '../../utils/debounce';
import { getProfessionInfo } from '../../actions/profession';

const step = 0.1;

const mapDispatchToProps = dispatch => {
  return {
    getProfessionInfo(id) {
      dispatch(getProfessionInfo(id));
    },
  };
};
@connect(null, mapDispatchToProps)
@CSSModule(style)
class MapGraph extends React.Component {
  constructor(props) {
    super(props);
    this.mapContainerRef = React.createRef();
    this.valueSpan = React.createRef();
  }

  componentDidMount() {
    this.renderGraph();
    window.onresize = () => {
      this.renderGraph();
    };
  }
  componentDidUpdate() {
    this.renderGraph();
  }
  componentWillUnmount() {
    window.onresize = null;
  }
  getChartZoom() {
    const option = this.chart.getOption();
    const { zoom } = option.series[0];
    return zoom;
  }
  setChartZoom(value) {
    const option = this.chart.getOption();
    option.series[0].zoom = value;
    this.renderGraph(option);
    this.renderSpan(value);
  }
  handleZoomOut() {
    const zoom = this.getChartZoom() + step;
    this.setChartZoom(zoom);
  }
  handleZoomIn() {
    const zoom = this.getChartZoom() - step;
    this.setChartZoom(zoom);
  }
  renderSpan(value) {
    this.valueSpan.current.innerHTML = `${Math.round(value * 100)}%`;
  }
  @bebounceDecorator(200)
  renderGraph(overRideOption) {
    const { masterField, scholarItem, fieldItem, skills, skilledProfessionals, getProfessionInfo } = this.props;
    const $container = this.mapContainerRef.current;
    echarts.dispose($container);
    const chart = echarts.init($container);
    chart.setOption(overRideOption || getOption(scholarItem, fieldItem, skills, skilledProfessionals));
    chart.on('click', params => {
      const { professionId } = params.data;
      if (professionId) {
        if (!masterField) {
          redirect(`/index/atlaslist/${encodeURIComponent(professionId)}`);
        } else {
          getProfessionInfo({ masterScholar: professionId });
        }
      }
    });
    chart.on('mousemove', params => {
      const { professionId } = params.data;
      if (professionId) {
        chart.getZr().setCursorStyle('pointer');
      } else {
        chart.getZr().setCursorStyle('default');
      }
    });
    chart.on('graphRoam', () => {
      /* eslint-disable */
      const zoom = chart._coordSysMgr._coordinateSystems[0]._zoom
      this.renderSpan(zoom)
      /* esint-enable */
    })
    this.chart = chart
  }


  render() {
    return (
      <div styleName="map-graph-box">
        <div
          ref={this.mapContainerRef}
          styleName="chart-instance"
        />
        <div styleName="zoom-controll">
          <button styleName="zoom" onClick={() => { this.handleZoomOut() }}>+</button>
          <span ref={this.valueSpan} styleName="value">100%</span>
          <button styleName="zoom" onClick={() => { this.handleZoomIn() }}>-</button>
        </div>
      </div>)
  }
}


export default MapGraph
