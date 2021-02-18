declare var svgGauge: Gauge.GaugeInstance;

declare module 'svg-gauge' {
  export = svgGauge;
}

declare namespace Gauge {
  interface GaugeInstance {
    /**
     * Creates a Gauge instance.
     *
     * @param {Element} element The DOM into which to render the gauge
     * @param {GaugeOptions} options The gauge options
     * @return a gauge instance
     */
    (element: Element, options?: GaugeOptions): GaugeInstance;
    setMaxValue: (max: number) => void;
    setValue: (val: number) => void;
    setValueAnimated: (val: number, duration: number) => void;
    getValue: () => number;
  }

  interface GaugeOptions {
    /**
     * The maximum value of the gauge.
     * @default 100
     */
    max?: number;

    /**
     * @default 0
     */
    min?: number;

    /**
     * The starting value of the gauge.
     * @default 0
     */
    value?: number;

    /**
     * The gauge's radius.
     * @default 400
     */
    dialRadius?: number;

    /**
     * @default true
     */
    showValue?: boolean;

    /**
     * The angle to start the dial.
     * MUST be greater than dialEndAngle.
     * @default 135deg
     */
    dialStartAngle?: number;

    /**
     * The angle to end the dial.
     * @default 45deg
     */
    dialEndAngle?: number;

    /**
     * @default 'value'
     */
    valueDialClass?: string;

    /**
     * @default 'value-text'
     */
    valueClass?: string;

    /**
     * @default undefined
     */
    valueLabelClass?: string;

    /**
     * @default 'dial'
     */
    dialClass?: string;

    /**
     * @default 'gauge'
     */
    gaugeClass?: string;

    /**
     * @default null
     */
    color?: (value: number) => string;

    /**
     * The function on how to render the center label (Should return a value)
     * @returns the label string
     */
    label?: (value: number) => string;

    /**
     * @default '0 0 100 100'
     */
    viewBox?: string;
  }
}
