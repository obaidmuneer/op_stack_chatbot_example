
export const create_chunks = (str, chunk_size, chunk_overlap = 0) => {
  if (chunk_size <= 0 || chunk_overlap < 0 || chunk_overlap >= chunk_size) {
    throw new Error('Invalid chunkSize or chunkOverlap values.');
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < str.length) {
    const endIndex = Math.min(startIndex + chunk_size, str.length);
    chunks.push(str.slice(startIndex, endIndex));
    startIndex += chunk_size - chunk_overlap;
  }

  return chunks;
}
