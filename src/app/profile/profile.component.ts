import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from './shared/user';
import { CompletenessCheckService } from '../completeness/shared/completeness-check.service';

@Component({
  selector: 'completeness-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit, DoCheck {
  user: User;
  profile_completeness: number;

  constructor(private sanitizer: DomSanitizer,
              public completeness_service: CompletenessCheckService){
    this.user = new User(42, '');
    this.profile_completeness = 0;
  }

  ngOnInit() {
    this.completeness_service.setCompletenessChecks(
      this.user, 'presence', ['name', 'age', 'genre']
    ).subscribe((results) => {
      if(results) this.profile_completeness = results.percentage;
    });
  }

  ngDoCheck(): void {
    this.completeness_service.updateResults();
  }

  sanitizeStyle(property: string, value: any, meters: string): any {
    let style = property + ": " + value + meters;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
