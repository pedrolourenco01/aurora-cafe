// Background Web Worker to convert dark front-print pixels into light cream ink
// off the main thread using zero-copy Transferable ArrayBuffers.
self.onmessage = (event) => {
  const { buffer, width, height } = event.data
  const data = new Uint8ClampedArray(buffer)

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a < 20) continue
    const px = (i / 4) % width
    const py = Math.floor(i / 4 / width)
    // Preserve the dark [35] badge with yellow lettering
    if (px < width * 0.16 && py >= height * 0.21 && py <= height * 0.44) continue

    if (data[i] < 95 && data[i + 1] < 95 && data[i + 2] < 95) {
      data[i] = 237
      data[i + 1] = 224
      data[i + 2] = 200
    }
  }

  self.postMessage({ buffer: data.buffer, width, height }, [data.buffer])
}

