import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxHeight: 0,
      formatData: undefined,
    };
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({data: this.props.data});
    }
  }

  dataToRectLocs() {

    // Takes in data as I'd expect to get it from the API and formats it correctly to get 
    // muh d3 heights.
    // returns "series", which has start/end locs for all classes.

    // also sets maxHeight in state, while looking at data.

    const { data } = this.props;
    let formatData = [];

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
    let max = 0;
    for (let property in hash) {
      let day = hash[property];
      let sum = 0;
      
      for (let subj in day) {
        sum += day[subj];
      }
      if (sum > max) {
        max = sum;
      }
      if (max >= this.state.maxHeight) {
        this.setState({ maxHeight: max });
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
    this.setState({ formatData: series , extent: extent });
    return [max, series];
  }

  drawRects() {
    // take in series
    // return SVG of all rects

    let element = document.getElementById("graph");
    let width = element.clientWidth - 30;
    let boxHeight = this.props.graphHeight; 



    let { formatData, maxHeight } = this.state;
    if (maxHeight < 60) {
      maxHeight = 70;
    }
    let factor = (boxHeight - 50) / maxHeight;
    let xFactor = (width - 20) / 10;
    let zero = boxHeight - 50;
    let style;
    if (width < 280) {
      style = 'tinyText';
    } else if (width < 340) {
      style = 'smallText';
    } else {
      style = 'largeText';
    }
    let dates = formatData[0].map((entry, idx) => {
      let day = entry.data.date.toDateString().substring(0, 3);
      let date = entry.data.date.getDate();
      let month = entry.data.date.toDateString().substring(4, 7)
     
      return (
        <g>
        <text x={xFactor * idx + 3} y={boxHeight - 35} className={style}>{day}</text>
        <text x={xFactor * idx + 3} y={boxHeight - 6} className={style}>{month}</text>
        <text x={xFactor * idx + 8} y={boxHeight - 20} className={style}>{date}</text>
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
        loc = zero - loc * factor;
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
    let bars = formatData.map((series, subj) => {
      return series.map((datapoint, idx) => {
        let size = datapoint[1] - datapoint[0];
        let course = series.key;
        let longKey = course.substring(0, 15);
        let shortKey = course.substring(0, 3);
        let midpoint = zero - (datapoint[0] + datapoint[1]) / 2 * factor;
        if (size >= 20) {
          return ( 
            <g>
              <rect
              x={xFactor * idx} y={zero - (factor * datapoint[1])}
                height={factor * (datapoint[1] - datapoint[0])}
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
              <rect x={xFactor * idx} y={zero - (factor * datapoint[1])}
                height={factor * (datapoint[1] - datapoint[0])}
                width={barWidth} fill={this.colorPicker(subj)}
                strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
              <text x={xFactor * idx + 10} y={midpoint - 15} writingMode='tb-rl'>{shortKey}</text>
            </g>
        )

        } else if (size > 0) {
          return ( 
          <g>
          <rect x={xFactor * idx} y={zero - (factor * datapoint[1])}
            height={factor * (datapoint[1] - datapoint[0])}
            width={barWidth} fill={this.colorPicker(subj)}
            strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
          </g>
          )
        }
        
      })
    })
    return(
      <div>
        <svg x='0' y="0" height={boxHeight} width={window.innerWidth} id='svgWindow'>
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
    console.log('Inside didMount()', series);
  }

  render() { 
    const { data } = this.props;
    console.log('graph render ', data[data.length - 1])
    const { formatData } = this.state;
    if (formatData !== undefined) {
      return this.drawRects()
    }
    return(
      <div>
        placeholder text
      </div>
    )
  }
}