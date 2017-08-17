import { browser, by, element } from 'protractor';

export class CompletenessProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('completeness-root h1')).getText();
  }
}
