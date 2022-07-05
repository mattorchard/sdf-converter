import { FunctionComponent, JSX } from "preact";
import { useState } from "preact/hooks";
import { loadImage } from "../helpers/ImageHelpers";
import { SdfOptions } from "../helpers/SdfWglHelpers";
import Box from "./Box";
import { Button } from "./Button";
import "./InputForm.css";

const colorPattern = "^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$";

interface InputFormProps {
  images: HTMLImageElement[];
  options: SdfOptions;
  onImagesChange: (images: HTMLImageElement[]) => void;
  onOptionsChange: (options: SdfOptions) => void;
}

export const InputForm: FunctionComponent<InputFormProps> = ({
  options,
  onImagesChange,
  onOptionsChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePickFiles = async () => {
    try {
      setIsLoading(true);

      const fileHandles = await window.showOpenFilePicker({
        multiple: true,
        types: [
          {
            accept: {
              "image/*": [".png", ".gif"],
            },
            description: "Image with transparency",
          },
        ],
      });
      const loadedImages = await Promise.all(
        fileHandles.map((handle) => handle.getFile().then(loadImage))
      );
      onImagesChange(loadedImages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (newOptions: Partial<SdfOptions>) =>
    onOptionsChange({ ...options, ...newOptions });

  return (
    <form className="input-form">
      <Box>
        <Button onClick={handlePickFiles} disabled={isLoading}>
          {isLoading ? "Loading" : "Pick Images"}
        </Button>
      </Box>

      <FormControl
        labelText="Spread"
        input={
          <input
            type="number"
            min={1}
            max={128}
            step="1"
            required
            placeholder="e.g. 10"
            defaultValue={options.spread.toString()}
            onChange={(e) => {
              const spread = parseInt(e.currentTarget.value);
              if (!spread) return;
              handleOptionChange({ spread });
            }}
          />
        }
        description="Distance between an edge and the background "
      />
      <FormControl
        labelText="Alpha Threshold"
        input={
          <input
            type="number"
            min="1"
            max="255"
            step="1"
            required
            placeholder="e.g. 128"
            defaultValue={options.alphaThreshold.toString()}
            onChange={(e) => {
              const alphaThreshold = parseInt(e.currentTarget.value);
              if (!alphaThreshold) return;
              handleOptionChange({ alphaThreshold });
            }}
          />
        }
        description="At what transparency level is a pixel enabled"
      />

      <FormControl
        labelText="Up Res Factor"
        input={
          <input
            type="number"
            min="1"
            max="4"
            step="1"
            required
            placeholder="e.g. 2"
            defaultValue={options.upResFactor.toString()}
            onChange={(e) => {
              const upResFactor = parseInt(e.currentTarget.value);
              if (!upResFactor) return;
              handleOptionChange({ upResFactor });
            }}
          />
        }
        description="How much to upscale the image during calculations"
      />

      <FormControl
        labelText="In Color"
        input={
          <input
            type="text"
            placeholder="e.g.  #000000"
            pattern={colorPattern}
            defaultValue={options.inColor}
            onChange={(e) => {
              const inColor = e.currentTarget.value;
              if (!new RegExp(colorPattern).test(inColor)) return;
              handleOptionChange({ inColor });
            }}
          />
        }
        description="Color to use inside the shape"
      />

      <FormControl
        labelText="Out Color"
        input={
          <input
            type="text"
            placeholder="e.g.  #000000"
            pattern={colorPattern}
            defaultValue={options.outColor}
            onChange={(e) => {
              const outColor = e.currentTarget.value;
              if (!new RegExp(colorPattern).test(outColor)) return;
              handleOptionChange({ outColor });
            }}
          />
        }
        description="Color to use outside the shape"
      />
    </form>
  );
};

const FormControl: FunctionComponent<{
  labelText: JSX.Element | string;
  input: JSX.Element;
  description: JSX.Element | string;
}> = ({ labelText, input, description }) => (
  <div role="group" className="form-group">
    <label className="form-group__label">
      {labelText}
      {input}
    </label>
    <p className="form-group__description">{description}</p>
  </div>
);
