import { FunctionComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { createSdf, SdfOptions } from "../helpers/SdfWglHelpers";
import { ImagePreview } from "./ImagePreview";
import { InputForm } from "./InputForm";
import "./HomePage.css";
import { Button } from "./Button";
import { NamedCanvas, NamedImage } from "../helpers/UtilTypes";
import { downloadUrl, removeExtension } from "../helpers/FileHelpers";
import Box from "./Box";

const defaultOptions: SdfOptions = {
  upResFactor: 2,
  spread: 10,
  alphaThreshold: 128,
  inColor: "#000000FF",
  outColor: "#00000000",
};

export const HomePage: FunctionComponent = () => {
  const [inputImages, setImages] = useState<NamedImage[]>([]);
  const [options, setOptions] = useState(defaultOptions);

  const [sdfImages, setSdfImages] = useState<NamedCanvas[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setSdfImages([]);
    inputImages.forEach(async ({ name, image }) => {
      const sdf = await createSdf(image, options);
      if (isCancelled) return;
      setSdfImages((i) => [...i, { name, canvas: sdf }]);
    });
    return () => {
      isCancelled = true;
    };
  }, [inputImages, options]);

  const handleDownloadAll = useCallback(() =>
    sdfImages.forEach(({ canvas, name }) => {
      const url = canvas.toDataURL("image/png");
      const newName = `SDF_${removeExtension(name)}.png`;
      downloadUrl(url, newName);
    })
    , [sdfImages]);

  return (
    <>
      <h1 className="visually-hidden">SDF Converter</h1>
      <main className="home-page-grid">
        <SectionPane title="Options" color="pink">
          <InputForm
            options={options}
            onImagesChange={setImages}
            onOptionsChange={setOptions}
          />
        </SectionPane>

        <SectionPane title="Before" color="yellow">
          {inputImages.map(({ image }) => (
            <ImagePreview image={image} />
          ))}
          {inputImages.length === 0 && (
            <p className="nis-description">Input images will appear here</p>
          )}
        </SectionPane>

        <SectionPane title="After" color="blue">
          {sdfImages.length > 1 &&
            <Box mb={0.5}>
              <Button onClick={handleDownloadAll}>Download all</Button>
            </Box>
          }
          {sdfImages.map(({ canvas }) => (
            <ImagePreview image={canvas} downResFactor={options.upResFactor} />
          ))}
          {sdfImages.length === 0 && (
            <p className="nis-description">Output images will appear here</p>
          )}

        </SectionPane>
      </main>
    </>
  );
};

const SectionPane: FunctionComponent<{ color: string, title: string, }> = ({ color, title, children }) =>
  <section className={`section-pane ${color}`}>
    <Box as="header" mb={0.5}>
      <h2>{title}</h2>
    </Box>
    {children}
  </section>