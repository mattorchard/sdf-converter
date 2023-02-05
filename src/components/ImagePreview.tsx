import { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import "./ImagePreview.css";

export const ImagePreview: FunctionComponent<{
  image: HTMLImageElement | HTMLCanvasElement;
  title?: string
}> = ({ image, title, }) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const width =
    ("naturalWidth" in image ? image.naturalWidth : image.width);
  const height =
    ("naturalHeight" in image ? image.naturalHeight : image.height);
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.canvas.width = width;
    contextRef.current.canvas.height = height;
    contextRef.current.clearRect(0, 0, width, height);
    contextRef.current.drawImage(image, 0, 0, width, height);
  }, [image, width, height]);

  return (
    <canvas
      title={title}
      className="image-preview alpha-bg cartoon cartoon--color"
      ref={(canvas) => {
        if (contextRef.current?.canvas === canvas) return;
        contextRef.current = canvas?.getContext("2d") ?? null;
        if (contextRef.current) contextRef.current.drawImage(image, 0, 0);
      }}
    />
  );
};
