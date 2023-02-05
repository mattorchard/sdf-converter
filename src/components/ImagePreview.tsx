import { FunctionComponent } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { ImageMetadata } from "../helpers/UtilTypes";
import "./ImagePreview.css";

export const ImagePreview: FunctionComponent<{
  image: HTMLImageElement | HTMLCanvasElement;
  metadata: ImageMetadata
}> = ({ image, metadata, }) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const redrawImage = useCallback(() => {
    if (!contextRef.current) return;
    const { width, height } = metadata;
    contextRef.current.canvas.width = width;
    contextRef.current.canvas.height = height;
    contextRef.current.clearRect(0, 0, width * 2, height * 2);
    contextRef.current.drawImage(image, 0, 0, width, height);
  }, [image, metadata]);

  useEffect(() => {
    redrawImage();
  }, [redrawImage]);

  return (
    <canvas
      title={metadata.name}
      className="image-preview alpha-bg cartoon cartoon--color"
      ref={(canvas) => {
        if (contextRef.current?.canvas === canvas) return;
        contextRef.current = canvas?.getContext("2d") ?? null;
        if (contextRef.current) redrawImage();
      }}
    />
  );
};
