export async function uint8ArrayToDataURL(uint8Array: Uint8Array, mimeType: string = "image/png"): Promise<string> {
  const blob = new Blob([uint8Array], { type: mimeType });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
