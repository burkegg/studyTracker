import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxHeight: 0,
      formatData: undefined,
      series: null,
    };
  };


  dataToRectLocs() {

    // Takes in data as I'd expect to get it from the API and formats it correctly to get 
    // muh d3 heights.
    // returns "series", which has start/end locs for all classes.

    // also sets maxHeight in state, while looking at data.

    let { data, width, graphHeight } = this.props;
    let formatData = [];
    if (width < 100) {
      width = 300;
    }
    if (graphHeight < 100) {
      graphHeight = 350;
    }
    let hash = {};
    let templateDay = {};
    let allKeys = [];

    for (let i = 0; i < data.length; i++) {
      let subject = data[i].subject;
      if (!templateDay.hasOwnProperty(data[subject])) {
        templateDay[subject] = 0;
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (!hash.hasOwnProperty(data[i].date)) {
        let tempDay = Object.assign({}, templateDay);
        let subj = data[i].subject;
        tempDay[subj] = data[i].duration;
        hash[data[i].date] = tempDay;
      } else {
        let tempDay = Object.assign({}, hash[data[i].date]);
        tempDay[data[i].subject] = data[i].duration;
        hash[data[i].date] = tempDay;
      }
    }

    // set maxHeight in state
    let maxHeight = 0;
    for (let property in hash) {
      let day = hash[property];
      let sum = 0;
      
      for (let subj in day) {
        sum += day[subj];
      }
      if (sum > maxHeight) {
        maxHeight = sum;
      }
    }

    for (let key in templateDay) {
      allKeys.push(key);
    }
    // Now make an array with each day as object, with date.
    let allDays = Object.keys(hash);
    for (let i = 0; i < allDays.length; i++) {
      let storage = hash[allDays[i]];
      storage.date = new Date(allDays[i]);
      formatData.push(storage);
    }

    const extent = d3.extent(data, (d) => {
      return d.date;
    })

    var stack = d3.stack()
    .keys(allKeys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
    var series = stack(formatData); 
    // from here on we work with 'series'


    // take in series
    // return SVG of all rects
    width = width - 30;
    if (maxHeight < 60) {
      maxHeight = 70;
    }


    let yFactor = (graphHeight - 50) / maxHeight;
    let xFactor = (width - 20) / 10;
    let zero = graphHeight - 50;
    let style;
    if (width < 280) {
      style = 'tinyText';
    } else if (width < 340) {
      style = 'smallText';
    } else {
      style = 'largeText';
    }
    let dates = series[0].map((entry, idx) => {
      let day = entry.data.date.toDateString().substring(0, 3);
      let date = entry.data.date.getDate();
      let month = entry.data.date.toDateString().substring(4, 7)
     
      return (
        <g key={idx+'dates'}>
        <text x={xFactor * idx + 3} y={graphHeight - 35} className={style}>{day}</text>
        <text x={xFactor * idx + 3} y={graphHeight - 6} className={style}>{month}</text>
        <text x={xFactor * idx + 8} y={graphHeight - 20} className={style}>{date}</text>
        <line x1='0' y1={zero} y2={zero} x2={width} stroke='grey' strokeWidth='.5'/>
        </g>
        )
    })

    let lines = function() {
      let lineLocs = [];
      let count = 0;
      while (count <= maxHeight) {
        count += 30;
        lineLocs.push(count);
      }
      return lineLocs.map((loc, idx) => {
        let tempKey = loc;
        loc = zero - loc * yFactor;
        return(
          <g>
            <line x1='0' y1={loc} x2={width} y2={loc} stroke='grey' strokeWidth='0.5'/>
            <text x={width - 18} y = {loc - 5}>{`${tempKey} min`}</text>
        </g>
        )
      })
    }();
    let barWidth = 25;
    if (width <= 300) {
      barWidth = xFactor;
    }
    let bars = series.map((group, subj) => {
      return group.map((datapoint, idx) => {
        let size = datapoint[1] - datapoint[0];
        let course = group.key;
        let longKey = course.substring(0, 15);
        let shortKey = course.substring(0, 3);
        let midpoint = zero - (datapoint[0] + datapoint[1]) / 2 * yFactor;
        if (size >= 20) {
          return ( 
            <g>
              <rect
              x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
                height={yFactor * (datapoint[1] - datapoint[0])}
                width={barWidth} fill={this.colorPicker(subj)}
                strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
              <text x={xFactor * idx + 10} y={midpoint} 
              writingMode='tb-rl' textAnchor='middle'>
              {longKey}
              </text>
            </g>
          )
        } else if (size >= 15) {
          return ( 
            <g>
              <rect x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
                height={yFactor * (datapoint[1] - datapoint[0])}
                width={barWidth} fill={this.colorPicker(subj)}
                strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
              <text x={xFactor * idx + 10} y={midpoint - 15} writingMode='tb-rl'>{shortKey}</text>
            </g>
        )

        } else if (size > 0) {
          return ( 
          <g>
          <rect x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
            height={yFactor * (datapoint[1] - datapoint[0])}
            width={barWidth} fill={this.colorPicker(subj)}
            strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
          </g>
          )
        }
        
      })
    })
    return(
      <div>
        <svg x='0' y="0" height={graphHeight} width={window.innerWidth} id='svgWindow'>
          {bars}
          {dates}
          {lines}
        </svg>
      </div>
      )
  }

  colorPicker(subj) {
    let colors = ['red', 'blue', 'lime', 'fuchsia', 'purple', 'aqua', 'yellow', 'maroon', 'silver', 'teal'];
    if (subj <= colors.length) {
      return colors[subj];
    } else {
      return 'olive';
    }
  }

  componentDidMount() {
    let series = this.dataToRectLocs();
    this.setState({ series: series });
    console.log('Inside didMount()', series);
  }

  render() { 
    const { series } = this.state;
    if (this.series !== null) {
      return this.dataToRectLocs()
    }
    
    
    return(
      <div>
        Loading
      </div>
    )
  }
}