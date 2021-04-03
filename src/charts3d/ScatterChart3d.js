import BasicChart from '../charts/BasicChart';
import {Scatter3DChart} from 'echarts-gl/charts';
import {Grid3DComponent} from 'echarts-gl/components';
BasicChart.echarts.use([
  Scatter3DChart,
  Grid3DComponent
]);

export default class ScatterChart3d extends BasicChart {
  constructor(elem, option, basicConfig) {
    super(elem, basicConfig);
    this._seriesEncode = basicConfig.seriesEncode;
    // this.chartId = this._priority + '-scatter3d';
    this._showLoading();
    BasicChart.queue.push(this._priority, async () => {
      await this._initialize(option);
      this._hideLoading();
    });
  }

  async _initialize(option) {
    this._setOption(option);
    console.log(this._getOption());
    const layoutConfig = this._getLayoutConfig(option);
    layoutConfig.is3d = true;
    this._setBasicOption(layoutConfig);
    this._setOption(this._createScatter3dBasicOption());
    this._switchDarkMode();
    this._setBoxSize();
    this._setBasicToolbox();
    this._setSeries();
    console.log(this._getOption());
  }

  _update(option) {
    this._setOption(option);
  }

  _resize() {
    super._resize();
    this._setBoxSize();
  }

  _setBoxSize() {
    const domWidth = this._chart.getWidth();
    const domHeight = this._chart.getHeight();
    this._setOption({
      grid3D: {
        boxWidth: domWidth / 5,
        boxDepth: Math.min(domWidth / 5, domHeight / 5),
        boxHeight: domHeight / 5
      }
    });
  }

  _createScatter3dBasicOption() {
    const {foregroundColor} = this._getColors();
    return {
      grid3D: {
        viewControl: {
          projection: 'orthographic',
          orthographicSize: 160,
          maxOrthographicSize: 160,
          minOrthographicSize: 160
        }
      },
      xAxis3D: {
        type: 'category',
        ...this._createAxisOption()
      },
      yAxis3D: this._createAxisOption(),
      zAxis3D: this._createAxisOption(),
      legend: {
        selectedMode: 'multiple'
      },
      toolbox: {
        feature: {
          myRestore: {
            title: '恢复默认视角',
            onclick: () => this._changeViewAngle(20, 30),
            // eslint-disable-next-line max-len
            icon: 'M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795z'
          },
          myXY: {
            title: 'X-Y平面',
            onclick: () => this._changeViewAngle(89.99, -0.01),
            // eslint-disable-next-line max-len
            icon: 'M0,0 m 5,3 v 16 h 16 v 2 H 3 V 3 ZM0,0 m 20.96515,18.481146 -2.125062,-0.0075 -0.965257,-1.706036 -1.010152,1.713519 h -2.020305 l 2.072683,-3.037941 -1.878136,-2.678774 2.057719,0.0075 0.867982,1.5489 0.853018,-1.563865 1.945479,0.0075 -1.83324,2.693739 zM0,0 m 5.4950117,2.9953099 h 1.9529615 l 0.9577743,2.1100965 0.9877046,-2.1100965 1.9230309,0.00748 -2.0427529,3.6066188 v 2.1026164 h -1.765896 l 0.00748,-2.0951312 z'
          },
          myXZ: {
            title: 'X-Z平面',
            onclick: () => this._changeViewAngle(0, 0),
            // eslint-disable-next-line max-len
            icon: 'm 5,3 v 16 h 16 v 2 H 3 V 3 Z M0,0 m 5.6503321,3.0464055 4.8337659,0.00748 v 1.272044 L 7.8053242,7.2965288 h 2.8059788 l 0.0075,1.4591093 -5.1106226,0.00748 V 7.3938028 L 8.1644895,4.5129974 H 5.6578147 ZM0,0 m 20.922822,18.39649 -2.125062,-0.0075 -0.965257,-1.706036 -1.010152,1.713519 h -2.020305 l 2.072683,-3.037941 -1.878136,-2.678775 2.057719,0.0075 0.867982,1.548901 0.853018,-1.563866 1.945479,0.0075 -1.83324,2.69374 z'
          },
          myYZ: {
            title: 'Y-Z平面',
            onclick: () => this._changeViewAngle(0, 90),
            // eslint-disable-next-line max-len
            icon: 'M0,0 m 5,3 v 16 h 16 v 2 H 3 V 3 ZM0,0 m 15.12101,12.718362 h 1.952962 l 0.957774,2.110096 0.987705,-2.110096 1.923031,0.0075 -2.042753,3.606619 v 2.102614 h -1.765896 l 0.0075,-2.095131 zM0,0 m 5.7561531,3.0252416 4.8337649,0.00748 v 1.272044 L 7.9111451,7.2753649 h 2.8059779 l 0.0075,1.4591093 -5.1106219,0.00748 V 7.3726389 l 2.656309,-2.8808054 h -2.506675 z'
          }
        }
      },
      tooltip: {
        show: true,
        formatter(params) {
          const {dimensionNames, encode, value} = params;
          const {x: [x], y: [y], z: [z]} = encode;
          return `
            X-${dimensionNames[x]}: ${value[x]}<br>
            Y-${dimensionNames[y]}: ${value[y]}<br>
            Z-${dimensionNames[z]}: ${value[z]}
          `;
        }
      }
    };
  }

  _changeViewAngle(alpha, beta) {
    this._setOption({
      grid3D: {
        viewControl: {
          alpha,
          beta
        }
      }
    });
  }

  _switchDarkMode() {
    super._switchDarkMode();
    const {
      foregroundColor,
      backgroundColor,
      subBackgroundColor
    } = this._getColors();
    const textColor = foregroundColor + '80';
    const option = {};
    ['xAxis3D', 'yAxis3D', 'zAxis3D'].forEach((axis) => {
      option[axis] = {
        nameTextStyle: {
          color: textColor,
        },
        splitArea: {
          areaStyle: {
            color: [backgroundColor, subBackgroundColor]
          }
        },
        axisPointer: {
          lineStyle: {
            color: foregroundColor
          }
        },
        axisLine: {
          lineStyle: {
            color: foregroundColor
          }
        },
        axisLabel: {
          textStyle: {
            color: textColor,
          }
        }
      };
    });
    this._setOption(option);
  }

  _createAxisOption() {
    return {
      nameGap: -5,
      nameTextStyle: {
        fontWeight: 'bold'
      },
      splitLine: {
        show: false
      },
      splitArea: {
        show: true
      },
      axisPointer: {
        show: true,
        lineStyle: {
          opacity: 0.2,
          width: 2
        }
      },
      axisLine: {
        lineStyle: {
          opacity: 0.2
        }
      },
      axisLabel: {
        margin: 5
      },
      axisTick: {
        show: false
      }
    };
  }

  _setSeries() {
    const series = [];
    for (const item of this._seriesEncode) {
      const option = this._createSeriesBasicOption();
      if (Array.isArray(item)) {
        option.encode = {
          x: item[0],
          y: item[1],
          z: item[2]
        };
      } else {
        option.name = item.name;
        option.encode = {
          x: item.encode[0],
          y: item.encode[1],
          z: item.encode[2]
        };
      }
      series.push(option);
    }
    this._setOption({series});
  }

  _createSeriesBasicOption() {
    return {
      type: 'scatter3D',
      symbol: 'circle',
      symbolSize: 6,
      coordinateSystem: 'cartesian3D',
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: false
        }
      },
      itemStyle: {
        opacity: 1
      },
    };
  }
}
