import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { ResourceConditionValidator } from '../utils/validators';
import { ResourceCheck, SourceResourceCheck, WeightOptions, IResult, IResultDictionary } from '../utils/interfaces';

@Injectable()
export class CompletenessCheckService{
  public default_weights: WeightOptions;
  private completeness_checks_arr: Array<SourceResourceCheck>;
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

  getMaxCompletenessScore(resource?: any): number {
    return this.calculatedScore(filteredByResource(resource))
  }

  getPassedChecks(resource?: any): Array<ResourceCheck> {
    return this.getAllChecksAccordingToCheckState(true, resource);
  }

  getFailedChecks(resource?: any): Array<ResourceCheck> {
    return this.getAllChecksAccordingToCheckState(false, resource);
  }

  getAllCompletenessChecks(): Array<ResourceCheck> {
    return this.completeness_checks_arr;
  }

  getCompletenessScore(resource?: any): number {
    return this.calculatedScore(this.getPassedChecks(resource))
  }

  getCompletenessPercentage(current_resource?: any): number {
    return this.getCompletenessScore(current_resource) / this.getMaxCompletenessScore(current_resource) * 100;
  }

  resultsPerResource(): any {
    let resource_results: IResultDictionary<string> = {};
    for(let completeness_check of this.completeness_checks_arr) {
      let current_resource = completeness_check.resource;
      resource_results[current_resource.constructor.name] = {
        score: this.getCompletenessScore(current_resource),
        max_score: this.getMaxCompletenessScore(current_resource),
        passed_checks: this.getPassedChecks(current_resource).map((r) => r.name),
        failed_checks: this.getFailedChecks(current_resource).map((r) => r.name),
        percentage: Math.round(this.getCompletenessPercentage(current_resource))
      }
    }
    return resource_results;
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
      percentage: Math.round(this.getCompletenessPercentage()),
      per_resources: this.resultsPerResource()
    }));
  }

  private getAllChecksAccordingToCheckState(should_pass = true, resource?: any): Array<ResourceCheck> {
    return filteredByResource(resource)
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

  private calculatedScore(list_checks: Array<SourceResourceCheck>): number {
    return list_checks
      .map((source_check) => this.default_weights[source_check.weighting])
      .reduce((prev, cur) => { return prev + cur }, 0);
  }

  private filteredByResource(list_checks: Array<SourceResourceCheck>,
                     resource?: any): Array<SourceResourceCheck> {
    if(typeof(resource) !== undefined){
      return this.completeness_checks_arr
        .filter((source) => source.resource === resource);
    }
    return this.completeness_checks_arr;
  }
}
