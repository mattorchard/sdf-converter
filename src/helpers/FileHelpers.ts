export const downloadUrl = (url: string, name?: string) => {
  const anchor = document.createElement("a");
  anchor.download = name ?? "true";
  anchor.href = url;
  anchor.click();
};

export const removeExtension = (fileName: string) => {
  const endIndex = fileName.lastIndexOf(".");
  if (endIndex < 0) return fileName;
  return fileName.substring(0, endIndex);
};
