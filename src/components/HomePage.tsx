import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { createSdf, SdfOptions } from "../helpers/SdfWglHelpers";
import { ImagePreview } from "./ImagePreview";
import { InputForm } from "./InputForm";
import "./HomePage.css";

const defaultOptions: SdfOptions = {
  upResFactor: 2,
  spread: 10,
  alphaThreshold: 128,
};

export const HomePage: FunctionComponent = () => {
  const [inputImages, setImages] = useState<HTMLImageElement[]>([]);
  const [options, setOptions] = useState(defaultOptions);

  const [sdfImages, setSdfImages] = useState<HTMLCanvasElement[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setSdfImages([]);
    inputImages.forEach(async (image) => {
      const sdf = await createSdf(image, options);
      if (isCancelled) return;
      setSdfImages((i) => [...i, sdf]);
    });
    return () => {
      isCancelled = true;
    };
  }, [inputImages, options]);
  return (
    <>
      <h1 className="visually-hidden">SDF Converter</h1>
      <main className="home-page-grid">
        <section className="section-pane pink">
          <h2>Options</h2>
          <InputForm
            images={inputImages}
            options={options}
            onImagesChange={setImages}
            onOptionsChange={setOptions}
          />
        </section>
        <section className="section-pane yellow">
          <h2>Before</h2>
          {inputImages.map((image) => (
            <ImagePreview image={image} />
          ))}
          {inputImages.length === 0 && (
            <p className="nis-description">Input images will appear here</p>
          )}
        </section>
        <section className="section-pane blue">
          <h2>After</h2>
          {sdfImages.map((image) => (
            <ImagePreview image={image} downResFactor={options.upResFactor} />
          ))}
          {sdfImages.length === 0 && (
            <p className="nis-description">Output images will appear here</p>
          )}
        </section>
      </main>
    </>
  );
};
