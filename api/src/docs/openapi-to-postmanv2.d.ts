declare module "openapi-to-postmanv2" {
  interface ConversionInput {
    type: "string" | "file" | "json";
    data: unknown;
  }

  type ConversionOptions = Record<string, unknown>;

  interface ConversionResultSuccess {
    result: true;
    output: Array<{ type: string; data: unknown }>;
  }

  interface ConversionResultFailure {
    result: false;
    reason: string;
  }

  type ConversionResult = ConversionResultSuccess | ConversionResultFailure;

  export function convert(
    input: ConversionInput,
    options: ConversionOptions,
    callback: (error: Error | null, result: ConversionResult) => void,
  ): void;
}
