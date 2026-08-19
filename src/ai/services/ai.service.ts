import { Injectable } from "@nestjs/common";

export type CategorizeResult = {
  label: string;
  score: number;
  labels: string[];
  scores: number[];
};

@Injectable()
export class AiService {
  private classifierPromise: Promise<any> | null = null;

  private async getClassifier() {
    if (!this.classifierPromise) {
      this.classifierPromise = (async () => {
        const { pipeline } = await import("@xenova/transformers");
        return pipeline("zero-shot-classification", "Xenova/bart-large-mnli");
      })();
    }
    return this.classifierPromise;
  }

  async categorizeExpense(
    text: string,
    labels: string[],
    multiLabel: boolean = false
  ): Promise<CategorizeResult> {
    if (!text || !labels?.length) {
      throw new Error("categorizeExpense requires 'text' and a non-empty 'labels' array");
    }

    const classifier = await this.getClassifier();
    const out = await classifier(text, labels, { multi_label: multiLabel });

    const result: CategorizeResult = {
      label: out.labels?.[0] ?? "",
      score: out.scores?.[0] ?? 0,
      labels: out.labels ?? [],
      scores: out.scores ?? [],
    };

    return result;
  }
}

export const aiService = new AiService();
