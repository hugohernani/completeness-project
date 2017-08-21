import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CompletenessCheckService } from '../completeness/shared/completeness-check.service';

@Component({
  selector: 'completeness-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  completeness_percentage: number;

  constructor(private sanitizer: DomSanitizer,
              private completeness_service: CompletenessCheckService) {
    this.completeness_percentage = 0;
  }

  ngOnInit() {
    this.completeness_service.getResults()
      .subscribe((results) => {
        if(results) this.completeness_percentage = results.percentage;
      });
  }

  sanitizeStyle(property: string, value: any, meters: string): any {
    let style = property + ": " + value + meters;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
