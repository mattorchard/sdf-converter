import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { loadImage } from "../helpers/ImageHelpers";
import { Button } from "./Button";
import { ImagePreview } from "./ImagePreview";
import "./InputForm.css";

export const InputForm: FunctionComponent = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const handlePickFiles = async () => {
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
    setImages(loadedImages);
  };

  return (
    <form className="input-form">
      <Button onClick={handlePickFiles}> Pick files</Button>
      {images.map((image, index) => (
        <ImagePreview key={index} image={image} />
      ))}
    </form>
  );
};
