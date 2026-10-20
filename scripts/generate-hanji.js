import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createHanjiPNG(width, height) {
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  // Pseudo-random helper
  let seed = 42;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // Pre-generate noise grid for subtle hanji paper fiber
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowBytes + 1);
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Base Hanji color: Warm ivory cream (#FAF7F2 -> r:250, g:247, b:242)
      let noise = (random() - 0.5) * 6;
      let r = Math.min(255, Math.max(0, Math.round(250 + noise)));
      let g = Math.min(255, Math.max(0, Math.round(247 + noise * 0.9)));
      let b = Math.min(255, Math.max(0, Math.round(242 + noise * 0.8)));

      // Subtle mulberry fiber streaks (닥나무 섬유)
      const fiberPattern1 = Math.sin(x * 0.05 + y * 0.02) * Math.cos(x * 0.02 - y * 0.04);
      if (Math.abs(fiberPattern1) > 0.82 && random() > 0.7) {
        r -= 6;
        g -= 7;
        b -= 8;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const assetsDir = path.resolve('public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(path.join(assetsDir, 'hanji_texture.png'), createHanjiPNG(256, 256));
console.log('Hanji texture PNG generated successfully!');
