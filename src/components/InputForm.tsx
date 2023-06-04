import { Fragment, FunctionComponent, JSX } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { loadImage } from "../helpers/ImageHelpers";
import { SdfOptions } from "../helpers/SdfWglHelpers";
import { InputImage } from "../helpers/UtilTypes";
import Box from "./Box";
import { Button } from "./Button";
import { ColorInput } from "./ColorInput";
import "./InputForm.css";
import { NumberInput } from "./NumberInput";

interface InputFormProps {
  options: SdfOptions;
  images: InputImage[];
  onImagesChange: (images: InputImage[]) => void;
  onOptionsChange: (options: SdfOptions) => void;
  onValidityChange: (isValid: boolean) => void;
}

export const InputForm: FunctionComponent<InputFormProps> = ({
  options,
  images,
  onImagesChange,
  onOptionsChange,
  onValidityChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const hasSvgs = useMemo(() => images.some((image) => image.isSvg), [images]);

  const handlePickFiles = async () => {
    try {
      setIsLoading(true);

      const fileHandles = await window.showOpenFilePicker({
        multiple: true,
        types: [
          {
            accept: {
              "image/*": [".png", ".gif", ".svg"],
            },
            description: "Image with transparency",
          },
        ],
      });
      const loadedImages = await Promise.all(
        fileHandles.map(async (handle) => {
          const file = await handle.getFile();

          const isSvg = file.type.includes("svg");

          const image = await loadImage(file);
          const metadata = {
            name: handle.name,
            width: isSvg ? options.svgWidth : image.naturalWidth,
            height: isSvg ? options.svgHeight : image.naturalHeight,
          };
          image.width = metadata.width;
          image.height = metadata.height;
          return {
            image,
            metadata,
            isSvg,
          };
        }),
      );
      onImagesChange(loadedImages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasSvgs) return;
    const newSize = { width: options.svgWidth, height: options.svgHeight };
    onImagesChange(
      images.map((image) => {
        if (!image.isSvg) return image;

        image.image.width = newSize.width;
        image.image.height = newSize.height;
        return {
          ...image,
          metadata: { ...image.metadata, ...newSize },
        };
      }),
    );
  }, [hasSvgs, options.svgWidth, options.svgHeight]);

  const handleOptionChange = (newOptions: Partial<SdfOptions>) =>
    onOptionsChange({ ...options, ...newOptions });

  return (
    <form
      className="input-form"
      onSubmit={(e) => e.preventDefault()}
      onChange={(e) => onValidityChange(e.currentTarget.checkValidity())}
    >
      <Box>
        <Button onClick={handlePickFiles} disabled={isLoading}>
          {isLoading ? "Loading" : "Pick Images"}
        </Button>
      </Box>

      {hasSvgs && (
        <Fragment>
          <FormControl
            labelText="SVG Output Width"
            input={
              <NumberInput
                min={1}
                max={16_500}
                step={1}
                placeholder="e.g. 500"
                defaultValue={options.svgWidth}
                onChange={(svgWidth) => handleOptionChange({ svgWidth })}
              />
            }
            description="How wide to make SVGs in the final image"
          />
          <FormControl
            labelText="SVG Output Height"
            input={
              <NumberInput
                min={1}
                max={16_500}
                step={1}
                placeholder="e.g. 500"
                defaultValue={options.svgHeight}
                onChange={(svgHeight) => handleOptionChange({ svgHeight })}
              />
            }
            description="How tall to make SVGs in the final image"
          />
        </Fragment>
      )}

      <FormControl
        labelText="Spread"
        input={
          <NumberInput
            min={1}
            max={128}
            step={1}
            placeholder="e.g. 10"
            defaultValue={options.spread}
            onChange={(spread) => handleOptionChange({ spread })}
          />
        }
        description="Distance between an edge and the background"
      />
      <FormControl
        labelText="Alpha Threshold"
        input={
          <NumberInput
            min={1}
            max={255}
            step={1}
            placeholder="e.g. 128"
            defaultValue={options.alphaThreshold}
            onChange={(alphaThreshold) =>
              handleOptionChange({ alphaThreshold })
            }
          />
        }
        description="At what transparency level is a pixel enabled"
      />

      <FormControl
        labelText="Output Bias"
        input={
          <NumberInput
            min={1}
            max={255}
            step={1}
            placeholder="e.g. 128"
            defaultValue={options.bias}
            onChange={(bias) => handleOptionChange({ bias })}
          />
        }
        description="What transparency to center an edge on"
      />

      <FormControl
        labelText="Up Res Factor"
        input={
          <NumberInput
            min={1}
            max={4}
            step={1}
            placeholder="e.g. 2"
            defaultValue={options.upResFactor}
            onChange={(upResFactor) => handleOptionChange({ upResFactor })}
          />
        }
        description="Scaling factor for image during calculations"
      />

      <FormControl
        labelText="In Color"
        input={
          <ColorInput
            placeholder="e.g. #000000"
            defaultValue={options.inColor}
            onChange={(inColor) => handleOptionChange({ inColor })}
          />
        }
        description="Color to use inside the shape"
      />

      <FormControl
        labelText="Out Color"
        input={
          <ColorInput
            placeholder="e.g. #000000"
            defaultValue={options.outColor}
            onChange={(outColor) => handleOptionChange({ outColor })}
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
