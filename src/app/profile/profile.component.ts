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

  constructor(public completeness_service: CompletenessCheckService){
    this.user = new User(42, '');

  }

  ngOnInit() {
    this.completeness_service.addCompletenessTrack(
      this.user, 'presence', ['name', 'age']
    )

    this.completeness_service.addCompletenessTrack(
      this.user, 'presence', ['genre']
    )
  }

  ngDoCheck(): void {
    this.completeness_service.updateResults();
  }
}
