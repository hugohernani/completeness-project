import { Component, OnInit, DoCheck } from '@angular/core';
import { Address } from './shared/address';
import { CompletenessCheckService } from '../completeness/shared/completeness-check.service';

@Component({
  selector: 'completeness-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, DoCheck {
  address: Address;

  constructor(public completeness_service: CompletenessCheckService) {
    this.address = new Address('Street X', 1234);
  }

  ngOnInit() {
    this.completeness_service.addCompletenessTrack(
      this.address, 'presence', ['street','number','city','state']
    )
  }

  ngDoCheck(): void {
    this.completeness_service.updateResults();
  }
}
