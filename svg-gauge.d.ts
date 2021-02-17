declare var svgGauge: Gauge.GaugeInstance;

declare module 'svg-gauge' {
  export = svgGauge;
}

declare namespace Gauge {
  interface GaugeInstance {
    (element: HTMLElement, options?: GaugeOptions): GaugeInstance;
    setMaxValue: (max: number) => void;
    setValue: (val: number) => void;
    setValueAnimated: (val: number, duration: number) => void;
    getValue: () => number;
  }

  interface GaugeOptions {
    max?: number;
    min?: number;
    value?: number;
    dialRadius?: number;
    showValue?: boolean;
    dialStartAngle?: number;
    dialEndAngle?: number;
    valueDialClass?: string;
    valueClass?: string;
    valueLabelClass?: string;
    dialClass?: string;
    gaugeClass?: string;
    color?: (value: number) => string;
    label?: (value: number) => string;
    viewBox?: string;
  }
}
