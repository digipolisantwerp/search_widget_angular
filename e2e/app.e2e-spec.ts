import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display "Search Smart Widget"', () => {
    expect(page.getTitleText()).toContain('Search Smart Widget');
  });
});
