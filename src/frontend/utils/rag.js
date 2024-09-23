import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";

export const vectorizeData = async (data, isQuery = false) => {
  const embeddings = new JinaEmbeddings({
    apiKey: import.meta.env.VITE_JINA,
    model: "jina-embeddings-v2-base-en",
  });
  return isQuery
    ? await embeddings.embedQuery(data)
    : await embeddings.embedDocuments([data]);
};

export const performRAG = async (query, chatHistory, db) => {
  const queryVector = await vectorizeData(query, true);
  const storedVectors = await db.vectors.toArray();
  const files = await db.files.toArray();

  if (storedVectors.length === 0 || files.length === 0) {
    throw new Error("No vectors or files found in the database");
  }

  const relevantVectors = storedVectors
    .map((v) => ({
      vector: v.vector[0],
      similarity: cosineSimilarity(queryVector, v.vector[0]),
    }))
    .sort((a, b) => b.similarity - a.similarity);
  
  const topRelevantVector = relevantVectors.slice(0, 1);

  const relevantTexts = topRelevantVector.map((v) => {
    const index = storedVectors.findIndex((s) => s.vector[0] === v.vector);
    return files[index].content;
  });

  const SystemPrompt = `You are an AI assistant that will answer questions pertaining to the uploaded content. 
    Only use the information enclosed in "-" to answer the user's questions and nothing else:
    ----------------------------------------

    ${relevantTexts.join("\n\n")}
    
    ----------------------------------------
    Return Markdown format with proper hyperlinks. Bold important information. Give proper spacing and formatting.
    DO NOT answer any questions or perform any task's not related to the given information. 
    DO NOT make up any information or provide false information.
    If the user talks normally, you can converse normally as well.
    If the answer is not in the content, say the word “Unknown".`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);


  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 1,
    apiKey: import.meta.env.VITE_GEM,
  });


  const chain = RunnableSequence.from([
    {
      input: (initialInput) => initialInput.input,
      chat_history: (initialInput) => initialInput.chat_history,
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    input: query,
    chat_history: chatHistory,
  });

  return response;
};

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((acc, curr, i) => acc + curr * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, curr) => acc + curr ** 2, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, curr) => acc + curr ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
