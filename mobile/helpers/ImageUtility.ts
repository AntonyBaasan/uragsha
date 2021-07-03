// create base64 string prefix.
// (only for image file)
export function getBase64TypePrefix(extension: string | undefined) {
  if (extension) {
    return `data:image/${extension};base64,`;
  }
  return 'data:image/png;base64,';
}
