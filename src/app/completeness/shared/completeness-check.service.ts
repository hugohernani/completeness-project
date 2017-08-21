import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';

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

export interface IResult {
  score: number,
  max_score: number,
  passed_checks: string[],
  failed_checks: string[],
  percentage: number
}

export interface BaseResourceCheck {
  name: string,
  weighting?: string
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
export class CompletenessCheckService{
  public default_weights: WeightOptions;
  private completeness_checks_arr;
  private results: BehaviorSubject<IResult>;
  constructor(){
      this.default_weights = { low: 30, medium: 60, high: 100 };
      this.completeness_checks_arr = [];
      this.results = new BehaviorSubject<IResult>(null);
  }


  setCompletenessChecks(resource: any, condition_type: string, attrs: Array<string>,
                        weights?: WeightOptions): Observable<IResult>;
  setCompletenessChecks(resource: any,
                     resource_checks: Array<ResourceCheck>,
                     weights?: WeightOptions): Observable<IResult>;
  setCompletenessChecks(resource: any,
                        condition_type_or_resource_checks: string | Array<ResourceCheck>,
                        attrs_or_weigths?: Array<string> | WeightOptions, opt_weights?: WeightOptions): Observable<IResult> {

    let resource_checks: Array<ResourceCheck>;
    let weights: WeightOptions;
    if(typeof condition_type_or_resource_checks === 'string'){
      weights = opt_weights;
      for(let attr of (attrs_or_weigths as Array<string>)){
        let resource_check = {name: attr, condition_type: condition_type_or_resource_checks};
        resource_checks.push(resource_check);
      }
    }else{
      weights = attrs_or_weigths as WeightOptions;
      resource_checks = condition_type_or_resource_checks as Array<ResourceCheck>;
    }
    if(weights === undefined) weights = this.default_weights;

    this.populateCompletenessChecksArr(resource, resource_checks, weights);

    // this.updateResults();
    return this.results.asObservable();
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

  getResults(): Observable<IResult> {
    return this.results.asObservable();
  }

  updateResults(): void {
    this.results.next(Object.assign({
      score: this.getCompletenessScore(),
      max_score: this.getMaxCompletenessScore(),
      passed_checks: this.getPassedChecks().map((r) => r.name),
      failed_checks: this.getFailedChecks().map((r) => r.name),
      percentage: this.getCompletenessPercentage()
    }));
  }

  private getAllChecksAccordingToCheckState(should_pass = true): Array<ResourceCheck> {
    return this.completeness_checks_arr
      .filter(function(source){
        let result = false;
        if(source.condition_type){ result = ResourceConditionValidator.validate(source); }
        else if(source.condition){ result = source.condition(source.resource); }
        return result === should_pass;
      });
  }

  private populateCompletenessChecksArr(resource: any,
                                        resource_checks: Array<ResourceCheck>,
                                        weights: WeightOptions) {
    this.default_weights = weights;

    for(let resource_check of resource_checks) {
      if (!resource_check.weighting) resource_check.weighting = 'medium';
      if(resource.hasOwnProperty(resource_check.name)){
        let source_resource_check = resource_check as SourceResourceCheck;
        source_resource_check.resource = resource;
        this.completeness_checks_arr.push(source_resource_check);
      }
    }
  }
}
