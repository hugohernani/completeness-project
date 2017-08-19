import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export interface WeightOptions {
  readonly low: number,
  readonly medium: number,
  readonly high: number
}

export interface ResourceCheck {
  name: string,
  condition: (resource: any) => boolean,
  weighting: number; // medium weight
}

export interface SourceResourceCheck extends ResourceCheck {
  resource: any
}

@Injectable()
export class CompletenessCheckService {
  private default_weights: WeightOptions = {
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
    for(let resource_check of resource_checks) {
      if (!resource_check.weighting) resource_check.weighting = this.weights['medium'];
      if(resource.hasOwnProperty(resource_check.name)){
        let source_resource_check = resource_check as SourceResourceCheck;
        source_resource_check.resource = resource;
        this.completeness_checks_arr.push(source_resource_check);
      }
    }
  }

  maxCompletenessScore(): number {
    return this.completeness_checks_arr
      .map((source_check) => source_check.weighting)
      .reduce((prev, cur) => { return prev + cur }, 0);
  }

  passedChecks(): Array<ResourceCheck> {
    return this.allChecksAccordingToCheckState();
  }

  failedChecks(): Array<ResourceCheck> {
    return this.allChecksAccordingToCheckState(false);
  }

  completenessScore(): number {
    return this.passedChecks()
      .map((check) => check.weighting)
      .reduce((prev, cur) => { return prev + cur }, 0);
  }

  getCompletenessPercentage(): number {
    return this.completenessScore() / this.maxCompletenessScore() * 100;
  }

  getCompletenessResults(): Observable<number> {
    return this.results.asObservable();
  }

  private allChecksAccordingToCheckState(should_pass = true): Array<ResourceCheck> {
    return this.completeness_checks_arr
      .filter((source) => source.condition(source.resource) === should_pass);
  }
}
