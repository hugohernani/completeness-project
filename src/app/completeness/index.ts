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
export class CompletenessTrackModule {
  static forRoot(){
    return {
      ngModule: CompletenessTrackModule,
      providers: [ CompletenessCheckService ]
    }
  }
}

export * from './shared/completeness-check.service';
