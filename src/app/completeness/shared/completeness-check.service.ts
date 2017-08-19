import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export interface WeightOptions {
  low: number,
  medium: number,
  high: number
}

@Injectable()
export class CompletenessCheckService {
  private default_weigths: WeightOptions = {
    low: 30,
    medium: 60,
    high: 100
  };


  // Observable string sources
  private results = new Subject<any>();

  // Observable string streams
  resultsStream$ = this.results.asObservable();

  // Service message commands
  updateCompleteness(resource: any, { weigths = default_weigths, required_checks }, { weigths: WeightOptions, required_checks: any }): Observable<number> {
    // TODO Check completeness for resource
    this.results.next(results);
  }

  confirmMission(astronaut: string): Observable<number> {
    this.missionConfirmedSource.next(astronaut);
  }
}
