# SVG Gauge
Minmalistic, configurable, animated SVG gauge. Zero dependencies


### Usage

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
.gauge-container > .gauge > .dial {
  stroke: #eee;
  stroke-width: 20;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge > .value {
  stroke: rgb(47, 227, 255);
  stroke-width: 20;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge > .value-text {
  fill: rgb(47, 227, 255);
  font-family: sans-serif;
  font-weight: bold;
  font-size: 10em;
}
```
Javascript
```js
// npm install
npm install svg-gauge

// Require JS
var Gauge = require("svg-guage");

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
| ```radius```         | The radius of the gauge (```400```) |
| ```max```            | The maximum value for the gauge (```100```)  |
| ```label```          | Optional function that returns a string label that will be rendered in the center. This function will be passed the current value |
| ```showValue```      | Whether to show the value at the center of the gauge (```true```) |
| ```gaugeClass```     | The CSS class of the gauge (```gauge```) |
| ```dialClass```      | The CSS class of the gauge's dial (```dial```) |
| ```valueDialClass``` | The CSS class of the gauge's fill (value dial) (```value```) |
| ```valueTextClass``` | The CSS class of the gauge's text (```value-text```) |





#### [Live Demo](http://codepen.io/naikus/pen/BzkoLL)
