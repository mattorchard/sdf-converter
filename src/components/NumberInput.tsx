import { FunctionComponent } from "preact";

export const NumberInput: FunctionComponent<{
  min: number;
  max: number;
  step: number;
  placeholder: string;
  defaultValue: number;
  onChange: (value: number) => void;
}> = ({ min, max, step, placeholder, defaultValue, onChange }) => (
  <input
    type="number"
    min={min}
    max={max}
    step={step}
    placeholder={placeholder}
    defaultValue={defaultValue.toString()}
    required
    onChange={(e) => {
      if (!e.currentTarget.validity.valid) return;
      const value = Number(e.currentTarget.value);
      if (isNaN(value)) return;
      onChange(value);
    }}
    className="cartoon"
  />
);
