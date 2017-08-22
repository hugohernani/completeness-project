import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { ResourceConditionValidator } from '../utils/validators';
import { ResourceCheck, SourceResourceCheck, WeightOptions, IResult } from '../utils/interfaces';

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

  addCompletenessTrack(resource: any, condition_type: string, attrs: Array<string>,
                        common_weigth?: string,
                        weights?: WeightOptions): Observable<IResult> {
    let resource_checks = attrs.map((attr) => { return {name: attr, condition_type: condition_type} });
    this.populateCompletenessChecksArr(resource, resource_checks, weights);

    // this.updateResults();
    return this.results.asObservable();
  }

  setWeightFor(attr_or_resource_check: string | ResourceCheck, weighting: string): void {
    let attr: string;

    if(typeof(attr_or_resource_check) === 'string'){ attr = attr_or_resource_check; }
    else{ attr = attr_or_resource_check.name; };

    let resource_check = this.resource_check_find(attr);
    if(resource_check === undefined){ throw new Error("None ResourceCheck Found For " + attr); }
    resource_check.weighting = weighting;
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
      percentage: Math.round(this.getCompletenessPercentage())
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
    if(weights !== undefined) this.default_weights = weights;

    for(let resource_check of resource_checks) {
      if (!resource_check.weighting) resource_check.weighting = 'medium';
      if(resource.hasOwnProperty(resource_check.name)){
        let source_resource_check = resource_check as SourceResourceCheck;
        source_resource_check.resource = resource;
        this.completeness_checks_arr.push(source_resource_check);
      }
    }
  }

  private resource_check_find(attr: string): SourceResourceCheck {
    return this.completeness_checks_arr.filter((r_check) => r_check.name === attr)[0];
  }
}
