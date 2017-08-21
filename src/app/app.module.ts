import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CompletenessCheckService } from './completeness/shared/completeness-check.service';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [CompletenessCheckService],
  bootstrap: [AppComponent]
})
export class AppModule { }
