import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import { AiService } from "./ai.service";
import type { FileUpload } from "graphql-upload-minimal";


export type VoiceExtraction = {
  id: string;
  transcription: string;
  title: string;
  amount: number;
  suggestedCategoryId?: string;
  suggestedCategoryName?: string;
};

type CategorySummary = { id: string; name: string };

export class VoiceService {
  private openai: OpenAI | null;

  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  private ensureClient() {
    if (!this.openai) {
      throw new Error(
        "Missing OPENAI_API_KEY. Please add it to backend/.env to enable voice transcription."
      );
    }
    return this.openai;
  }

  private async persistUpload(file: FileUpload) {
    if (!file || typeof (file as any).createReadStream !== "function") {
      throw new Error("Invalid upload payload received.");
    }
    console.log("[voice] persistUpload: saving temp file", {
      filename: file.filename,
      mimetype: (file as any).mimetype,
      encoding: (file as any).encoding,
    });
    const uploadDir = path.join(__dirname, "..", "..", "tmp", "voice");
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const tempFilePath = path.join(uploadDir, `${randomUUID()}-${file.filename}`);
    const stream = file.createReadStream();
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempFilePath);
      stream
        .pipe(writeStream)
        .on("finish", () => resolve())
        .on("error", (err: any) => reject(err));
    });
    return tempFilePath;
  }

  private async transcribe(tempFilePath: string, language?: string): Promise<string> {
    const client = this.ensureClient();
    const fileStream = fs.createReadStream(tempFilePath);
    console.log("[voice] transcribe: start", { tempFilePath });

    // Prefer GPT-4o transcription if available, otherwise fall back to whisper-1
    try {
      const transcription = await client.audio.transcriptions.create({
        file: fileStream,
        model: "gpt-4o-transcribe",
        ...(language ? { language } : {}),
      });
      if ((transcription as any)?.text) {
        return (transcription as any).text as string;
      }
    } catch (error) {
      console.warn("[voice] gpt-4o-transcribe failed, falling back to whisper-1", error);
    }

    const whisper = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      ...(language ? { language } : {}),
    });
    console.log("[voice] transcribe: whisper completed");
    return (whisper as any)?.text ?? "";
  }

  private async extractStructuredData(
    transcription: string,
    currency?: string,
    categories?: CategorySummary[]
  ) {
    const client = this.ensureClient();
    const currencyHint = currency ? `The expense currency is "${currency}". if the currency is d cut the last 3 zeros` : "";
    const categoryList = categories?.length
      ? `Choose the best matching category from this list: ${categories
          .map((c) => `"${c.name}"`)
          .join(", ")}.`
      : "";
    const prompt = `
    Most used languages are german or english.
    You are a financial assistant. Extract a spending title and amount from the user's transcription.
    ${currencyHint}
    ${categoryList}
    If you cannot find an amount, use 0. Use the amount as a number only (no symbols).
    If the currency is Vietnamese Dong (VND), do not format with thousands separators or decimals; just return the plain integer amount.

Return JSON of the shape:
{
  "title": "string",
  "amount": number,
  "category": "one of the provided categories or empty string if none"
}
`;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt.trim(),
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content =
      completion.choices?.[0]?.message?.content ||
      JSON.stringify({ title: transcription.slice(0, 60), amount: 0 });

    let parsed: { title?: string; amount?: number; category?: string } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { title: transcription.slice(0, 60), amount: 0, category: "" };
    }

    const title =
      (parsed.title && String(parsed.title).trim()) ||
      transcription ||
      "Voice transaction";
    const amount = parsed.amount !== undefined ? Number(parsed.amount) : 0;
    const category = (parsed.category && String(parsed.category).trim()) || "";

    return { title, amount: Number.isFinite(amount) ? amount : 0, category };
  }

  private async suggestCategory(
    ai: AiService | undefined,
    title: string,
    categories?: CategorySummary[]
  ) {
    if (!ai || !categories?.length) return {};
    try {
      const labels = categories.map((c) => c.name);
      const result = await ai.categorizeExpense(title, labels, false);
      const match = categories.find((c) => c.name === result.label);
      if (match) {
        return { suggestedCategoryId: `${match.id}`, suggestedCategoryName: match.name };
      }
    } catch (error) {
      console.warn("[voice] category suggestion failed", error);
    }
    return {};
  }

  /**
   * Process uploaded audio: persist temporarily, transcribe, extract title/amount, cleanup temp file.
   */
  async processVoiceExpense(options: {
    upload: Promise<FileUpload> | FileUpload;
    ai?: AiService;
    categories?: CategorySummary[];
    currency?: string;
    language?: string;
  }): Promise<VoiceExtraction> {
    const { upload, ai, categories, currency, language } = options;
    const resolvedUpload = (await Promise.resolve(upload)) as FileUpload;
    const tempFilePath = await this.persistUpload(resolvedUpload);
    try {
      const transcription = await this.transcribe(tempFilePath, language);
      const { title, amount, category } = await this.extractStructuredData(
        transcription,
        currency,
        categories
      );

      // Try to map the model-picked category to an existing one; fallback to AI categorizer.
      let categorySuggestion = {};
      if (category && categories?.length) {
        const match = categories.find(
          (c) => c.name.toLowerCase() === category.toLowerCase()
        );
        if (match) {
          categorySuggestion = {
            suggestedCategoryId: `${match.id}`,
            suggestedCategoryName: match.name,
          };
        }
      }
      if (!("suggestedCategoryId" in categorySuggestion) && categories?.length) {
        categorySuggestion = await this.suggestCategory(ai, title, categories);
      }

      return {
        id: `temp-${randomUUID()}`,
        transcription,
        title,
        amount,
        ...categorySuggestion,
      };
    } finally {
      fs.promises
        .unlink(tempFilePath)
        .catch(() => null); // best-effort cleanup
      console.log("[voice] cleanup temp file", { tempFilePath });
    }
  }
}

export const voiceService = new VoiceService();
export default voiceService;
