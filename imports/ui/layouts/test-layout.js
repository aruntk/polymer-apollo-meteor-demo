import './test-layout.html';

Polymer({
  is: 'test-layout',
  behaviors: [mwcMixin],
  properties: {
    route: Object,
    routeData: {
      type: Object,
      value() {
        return {
          page: 'home',
        };
      },
    },
    appState: {
      type: String,
    },
    notCordova: Boolean,
  },
  trackers: ['changeStatus(routeData.page)'],
  changeStatus(page) {
    if (!page) {
      return this.set('routeData.page', 'home');
    }
    if (!Meteor.isCordova) {
      this.notCordova = true;
    }
    return this.set('appState', `Status: ${Meteor.status().status}, Page: ${page}`);
  },

  second() {
    this.set('routeData.page', 'second');
  },
  home() {
    this.set('routeData.page', '');
  },
});
