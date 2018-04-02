/* global window, define, module */
(function(global, factory) {
  var Gauge = factory(global);
  if(typeof define === "function" && define.amd) {
    // AMD support
    define(function() {return Gauge;});
  }else if(typeof module === "object" && module.exports) {
    // CommonJS support
    module.exports = Gauge;
  }else {
    // We are probably running in the browser
    global.Gauge = Gauge;
  }
})(typeof window === "undefined" ? this : window, function(global, undefined) {

  var document = global.document,
    slice = Array.prototype.slice,
    requestAnimationFrame = (global.requestAnimationFrame ||
        global.mozRequestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.msRequestAnimationFrame ||
        function(cb) {
          return setTimeout(cb, 1000 / 60);
        });

  // EXPERIMENTAL!!
  /**
   * Simplistic animation function for animating the gauge. That's all!
   * Options are:
   * {
   *  duration: 1,    // In seconds
   *  start: 0,       // The start value
   *  end: 100,       // The end value
   *  step: function, // REQUIRED! The step function that will be passed the value and does something
   *  easing: function // The easing function. Default is easeInOutCubic
   * }
   */
  function Animation(options) {
    var duration = options.duration,
        currentIteration = 1,
        iterations = 60 * duration,
        start = options.start || 0,
        end = options.end,
        change = end - start,
        step = options.step,
        easing = options.easing || function easeInOutCubic(pos) {
          // https://github.com/danro/easing-js/blob/master/easing.js
          if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
          return 0.5 * (Math.pow((pos-2),3) + 2);
        };

    function animate() {
      var progress = currentIteration / iterations,
          value = change * easing(progress) + start;
      // console.log(progress + ", " + value);
      step(value, currentIteration);
      currentIteration += 1;

      if(progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    // start!
    requestAnimationFrame(animate);
  }



  var Gauge = (function() {
    var SVG_NS = "http://www.w3.org/2000/svg";

    var GaugeDefaults = {
      centerX: 50,
      centerY: 50
    };

    var defaultOptions = {
      dialRadius: 40,
      dialStartAngle: 135,
      dialEndAngle: 45,
      value: 0,
      max: 100,
      min: 0,
      valueDialClass: "value",
      valueClass: "value-text",
      dialClass: "dial",
      gaugeClass: "gauge",
      showValue: true,
      gaugeColor: null,
      label: function(val) {return Math.round(val);}
    };

    function shallowCopy(/* source, ...targets*/) {
      var target = arguments[0], sources = slice.call(arguments, 1);
      sources.forEach(function(s) {
        for(var k in s) {
          if(s.hasOwnProperty(k)) {
            target[k] = s[k];
          }
        }
      });
      return target;
    }

    /**
     * A utility function to create SVG dom tree
     * @param {String} name The SVG element name
     * @param {Object} attrs The attributes as they appear in DOM e.g. stroke-width and not strokeWidth
     * @param {Array} children An array of children (can be created by this same function)
     * @return The SVG element
     */
    function svg(name, attrs, children) {
      var elem = document.createElementNS(SVG_NS, name);
      for(var attrName in attrs) {
        elem.setAttribute(attrName, attrs[attrName]);
      }

      if(children) {
        children.forEach(function(c) {
          elem.appendChild(c);
        });
      }
      return elem;
    }

    /**
     * Translates percentage value to angle. e.g. If gauge span angle is 180deg, then 50%
     * will be 90deg
     */
    function getAngle(percentage, gaugeSpanAngle) {
      return percentage * gaugeSpanAngle / 100;
    }

    /**
     * Check value. If value is number - set it to array
     * @param {Array/Number} value
     * @param {Number} min
     * @param {Number} limit
     * @param {String} color
     * @return {Array}
     */
    function normalizeMultipleValue(value, min, limit, color) {
      // If value is single (number) - set it ro array
      // Value should be in format [{value: number, color: 'string'}]
      if (!Array.isArray(value)){
        value = [{value: value, color: color}];
      }

      var values = value.map(function(v) {
        var currentValue = Number(v.value);
        if(currentValue > limit) currentValue = limit;
        if(currentValue < min) currentValue = min;
        return {
          value: currentValue,
          color: v.color,
          label: v.label
        };
      });

      return values.sort(function(a, b) {
        return b.value - a.value;
      });
    }

    function getValueInPercentage(value, min, max) {
      var newMax = max - min, newVal = value - min;
      return 100 * newVal / newMax;
      // var absMin = Math.abs(min);
      // return 100 * (absMin + value) / (max + absMin);
    }

    /**
     * Gets cartesian co-ordinates for a specified radius and angle (in degrees)
     * @param cx {Number} The center x co-oriinate
     * @param cy {Number} The center y co-ordinate
     * @param radius {Number} The radius of the circle
     * @param angle {Number} The angle in degrees
     * @return An object with x,y co-ordinates
     */
    function getCartesian(cx, cy, radius, angle) {
      var rad = angle * Math.PI / 180;
      return {
        x: Math.round((cx + radius * Math.cos(rad)) * 1000) / 1000,
        y: Math.round((cy + radius * Math.sin(rad)) * 1000) / 1000
      };
    }

    // Returns start and end points for dial
    // i.e. starts at 135deg ends at 45deg with large arc flag
    // REMEMBER!! angle=0 starts on X axis and then increases clockwise
    function getDialCoords(radius, startAngle, endAngle) {
      var cx = GaugeDefaults.centerX,
        cy = GaugeDefaults.centerY;
      return {
        end: getCartesian(cx, cy, radius, endAngle),
        start: getCartesian(cx, cy, radius, startAngle)
      };
    }

    /**
     * Creates a Gauge object. This should be called without the 'new' operator. Various options
     * can be passed for the gauge:
     * {
     *    dialStartAngle: The angle to start the dial. MUST be greater than dialEndAngle. Default 135deg
     *    dialEndAngle: The angle to end the dial. Default 45deg
     *    radius: The gauge's radius. Default 400
     *    max: The maximum value of the gauge. Default 100
     *    value: The starting value of the gauge. Default 0
     *    label: The function on how to render the center label (Should return a value)
     * }
     * @param {Element} elem The DOM into which to render the gauge
     * @param {Object} opts The gauge options
     * @return a Gauge object
     */
    return function Gauge(elem, opts) {
      opts = shallowCopy({}, defaultOptions, opts);
      var gaugeContainer = elem,
          limit = opts.max,
          min = opts.min,
          radius = opts.dialRadius,
          displayValue = opts.showValue,
          startAngle = opts.dialStartAngle,
          endAngle = opts.dialEndAngle,
          valueDialClass = opts.valueDialClass,
          valueTextClass = opts.valueClass,
          valueLabelClass = opts.valueLabelClass,
          dialClass = opts.dialClass,
          gaugeClass = opts.gaugeClass,
          gaugeColor = opts.color,
          defaultDuration = opts.duration || 1,
          gaugeValueElem,
          gaugeValuePath,
          label = opts.label,
          instance,
          gaugeElement,
          value = normalizeMultipleValue(opts.value, min, limit, opts.color),
          stacked = opts.stacked;

      if(startAngle < endAngle) {
        console.log("WARN! startAngle < endAngle, Swapping");
        var tmp = startAngle;
        startAngle = endAngle;
        endAngle = tmp;
      }

      function pathString(radius, startAngle, endAngle, largeArc) {
        var coords = getDialCoords(radius, startAngle, endAngle),
            start = coords.start,
            end = coords.end,
            largeArcFlag = typeof(largeArc) === "undefined" ? 1 : largeArc;

        return [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");
      }

      function initializeGauge(elem) {
        gaugeValueElem = svg("text", {
          x: 50,
          y: 50,
          fill: "#999",
          "class": valueTextClass,
          "font-size": "100%",
          "font-family": "sans-serif",
          "font-weight": "normal",
          "text-anchor": "middle",
          "alignment-baseline": "middle"
        });

        var angle = getAngle(100, 360 - Math.abs(startAngle - endAngle));
        var flag = angle <= 180 ? 0 : 1;
        gaugeElement = svg("svg", {"viewBox": "0 0 100 100", "class": gaugeClass},
          [
            svg("path", {
              "class": dialClass,
              fill: "none",
              stroke: "#eee",
              "stroke-width": 2,
              d: pathString(radius, startAngle, endAngle, flag)
            }),
            gaugeValueElem,
          ]
        );
        elem.appendChild(gaugeElement);
      }

      /**
       * Get valid label value
       * @param {Number} value
       * @return {*}
       */
      function getLabelValue(value) {
        return label.call(opts, value);
      }

      /**
       * Generate valid value string
       * @param {String | Null} label - null only for first element
       * @param {Number} value
       */
      function generateMultipleLabel(label, value) {
        var stringValue = getLabelValue(value).toString();
        if (!label){
          return stringValue;
        }
        return label + '/' + stringValue;
      }

      /**
       * Render label element
       * @param {String} label
       */
      function renderLabel(label) {
        if (displayValue) {
          gaugeValueElem.textContent = label;
        }
      }

      /**
       * Create single gauge section element
       * @param {Object} v
       * @param {Number} totalAngle
       * @return {Number}
       */
      function updateSingleGaugeSection(v, totalAngle, duration) {
        var valueInPercentage = getValueInPercentage(v.value, min, limit),
          // angle = getAngle(val, 360 - Math.abs(endAngle - startAngle)),
          angle = getAngle(valueInPercentage, 360 - Math.abs(startAngle - endAngle)),
          // this is because we are using arc greater than 180deg
          flag = angle <= 180 ? 0 : 1;

        var gaugeValuePath = svg("path", {
          "class": valueDialClass,
          fill: "none",
          stroke: "#666",
          "stroke-width": 2.5,
          d: pathString(radius, startAngle, startAngle) // value of 0
        });

        gaugeElement.appendChild(gaugeValuePath);

        if(!stacked) {
          gaugeValuePath.setAttribute(
            "d",
            pathString(radius, startAngle, angle + startAngle, flag)
          );
        } else {
          gaugeValuePath.setAttribute(
            "d",
            pathString(radius, startAngle + totalAngle, angle + startAngle + totalAngle, flag)
          );
        }

        updateColor(gaugeValuePath, v.color, duration);
        return totalAngle + angle;
      }

      /**
       * Update gauge data
       * @param {Array} value
       * @param {Number} frame
       * @param {Number} sectionStartPoint - this value need for calculate start section point
       */
      function updateGauge(value, frame, sectionStartPoint) {

        var label;

        // Remove old gauge sections
        clearGaugeSections();

        // Check sectionStartPoint
        sectionStartPoint = sectionStartPoint || 0;

        // Create single gauge section
        value.forEach(function (v) {
          label = generateMultipleLabel(label, v.value);
          sectionStartPoint = updateSingleGaugeSection(v, sectionStartPoint);
        });
        renderLabel(label);
      }

      function updateColor(el, color, duration) {
        var dur = duration * 1000,
          pathTransition = "stroke " + dur + "ms ease";

        el.style = [
          "stroke: " + color,
          "-webkit-transition: " + pathTransition,
          "-moz-transition: " + pathTransition,
          "transition: " + pathTransition
        ].join(";");
      }

      /**
       * Remove all gauge sections
       * @return {boolean}
       */
      function clearGaugeSections() {
        var elements = gaugeElement.getElementsByClassName(defaultOptions.valueDialClass);
        if (!elements.length) {
          return false;
        }
        do {
          gaugeElement.removeChild(elements[0]);
        } while (elements.length);
      }

      instance = {
        setMaxValue: function(max) {
          limit = max;
        },
        setValue: function (val) {
          value = normalizeMultipleValue(val, min, limit, gaugeColor);
          updateGauge(value, 0, 0);
        },
        setValueAnimated: function (val, duration) {
          if(!duration) {
            duration = defaultDuration;
          }
          clearGaugeSections();
          duration = (duration / val.length).toFixed(2) || 1;
          var oldVal = value;
          value = normalizeMultipleValue(val, min, limit, opts.color);
          if (oldVal === value) {
            return;
          }

          if (gaugeColor) {
            updateColor(value, duration, duration);
          }

          // This sum of section end point need for set valid start point for each sections
          var totalAngle = 0,
            label;


          value.forEach(function (v, i) {
            // Set startSectionPoint for each section
            value[i].startSectionPoint = totalAngle;

            label = generateMultipleLabel(label, v.value);

            // Write section step by step by duration
            setTimeout(function () {
              Animation({
                start: 0,
                end: v.value,
                duration: duration,
                step: function (val, frame) {
                  updateSingleGaugeSection(
                    {value: val, color: v.color},
                    value[i].startSectionPoint,
                    duration
                  );
                }
              });
            }, duration * 1000 * i);

            // Calculate current section value in percentage
            var valueInPercentage = getValueInPercentage(v.value, min, limit);
            totalAngle = totalAngle + getAngle(valueInPercentage, 360 - Math.abs(startAngle - endAngle));

          });

          renderLabel(label);
        },
        getValue: function() {
          return value;
        }
      };

      initializeGauge(gaugeContainer);
      instance.setValue(value);
      return instance;
    };
  })();

  return Gauge;
});
