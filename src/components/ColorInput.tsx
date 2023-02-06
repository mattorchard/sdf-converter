import { FunctionComponent } from "preact";
import { isValidColor } from "../helpers/ColorHelpers";
import Box from "./Box";
import "./ColorInput.css";

export const ColorInput: FunctionComponent<{
  placeholder: string;
  defaultValue: string;
  onChange: (value: string) => void;
}> = ({ placeholder, defaultValue, onChange }) => (
  <Box gap={1} alignItems="center">
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue.toString()}
      required
      onChange={(e) => {
        if (!e.currentTarget.validity.valid) return;
        const value = e.currentTarget.value;
        if (!isValidColor(value)) return;
        onChange(value);
      }}
      className="cartoon"
    />
    <Box className="color-input__button-group cartoon" gap={0.0625} p={0.5}>
      <ColorButton
        colorName="Black"
        color="#000000"
        isTransparent={false}
        onChange={onChange}
      />
      <ColorButton
        colorName="White"
        color="#FFFFFF"
        isTransparent={false}
        onChange={onChange}
      />
      <ColorButton
        colorName="Black"
        color="#000000"
        isTransparent={true}
        onChange={onChange}
      />
      <ColorButton
        colorName="White"
        color="#FFFFFF"
        isTransparent={true}
        onChange={onChange}
      />
    </Box>
  </Box>
);

const ColorButton: FunctionComponent<{
  colorName: string;
  color: string;
  isTransparent: boolean;
  onChange: (value: string) => void;
}> = ({ colorName, color, isTransparent, onChange }) => {
  const fullHex = `${color}${isTransparent ? "00" : "FF"}`;
  const fullLabel = `${isTransparent ? "Transparent" : "Opaque"} ${colorName}`;
  return (
    <button
      type="button"
      title={fullLabel}
      aria-label={fullLabel}
      className={`color-input__color-buton color-input__color-buton--${
        isTransparent ? "transparent" : "opaque"
      }`}
      style={{ "--color-value": color }}
      onClick={() => onChange(fullHex)}
    />
  );
};
