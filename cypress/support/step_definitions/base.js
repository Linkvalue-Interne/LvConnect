/* eslint-disable import/no-extraneous-dependencies */

import merge from 'lodash/merge';
import moment from 'moment';

import constants from './constants';

Given(/^I'm using fresh database$/, () => {
  cy.fixture('seed').then((seed) => {
    cy.task('database:clean', seed);
  });
});

Given(/^I'm using fresh database with "(.*)" seed$/, (additionalSeedName) => {
  cy.visit('/');
  cy.fixture('seed').then((seed) => {
    cy.fixture(constants.seeds[additionalSeedName]).then((additionalSeed) => {
      cy.task('database:clean', merge({}, seed, additionalSeed));
    });
  });
});

Given(/^I'm logged as "(.*)"$/, (email) => {
  cy.fixture('seed').then((seed) => {
    const loggedUser = seed.User.find(user => user.email === email);

    if (!loggedUser) {
      throw new Error(`Invalid email: ${email}`);
    }

    cy.task('login', loggedUser.email).then((token) => {
      window.localStorage.setItem('access_token', token);
      cy.wrap(token).as('accessToken');
      cy.log(`Access token set to: ${token}`);
      cy.window().then((win) => {
        win.dispatchEvent(new Event('reload'));
      });
    });
  });
});

Given(/^I'm using "(.*)" viewport$/, (device) => {
  cy.viewport(device);
});

Given(/^clock is set to "(.*)"$/, (date) => {
  cy.clock(moment(date).valueOf(), ['Date']);
});

When(/^I reload current tab$/, () => {
  cy.reload();
});

When(/I logout/, () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

When(/^I reload page data$/, () => {
  cy.window().then((win) => {
    win.dispatchEvent(new Event('reload'));
  });
});

When(/^I visit the "(.*)" page$/, (pageName) => {
  const pageUrl = constants.pages[pageName];
  if (!pageUrl) {
    throw new Error(`Unkown page: ${pageName}`);
  }
  cy.visit(pageUrl);
});

When(/^I click(?: on| the)? "(.*)" number "(.*)"$/, (element, index) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .as('focusedElement')
    .click();
});

When(/^I click(?: on| the)? "(.*)"$/, (element) => {
  cy.get(constants.selectors[element])
    .as('focusedElement')
    .click();
});

When(/^I type "(.*)" in "(.*)" "(\d+)"$/, (value, element, index) => {
  cy.get(constants.selectors[element].replace('{{index}}', index - 1)).type(value);
});

When(/^I type "(.*)" in "(.*)" number "(\d+)"$/, (value, element, index) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .type(value);
});

When(/^I type "(.*)" in "(.*)"$/, (value, element) => {
  cy.get(constants.selectors[element]).type(value);
});

When(/^I type "(.*)" in focused element$/, (value) => {
  cy.get('@focusedElement').type(value, { force: true });
});

When(/^I select "(.*)" in "(.*)" "(\d+)"$/, (value, element, index) => {
  cy.get(constants.selectors[element].replace('{{index}}', index - 1)).select(value);
});

When(/^I select "(.*)" in "(.*)"$/, (value, element) => {
  cy.get(constants.selectors[element]).click();
  cy.get(`[data-value="${value}"]`).click();
});

When(/^I set "(.*)" to today's date "(plus|minus)" "(\d+)" "(.*)"$/, (element, operator, value, unit) => {
  const date = moment()[operator === 'plus' ? 'add' : 'subtract'](parseInt(value, 10), unit);
  cy.get(constants.selectors[element]).type(date.format('YYYY-MM-DD'));
});

When(/^I scroll to "(.*)"$/, (position) => {
  cy.get(constants.selectors['app container']).scrollTo(position);
});

When(/^I wait "(.*)" seconds?$/, (time) => {
  cy.wait(parseFloat(time) * 1000);
});

When(/^I consult asserted email$/, () => {
  cy.get('@emailUrl').then((emailId) => {
    cy.visit(`/testing/emails/${emailId}`);
  });
});

Then(/^page should contain "(\d+)" "(.*)"$/, (number, element) => {
  cy.get(constants.selectors[element]).should('have.length', parseInt(number, 10));
});

Then(/^"(.*)" number "(.*)" should contain "(\d+)" "(.*)"$/, (container, index, number, element) => {
  cy.get(constants.selectors[container])
    .eq(parseInt(index, 10) - 1)
    .find(constants.selectors[element])
    .should('have.length', parseInt(number, 10));
});

Then(/^I should see "(.*)"$/, (element) => {
  cy.get(constants.selectors[element]).should('be.visible');
});

Then(/^I should not see "(.*)"$/, (element) => {
  cy.get(constants.selectors[element]).should('not.be.visible');
});

Then(/^I should not read "(.*)" in "(.*)"$/, (text, element) => {
  cy.get(constants.selectors[element]).should('not.contain', text);
});

Then(/^"(.*)" number "(.*)" should be empty$/, (element, index) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .invoke('text')
    .should('be.empty');
});

Then(/^I should read "(.*)" in "(.*)" number "(.*)"$/, (text, element, index) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .should('contain', text);
});

Then(/^I should read "(.*)" in "(.*)"$/, (text, element) => {
  cy.get(constants.selectors[element]).should('contain', text);
});

Then(/^I should read value "(.*)" in "(.*)"$/, (text, element) => {
  cy.get(constants.selectors[element]).should('have.value', text);
});

Then(/^I should be on "(.*)" page$/, (pageName) => {
  cy.url().should('contain', constants.pages[pageName]);
});

Then(/^focused element value should be "(.*)"$/, (text) => {
  cy.get('@focusedElement').should('have.value', text);
});

Then(/^"(.*)" should (not )?be disabled$/, (element, negative) => {
  cy.get(constants.selectors[element]).should(`${negative ? 'not.' : ''}have.attr`, 'disabled');
});

Then(/^"(.*)" should (not )?be readonly$/, (element, negative) => {
  cy.get(constants.selectors[element]).should(`${negative ? 'not.' : ''}have.attr`, 'readonly');
});

Then(/^"(.*)" number "(.*)" should (not )?be checked$/, (element, index, negative) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .should(`${negative ? 'not.' : ''}to.be.checked`);
});

Then(/^"(.*)" should (not )?be checked$/, (element, negative) => {
  cy.get(constants.selectors[element]).should(`${negative ? 'not.' : ''}to.be.checked`);
});

Then(/^"(.*)" link should point to "(.*)" with token$/, (element, url) => {
  cy.get(constants.selectors[element])
    .should('have.attr', 'href')
    .and('include', `${url}?token=`);
});

Then(/^"(.*)" should receive (?:a|an) "(.*)" email$/, (to, template) => {
  const emailId = `${constants.emails[template]}_${to}`;
  cy.task('emails:get', emailId).should('exist');
  cy.wrap(emailId).as('emailUrl');
});

Then(/^"(\d+)" emails should have been sent$/, (number) => {
  cy.task('emails:count').should('equal', parseInt(number, 10));
});

Then(/^"(.*)" number "(\d+)" should have CSS property "(.*)" with value "(.*)"$/, (element, index, property, value) => {
  cy.get(constants.selectors[element])
    .eq(index - 1)
    .should('have.css', property, value);
});
