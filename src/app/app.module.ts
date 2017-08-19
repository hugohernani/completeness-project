import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CompletenessCheckService } from './completeness/shared/completeness-check.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [CompletenessCheckService],
  bootstrap: [AppComponent]
})
export class AppModule { }
