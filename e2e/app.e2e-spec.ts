import { CompletenessProjectPage } from './app.po';

describe('completeness-project App', () => {
  let page: CompletenessProjectPage;

  beforeEach(() => {
    page = new CompletenessProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to completeness!');
  });
});
