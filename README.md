# SVG Gauge
Minmalistic, configurable, animated SVG gauge. Zero dependencies


## Buy me a coffee ☕
If you like my work please consider making a small donation

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z01L1TS)


## Migration from 1.0.2

The new gauge uses a viewbox of 100x100 as opposed to previous 1000x1000. All the stroke and font values have to be adjusted accordingly in your CSS. Just divide those by 10


## Demo
Check out the [live demo](http://codepen.io/naikus/pen/BzkoLL) for various options and styling tips for this gauge


## Usage

HTML
```html
<div id="cpuSpeed" class="gauge-container"></div>
```
CSS
```css
.gauge-container {
  width: 150px;
  height: 150px;
  display: block;
  padding: 10px;
}
.gauge-container > .gauge .dial {
  stroke: #eee;
  stroke-width: 2;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge .value {
  stroke: rgb(47, 227, 255);
  stroke-width: 2;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge .value-text {
  fill: rgb(47, 227, 255);
  font-family: sans-serif;
  font-weight: bold;
  font-size: 1em;
}
```
Javascript
```js
// npm install
npm install svg-gauge

// Require JS
var Gauge = require("svg-gauge");

// Standalone
var Gauge = window.Gauge;

// Create a new Gauge
var cpuGauge = Gauge(document.getElementById("cpuSpeed"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "/" + this.max;
    },
    value: 50,
    // Custom dial colors (Optional)
    color: function(value) {
      if(value < 20) {
        return "#5ee432"; // green
      }else if(value < 40) {
        return "#fffa50"; // yellow
      }else if(value < 60) {
        return "#f7aa38"; // orange
      }else {
        return "#ef4655"; // red
      }
    }
});

// Set gauge value
cpuGauge.setValue(75);

// Set value and animate (value, animation duration in seconds)
cpuGauge.setValueAnimated(90, 1);

```

#### Options

|      Name            |                  Description                       |
| -------------------- | ------------------------------------------------------------------------------------- |
| ```dialStartAngle``` | The angle in degrees to start the dial (```135```)       |
| ```dialEndAngle```   | The angle in degrees to end the dial. This MUST be less than dialStartAngle (```45```)  |
| ```radius```         | The radius of the gauge (```40```) |
| ```min```            | The minimum value for the gauge. This can be a negative value (```0```)  |
| ```max```            | The maximum value for the gauge (```100```)  |
| ```label```          | Optional function that returns a string label that will be rendered in the center. This function will be passed the current value |
| ```showValue```      | Whether to show the value at the center of the gauge (```true```) |
| ```gaugeClass```     | The CSS class of the gauge (```gauge```) |
| ```dialClass```      | The CSS class of the gauge's dial (```dial```) |
| ```valueDialClass``` | The CSS class of the gauge's fill (value dial) (```value```) |
| ```valueClass```     | The CSS class of the gauge's text (```value-text```) |
| ```color (new)```    | An optional function that can return a color for current value  ```function(value) {}``` |
| ```viewBox (new)```  | An optional string that specifies the crop region (```0 0 100 100```) |



## That's all good, but what about React?
```JSX
import React, { useEffect, useRef } from "react";
import SvgGauge from "svg-gauge";

const defaultOptions = {
  animDuration: 1,
  showValue: true,
  initialValue: 0,
  max: 100
  // Put any other defaults you want. e.g. dialStartAngle, dialEndAngle, radius, etc.
};

const Gauge = props => {
  const gaugeEl = useRef(null);
  const gaugeRef = useRef(null);
  useEffect(() => {
    if (!gaugeRef.current) {
      const options = { ...defaultOptions, ...props };
      gaugeRef.current = SvgGauge(gaugeEl.current, options);
      gaugeRef.current.setValue(options.initialValue);
    }
    gaugeRef.current.setValueAnimated(props.value, 1);
  }, [props]);

  return <div ref={gaugeEl} className="gauge-container" />;
};

export default Gauge;

// to render:
const renderGauge = () => (
  <Gauge
    value={42}
    // any other options you want
  />
);
```

## React w/ TypeScript?

```tsx
import { useEffect, useRef } from 'react'
import SvgGauge, { GaugeOptions, GaugeInstance } from 'svg-gauge'

const Gauge = ({ value }: Props) => {
  const gaugeEl = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<GaugeInstance | null>(null)
  useEffect(() => {
    if (!gaugeRef.current) {
      if (!gaugeEl.current) return
      const options: GaugeOptions = { color: value => (value < 30 ? 'green' : 'red') }
      gaugeRef.current = SvgGauge(gaugeEl.current, options)
      gaugeRef.current?.setValue(1)
    }
    gaugeRef.current?.setValueAnimated(value, 1)
  }, [value])

  return (
    <div style={{ width: '500px', height: '500px' }}>
      <div ref={gaugeEl} />
    </div>
  )
}

interface Props {
  value: number
}

export default Gauge
```

## And Angular?
Ha! [It's already there](https://github.com/mattlewis92/angular-gauge)
