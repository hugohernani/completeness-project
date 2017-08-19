import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletenessCheckService } from './shared/completeness-check.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: []
})
export class CompletenessModule {
  static forRoot(){
    return {
      ngModule: CompletenessModule,
      providers: [ CompletenessCheckService ]
    }
  }
}
