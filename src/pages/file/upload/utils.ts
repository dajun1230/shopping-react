const CHUNK_SIZE = 0.1 * 1024 * 1024;

const blobToString = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.onload = function () {
      console.log('result', reader.result);
      const ret = reader.result
        .split('')
        .map((v: any) => v.charCodeAt())
        .map((v: any) => v.toString(16).toUpperCase())
        // .map((v) => v.padStart(2, "0"));
        .join(' ');
      resolve(ret);
    };
    reader.readAsBinaryString(blob);
  });
};

const isGif = async (file: Blob) => {
  // GIF89a 和 GIF87a
  // 前面6个16进制 '47 49 46 38 39 61' 或者 '47 49 46 38 37 61'
  // 16进制的转换
  const ret = await blobToString(file.slice(0, 6));
  console.log('isGif', ret);
  const isGif = ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61';
  return isGif;
};

const isPng = async (file: Blob) => {
  const ret = await blobToString(file.slice(0, 8));
  console.log('isPng', ret);
  const isPng = ret === '89 50 4E 47 0D 0A 1A 0A';
  return isPng;
};

const isJpg = async (file: Blob) => {
  const len = file.size;
  const start = await blobToString(file.slice(0, 6));
  const tail = await blobToString(file.slice(-2, len));
  const isJpg = start === 'FF D8' && tail === 'FF D9';
  return isJpg;
};

const isImage = async (file: Blob) => {
  // 通过文件流判定
  // 先判定是不是gif
  return (await isGif(file)) || (await isPng(file)) || (await isJpg(file));
};

const createFileChunk = (file: Blob, size = CHUNK_SIZE) => {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push({ index: cur, file: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunks;
};

export { blobToString, isGif, isPng, isJpg, isImage, createFileChunk };
