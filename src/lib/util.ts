export async function uint8ArrayToDataURL(uint8Array: Uint8Array, mimeType: string = "image/png"): Promise<string> {
  const blob = new Blob([uint8Array], { type: mimeType });
  return await blobToDataURL(blob);
}

export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getRandomColor() {
  // ランダムなパステルカラーを生成
  const r = Math.floor(Math.random() * 128 + 128);
  const g = Math.floor(Math.random() * 128 + 128);
  const b = Math.floor(Math.random() * 128 + 128);

  // 各成分を16進数に変換し、ゼロ埋めで2桁にする
  const toHex = (c: number) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
