import { TestBed, inject } from '@angular/core/testing';

import { ResourceConditionValidator, CompletenessCheckService } from './completeness-check.service';

describe('ResourceConditionValidator', () => {
  let static_class, valid_source, invalid_source;

  beforeEach(() =>{
    static_class = ResourceConditionValidator;
    valid_source = { resource: {title: 'Testing'}, name: 'title', condition_type: 'presence' }
    invalid_source = { resource: {title: ''}, name: 'title', condition_type: 'presence' }
  });

  it('should be valid', () => {
    expect(static_class.validate(valid_source)).toBeTruthy();
  });

  it('should be Invalid', () => {
    expect(static_class.validate(invalid_source)).toBeFalsy();
  })
});

describe('CompletenessCheckService', () => {
  let service, user, resource_checks, attrs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompletenessCheckService]
    });
  });

  beforeEach(inject([CompletenessCheckService], s => {
    service = s;

    user = { name: 'Name', age: undefined, genre: '', profession: 'student' };
    attrs = ['name', 'age', 'genre'];
    service.setCompletenessChecks(user, 'presence', attrs);
    service.setWeightFor('name', 'high');
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the amount of checks defined', () => {
    let completeness_checks = service.getAllCompletenessChecks();
    expect(completeness_checks.length).toEqual(attrs.length);
  });


  it('should return the amount of Passed checks defined', () => {
    let service_passed_checks = service.getPassedChecks();
    let filtered_resource_checks = attrs.filter((attr) => {
      return user[attr] !== undefined && user[attr].length > 0
    });
    expect(service_passed_checks.length).toEqual(filtered_resource_checks.length);
  });

  it('should return the amount of Failed checks defined', () => {
    let service_failed_checks = service.getFailedChecks();
    let filtered_resource_checks = attrs.filter((attr) => {
      return !(user[attr] !== undefined && user[attr].length > 0);
    });
    expect(service_failed_checks.length).toEqual(filtered_resource_checks.length);
  });

  it('should return the maximum of completeness score', () => {
    let max_completeness_score = service.getMaxCompletenessScore();
    expect(max_completeness_score).toEqual(220); // TODO
  });

  it('should return the percentage of completeness score', () => {
    let completeness_percentage = service.getCompletenessPercentage();
    // one passed test with weighting 100 divided by total of 3 testings
    // where two of default gets default weigth (60) and the other is the
    // passed tesd with weighting 100. All of it multiplied by 100 to get percentage.
    expect(completeness_percentage).toEqual((100) / (60 + 60 + 100) * 100);
  });

  it('should return the completeness score of approved resource checks', () => {
    let completeness_score = service.getCompletenessScore();
    let score_sum = service.default_weights['high']; // age + genre + name
    expect(completeness_score).toEqual(score_sum);
  });

  it('should return a not empty object when updating a service with some results', () => {
    service.updateResults();
    service.getResults()
      .subscribe((results) => {
        expect(results).not.toEqual({});
      })
  });

});
