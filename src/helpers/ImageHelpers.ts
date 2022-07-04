export const loadImage = async (file: File): Promise<HTMLImageElement> => {
  let imageUrl = URL.createObjectURL(file);
  try {
    return await loadImageUrl(imageUrl);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

export const loadImageUrl = (url: string): Promise<HTMLImageElement> => {
  const image = new Image();
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image`));
  });
  image.src = url;
  return promise;
};

export const getImageData = () => {};
