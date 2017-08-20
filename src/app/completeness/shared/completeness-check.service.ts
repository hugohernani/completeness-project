import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export class ResourceConditionValidator {
  static validate(source: SourceResourceCheck): boolean {
    if(source.condition_type.toLowerCase() === 'presence'){
      return !!source.resource[source.name];
    }
  }
}

export interface WeightOptions {
  readonly low: number,
  readonly medium: number,
  readonly high: number
}

export interface BaseResourceCheck {
  name: string,
  weighting?: number
}

export interface ConditionalResourceCheck extends BaseResourceCheck {
  condition?: (resource: any) => boolean
}

export interface ValidatingResourceCheck extends BaseResourceCheck {
  condition_type?: string
}

export type ResourceCheck = ConditionalResourceCheck | ValidatingResourceCheck;

export interface SourceResourceCheck extends ConditionalResourceCheck, ValidatingResourceCheck {
  resource: any
}

@Injectable()
export class CompletenessCheckService {
  public default_weights: WeightOptions = {
    low: 30,
    medium: 60,
    high: 100
  };

  private completeness_checks_arr: Array<SourceResourceCheck> = [];

  // Observable results sources
  private results = new Subject<any>();

  setCompletenessChecks(resource: any,
                     resource_checks: Array<ResourceCheck>,
                     weights: WeightOptions = this.default_weights): void {
    this.default_weights = weights;
    for(let resource_check of resource_checks) {
      if (!resource_check.weighting) resource_check.weighting = weights['medium'];
      if(resource.hasOwnProperty(resource_check.name)){
        let source_resource_check = resource_check as SourceResourceCheck;
        source_resource_check.resource = resource;
        this.completeness_checks_arr.push(source_resource_check);
      }
    }
  }

  getMaxCompletenessScore(): number {
    return this.completeness_checks_arr
      .map((source_check) => this.default_weights[source_check.weighting])
      .reduce((prev, cur) => { return prev + cur }, 0);
  }

  getPassedChecks(): Array<ResourceCheck> {
    return this.getAllChecksAccordingToCheckState();
  }

  getFailedChecks(): Array<ResourceCheck> {
    return this.getAllChecksAccordingToCheckState(false);
  }

  getAllCompletenessChecks(): Array<ResourceCheck> {
    return this.completeness_checks_arr;
  }

  getCompletenessScore(): number {
    return this.getPassedChecks()
      .map((check) => this.default_weights[check.weighting])
      .reduce((prev, cur) => { return prev + cur }, 0);
  }

  getCompletenessPercentage(): number {
    return this.getCompletenessScore() / this.getMaxCompletenessScore() * 100;
  }

  // getCompletenessResults(): Observable<number> {
  //   return this.results.asObservable();
  // }

  private getAllChecksAccordingToCheckState(should_pass = true): Array<ResourceCheck> {
    return this.completeness_checks_arr
      .filter(function(source){
        let result = false;
        if(source.condition_type){ result = ResourceConditionValidator.validate(source); }
        else if(source.condition){ result = source.condition(source.resource); }
        return result === should_pass;
      });
  }
}
