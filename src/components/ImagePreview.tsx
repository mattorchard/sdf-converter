import { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

export const ImagePreview: FunctionComponent<{
  image: HTMLImageElement | HTMLCanvasElement;
}> = ({ image }) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (contextRef.current) contextRef.current.drawImage(image, 0, 0);
  }, [image]);
  return (
    <canvas
      className="image-preview"
      width={"naturalWidth" in image ? image.naturalWidth : image.width}
      height={"naturalHeight" in image ? image.naturalHeight : image.height}
      ref={(canvas) => {
        if (contextRef.current?.canvas === canvas) return;
        contextRef.current = canvas?.getContext("2d") ?? null;
        if (contextRef.current) contextRef.current.drawImage(image, 0, 0);
      }}
    />
  );
};
