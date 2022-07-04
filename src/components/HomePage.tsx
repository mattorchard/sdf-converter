import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { loadImageUrl } from "../helpers/ImageHelpers";
import { createSdf } from "../helpers/SdfWglHelpers";

import { ImagePreview } from "./ImagePreview";
import { InputForm } from "./InputForm";
import "./HomePage.css";
import sampleSrc from "../samples/star-4k.png";

export const HomePage: FunctionComponent = () => {
  const [previewImage, setPreviewImage] = useState<HTMLCanvasElement | null>(
    null
  );
  useEffect(() => {
    loadImageUrl(sampleSrc).then((image) =>
      setPreviewImage(
        createSdf(image, { upResFactor: 1, alphaThreshold: 128, spread: 30 })
      )
    );
  }, []);
  return (
    <>
      <h1 className="visually-hidden">SDF Converter</h1>
      <main className="home-page-grid">
        <section className="section-pane pink">
          <h2>Input</h2>
          <InputForm />
        </section>
        <section className="section-pane yellow">
          <h2>Preview</h2>
          {previewImage && <ImagePreview image={previewImage} />}
        </section>
        <section className="section-pane blue">
          <h2>Output</h2>
        </section>
      </main>
    </>
  );
};
