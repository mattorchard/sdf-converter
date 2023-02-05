import { FunctionComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { createSdf, SdfOptions } from "../helpers/SdfWglHelpers";
import { ImagePreview } from "./ImagePreview";
import { InputForm } from "./InputForm";
import "./HomePage.css";
import { Button } from "./Button";
import { OutputCanvas, InputImage } from "../helpers/UtilTypes";
import { downloadUrl, removeExtension } from "../helpers/FileHelpers";
import Box from "./Box";
import { useOptions } from "../hooks/useOptions";


export const HomePage: FunctionComponent = () => {
  const [inputImages, setImages] = useState<InputImage[]>([]);
  const [options, setOptions] = useOptions();
  const [isOptionsValid, setIsOptionsValid] = useState(true);

  const [sdfImages, setSdfImages] = useState<OutputCanvas[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setSdfImages([]);
    if (isOptionsValid) {
      inputImages.forEach(async (inputImage) => {
        const sdf = await createSdf(inputImage, options);
        if (isCancelled) return;
        setSdfImages((i) => [...i, { metadata: inputImage.metadata, canvas: sdf }]);
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [inputImages, options, isOptionsValid]);

  const handleDownloadAll = useCallback(() =>
    sdfImages.forEach(({ canvas, metadata }) => {
      const url = canvas.toDataURL("image/png");
      const newName = `SDF_${removeExtension(metadata.name)}.png`;
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
            onValidityChange={setIsOptionsValid}
          />
        </SectionPane>

        <SectionPane title="Before" color="yellow">
          <Box flexDirection="column" gap={2}>
            {inputImages.map(({ image, metadata }) => (
              <ImagePreview image={image} metadata={metadata} />
            ))}
          </Box>
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
          <Box flexDirection="column" gap={2}>
            {sdfImages.map(({ canvas, metadata }) => (
              <ImagePreview image={canvas} metadata={metadata} />
            ))}
          </Box>
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