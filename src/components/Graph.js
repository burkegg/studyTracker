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

    let { width, graphHeight, series, maxHeight } = this.props;
    if (maxHeight < 30) {
      maxHeight = 35;
    }
    // maxHeight is the highest set of bars

    if (series === null) {
      // ==========  PUT IN INSTRUCTIONS FOR NO GRAPH DATA ===============
      return(<div>When you're ready to start working, just hit start!  Remember to pause when you get distracted.</div>)
    }
    if (width < 100) {
      width = 300;
    }
    if (graphHeight < 100) {
      graphHeight = 350;
    }
  
    let yFactor = (graphHeight - 50) / maxHeight;

    // what is xFactor
    // testing
    let xFactor = (width - 25) / 10;
    let zero = graphHeight - 50;
    let style;
    if (width < 280) {
      style = 'tinyText';
    } else if (width < 340) {
      style = 'smallText';
    } else {
      style = 'largeText';
    }

    let dates = () => {
      return series[0].map((entry, idx) => {
        entry.data.date = entry.data.date.replace(/-/, '/');
        entry.data.date = entry.data.date.replace(/-/, '/');
        let dateObj = new Date(entry.data.date);
        let day = dateObj.toDateString().substring(0, 3);
        // let day = dateObj.getDay();
        let date = dateObj.getDate();
        let month = dateObj.toDateString().substring(4, 7)
        return (
          <g key={idx+'dates'}>
          <text x={xFactor * idx + 3} y={graphHeight - 35} className={style}>{day}</text>
          <text x={xFactor * idx + 3} y={graphHeight - 6} className={style}>{month}</text>
          <text x={xFactor * idx + 8} y={graphHeight - 20} className={style}>{date}</text>
          <line x1='0' y1={zero} y2={zero} x2={width} stroke='grey' strokeWidth='.5'/>
          </g>
        )
      })
    }

    let lines = function() {
      let lineLocs = [];
      let count = 0;

      if (maxHeight <= 120) {
        while (count <= maxHeight - 5) {
          count += 30;
          lineLocs.push(count);
        }
      } else {
        while (count <= maxHeight - 5) {
          count += 60;
          lineLocs.push(count);
        }
      }
      return lineLocs.map((loc, idx) => {
        let tempKey = loc;
        if (maxHeight >= 120 + 5) {
          tempKey = `${Math.round(tempKey / 60)}hr`;
        } else {
          tempKey = `${tempKey}m`
        }
        loc = zero - loc * yFactor;
        return(
          <g key={idx+'line'}>
            <line x1='0' y1={loc} x2={width - 25} y2={loc} stroke='grey' strokeWidth='0.5'/>
            <text x={width - 22} y = {loc + 5}>{`${tempKey}`}</text>
          </g>
        )
      })
    };

    let barWidth = 25;
    if (width <= 300) {
      barWidth = xFactor;
    }


    let bars = () => {
      return series.map((group, subj) => {
        return group.map((datapoint, idx) => {

          let size = datapoint[1] - datapoint[0];
          let course = group.key;
          let longKey = course.substring(0, 15);
          let shortKey = course.substring(0, 3);
          let midpoint = zero - (datapoint[0] + datapoint[1]) / 2 * yFactor;
          let taskDate = datapoint.data.date;
          let id = 'rect'+idx;
          if (size >= 25) {
            return (
              <g id={id}>
                <rect
                  onClick={()=>{this.props.handleTaskClick(course, taskDate, id)}}
                  x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
                  height={yFactor * (datapoint[1] - datapoint[0])}
                  width={barWidth} fill={this.colorPicker(subj)}
                  strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
                <text
                  onClick={()=>{this.props.handleTaskClick(course, taskDate, id)}}
                  x={xFactor * idx + 12}
                  y={midpoint + 3} 
                  writingMode='tb-rl' textAnchor='middle'>
                {longKey}
                </text>
              </g>
            )
          } else if (size >= 22) {
            return ( 
              <g id={id}>
                <rect
                  onClick={()=>{this.props.handleTaskClick(course, taskDate, id)}}
                  x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
                  height={yFactor * (datapoint[1] - datapoint[0])}
                  width={barWidth} fill={this.colorPicker(subj)}
                  strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
                <text
                  onClick={()=>{this.props.handleTaskClick(course, taskDate, id)}}
                  x={xFactor * idx + 12}
                  y={midpoint - 15}
                  writingMode='tb-rl'>{shortKey}</text>
              </g>
          )
          } else if (size > 0) {
            return ( 
            <g id={id}>
            <rect
              onClick={()=>{this.props.handleTaskClick(course, taskDate, id)}}
              x={xFactor * idx} y={zero - (yFactor * datapoint[1])}
              height={yFactor * (datapoint[1] - datapoint[0])}
              width={barWidth} fill={this.colorPicker(subj)}
              strokeWidth='.4' stroke='black' fillOpacity='0.3' rx='1' ry='1'className='graphRect' />
             </g>
           )
          }
        })
      })
    }
   
  return(
    <div>
      <svg x='0' y="0" height={graphHeight} width={window.innerWidth} id='svgWindow'>
        {bars()}
        {dates()}
        {lines()}
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


  render() { 
    const { series } = this.props;
    if (this.series !== null) {
      return this.dataToRectLocs()
    }
    
    return(
      <div>
        Graph placeholder
      </div>
    )
  }
}