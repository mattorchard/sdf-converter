export const colorPattern = "^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$";

const colorRegex = new RegExp(colorPattern);

export const isValidColor = (color: string) => colorRegex.test(color);
