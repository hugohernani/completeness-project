import { SourceResourceCheck } from './interfaces';

export class ResourceConditionValidator {
  static validate(source: SourceResourceCheck): boolean {
    if(source.condition_type.toLowerCase() === 'presence'){
      return !!source.resource[source.name];
    }
  }
}
