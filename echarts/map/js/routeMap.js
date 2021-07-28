var myChartMap = '';
var geoCoordMap = geoCoordMapEN; //中英文国家：geoCoordMapCN、geoCoordMapEN
var echartDataArr = '';
var toWorldName = [];//TO存储到达地名
//判断字符是否为空的方法
function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
};

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
};
$('#importInput').change(function () {
  var file = this.files[0];
  var fileReader = new FileReader();
  fileReader.readAsText(file)
  fileReader.onload = () => {
    // console.log(fileReader.result);
    echartDataArr = JSON.parse(fileReader.result);
    echartDataArr = echartDataArr.sort(compare("value"));
  }
});
// 点击预览json
$('.import-btn').on('click', function () {
  InitData = [];
  toWorldName = [];
  echartDataArr.forEach(function (item, i) {
    if(isEmpty(toWorldName[item.to])){
      (toWorldName[item.to]) || (toWorldName[item.to] = [item]);
      // toWorldName.push([
      //   item.to, item
      // ]);
    } else {
      toWorldName[item.to].push(item);
    }
  });
  Object.keys(toWorldName).map(function(item, i) {
    var arr = [];
    toWorldName[item].forEach(function(item) {
      var str = [];
      str.push({
          name: item.from,
          value: item.value
        },{
        name: item.to
      })
      arr.push(
        str
      )
    })
    InitData.push([
      item,arr
    ])
  });
  // toWorldName
  // .forEach(function(item, i) {
  //   InitData.push([item])
  // });
  worldMap();
});
// 假数据 模拟数据
var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

var BJData = [
  [{
      name: '尼日利亚',
      value: 9100,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '美国洛杉矶',
      value: 2370,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '香港邦泰',
      value: 3130,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '美国芝加哥',
      value: 2350,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '加纳库马西',
      value: 5120,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '英国曼彻斯特',
      value: 3110,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '德国汉堡',
      value: 6280,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '哈萨克斯坦阿拉木图',
      value: 7255,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '俄罗斯伊尔库茨克',
      value: 8125,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '巴西',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '埃及达米埃塔',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '西班牙巴塞罗纳',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '柬埔寨金边',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '意大利米兰',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '乌拉圭蒙得维的亚',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '莫桑比克马普托',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '阿尔及利亚阿尔及尔',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '阿联酋迪拜',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '匈牙利布达佩斯',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '澳大利亚悉尼',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '美国加州',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '澳大利亚墨尔本',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '墨西哥',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
  [{
      name: '加拿大温哥华',
      value: 3590,
    },
    {
      name: '北京',
    },
  ],
];
var CnData = [
  [{
      name: '美国',
      value: 9100,
    },
    {
      name: '日本',
    },
  ]
];
var ODLYData = [
  [{
      name: 'Malaysia',
      value: 9100,
    },
    {
      name: 'Thailand',
    },
  ]
];
// 集合【各国连线】
var InitData = [
  ['日本', CnData],
  ['北京', BJData],
  // ['Thailand', ODLYData],
];
var convertData = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var dataItem = data[i];
    // if(!isEmpty(geoCoordMap[dataItem[0].name])){
    //   console.log(dataItem[0].name)
    // }
    // if(!isEmpty(geoCoordMap[dataItem[1].name])){
    //   console.log(dataItem[1].name)
    // }
    var fromCoord = geoCoordMap[dataItem[0].name];
    var toCoord = geoCoordMap[dataItem[1].name];
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem[0].name,
        toName: dataItem[1].name,
        coords: [fromCoord, toCoord],
        value: dataItem[0].value,
      });
    }
  }
  return res;
};
// [
//   ['日本', CnData],
//   ['北京', BJData],
//   ['澳大利亚', ODLYData],
// ].
function worldMap() {
  var series = [];
  if (myChartMap != null && myChartMap != "" && myChartMap != undefined) {
    myChartMap.dispose();
  }
  InitData.forEach(function (item, i) {
    series.push({
        name: item[0],
        type: 'lines',
        zlevel: 2,
        effect: {
          show: false,
          // //飞机的速度  这里是s单位
          period: 6,
          trailLength: 0,
          symbol: planePath, //飞机
          // 飞机大小
          symbolSize: 16,
        },
        lineStyle: {
          normal: {
            color: '#ff8800',
            // 线条宽度
            width: 1,
            opacity: 1,
            curveness: 0.2,
          },
        },
        label: {
          normal: {
            show: true,
            position: 'middle',
            formatter: '{c}'
          },
        },
        data: convertData(item[1]),
      }, {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          //涟漪特效
          period: 4, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 4, //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: false, //默认地名
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: '{b}', //圆环显示文字
            textStyle: {
              color: 'red',
            },
          },
          emphasis: {
            show: true,
          },
        },
        symbol: 'circle',
        symbolSize: function (val) {
          return 4 + val[2] / 1000; //圆环大小
        },
        itemStyle: {
          normal: {
            show: false,
            color: '#f79422'
          },
        },
        data: item[1].map(function (dataItem) {
          // console.log(dataItem);
          return {
            name: dataItem[0].name,
            value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value]),
          };
        }),
      },
      //被攻击点
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          brushType: 'stroke',
          scale: 4,
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            color: '#00ffff',
            formatter: '{b}',
            textStyle: {
              color: '#0bc7f3',
            },
          },
          emphasis: {
            show: true,
          },
        },
        symbol: 'pin',
        symbolSize: 30,
        itemStyle: {
          normal: {
            show: true,
            color: '#9966cc',
          },
        },
        data: [{
          name: item[0],
          value: geoCoordMap[item[0]].concat([10]),
          size:item[1][0][0].value
        }, ],
      }
    );
  });
  // 世界地图
  echartSetOption();
  //构建地图echarts
  function echartSetOption() {
    myChartMap = echarts.init(document.getElementById('main-world-map'));
    var option = {
      backgroundColor: '#fff', //背景色
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
          if (params.seriesType == 'effectScatter') {
            return params.marker + params.data.name + '' + params.data.value[2];
          } else if (params.seriesType == 'lines') {
            return params.data.fromName + ' -> ' + params.data.toName + '<br />' + params.data.value;
          } else {
            return params.name;
          }
        },
      },
      geo: {
        map: 'world',
        label: {
          emphasis: {
            show: true,
          },
        },
        roam: true, //是否允许缩放
        layoutCenter: ['50%', '50%'], //地图位置
        layoutSize: '130%',
        itemStyle: {
          normal: {
            color: '#eee', //地图背景色
            borderColor: '#858585', //省市边界线
          },
          emphasis: {
            color: 'yellow', //悬浮背景
          },
        },
      },

      series: series,
    };
    myChartMap.setOption(option);
  }
};