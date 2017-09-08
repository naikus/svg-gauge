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
  stroke-width: 2;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge > .value {
  stroke: rgb(47, 227, 255);
  stroke-width: 2;
  fill: rgba(0,0,0,0);
}
.gauge-container > .gauge > .value-text {
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
| ```valueTextClass``` | The CSS class of the gauge's text (```value-text```) |
| ```color (new)```    | An optional function that can return a color for current value  ```function(value) {}``` |


### Migration from 1.0.2

The new gauge uses a viewbox of 100x100 as opposed to previous 1000x1000. All the stroke and font values have to be adjusted accordingly in your CSS. Just divide those by 10



#### [Live Demo](http://codepen.io/naikus/pen/BzkoLL)
