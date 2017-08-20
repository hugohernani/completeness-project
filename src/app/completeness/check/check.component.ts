import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';


@Component({
  selector: 'completeness-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  @Input() resource: any;
  // @Output() onCompletePercentage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  // ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  //   // TODO Watch Changes At Resource
  //   // See https://angular.io/guide/component-interaction#intercept-input-property-changes-with-ngonchanges
  //
  //   // Emit The Percentage Value When Changes Are Made
  // }

}
