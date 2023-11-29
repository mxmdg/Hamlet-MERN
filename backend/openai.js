const { OpenAI } = require('openai');

//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* async function main() {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "The quick brown fox jumped over the lazy dog",
  });

  console.log(embedding);
}

main(); */

console.log(process.env)