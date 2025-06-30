import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.DEV_GEMINI_API_KEY,
});

export interface TranscriptionResult {
  text: string;
  totalTokens: number;
}

export async function geminiTranscript(
  fileUri: string,
  contentType: string,
): Promise<TranscriptionResult> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', //音声は100万トークンあたり0.70ドル
      contents: createUserContent([
        createPartFromUri(fileUri, contentType),
        'Generate a transcript of the speech.',
      ]),
      config: {
        systemInstruction:
          'エンジニアの音声です。結果は日本語で生成してください。',
      },
    });

    if (!response.usageMetadata) {
      throw new Error('No usage metadata returned from Gemini API');
    }

    const promptTokens = response.usageMetadata.promptTokenCount ?? 0;
    const responseTokens = response.usageMetadata.candidatesTokenCount ?? 0;
    const totalTokens = promptTokens + responseTokens;

    console.log('Gemini API usage:', response.usageMetadata);
    console.log(
      `Prompt tokens: ${promptTokens}, ` +
        `Response tokens: ${responseTokens}, ` +
        `Total tokens: ${totalTokens}`,
    );

    return {
      text: response.text ?? '',
      totalTokens,
    };
  } catch (error) {
    console.error('書き起こしエラー:', error);
    throw error;
  }
}
