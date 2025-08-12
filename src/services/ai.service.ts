/*
  AI Service (Nest-like) for app-wide usage.
  Provides categorizeExpense using @xenova/transformers zero-shot-classification.
  Note: We use dynamic import to support current CommonJS build (no ESM interop issues).
*/

export type CategorizeResult = {
  label: string;
  score: number;
  labels: string[];
  scores: number[];
};

export class AiService {
  // Cache the classifier to avoid reloading the model for every call
  private classifierPromise: Promise<any> | null = null;

  private async getClassifier() {
    if (!this.classifierPromise) {
      this.classifierPromise = (async () => {
        // Dynamic import to avoid ESM/CJS issues
        const { pipeline } = await import("@xenova/transformers");
        // Default model: English NLI. Swap to multilingual if needed.
        return pipeline("zero-shot-classification", "Xenova/bart-large-mnli");
      })();
    }
    return this.classifierPromise;
  }

  /**
   * Categorize an expense title/description against the given candidate labels.
   * @param text The text to classify (e.g. expense title or merchant line)
   * @param labels Candidate labels to choose from
   * @param multiLabel If true, will consider multiple labels (defaults to false => single best)
   */
  async categorizeExpense(
    text: string,
    labels: string[],
    multiLabel: boolean = false
  ): Promise<CategorizeResult> {
    if (!text || !labels?.length) {
      throw new Error("categorizeExpense requires 'text' and a non-empty 'labels' array");
    }

    const classifier = await this.getClassifier();

    // The classifier returns { labels: string[], scores: number[] }
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

// Export a singleton instance for app-wide usage
export const aiService = new AiService();
export default aiService;
