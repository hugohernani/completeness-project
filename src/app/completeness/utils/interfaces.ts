interface IResultDictionary<T> {
  [key: string]: T;
}

interface BaseResourceCheck {
  name: string,
  weighting?: string
}

interface ConditionalResourceCheck extends BaseResourceCheck {
  condition?: (resource: any) => boolean
}

interface ValidatingResourceCheck extends BaseResourceCheck {
  condition_type?: string
}

export type ResourceCheck = ConditionalResourceCheck | ValidatingResourceCheck;

export interface SourceResourceCheck extends ConditionalResourceCheck, ValidatingResourceCheck {
  resource: any
}


//
export interface WeightOptions {
  readonly low: number,
  readonly medium: number,
  readonly high: number
}

export interface IResult {
  score: number,
  max_score: number,
  passed_checks: string[],
  failed_checks: string[],
  percentage: number
}
