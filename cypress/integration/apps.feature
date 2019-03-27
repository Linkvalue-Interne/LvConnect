Feature: Applications listing

  LVConnect should provide an interface to handle create/edit/delete of third party
  applications to be authorized to access it's data.

  Scenario: Listing existing applications
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application list" page
    Then page should contain "1" "application list row"
    And I should read "Test appLorem ipsum dolor sit ametDELAMARRE Benjamin" in "application list row" number "1"
    And I should see "application add button"

  Scenario: Create application
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application list" page
    And I click the "application add button"
    Then I should be on "application add" page

    When I type "Foo" in "application name input"
    And I type "Lorem ipsum" in "application description input"
    And I type "http://foo.bar{enter}http://localhost:3000" in "application redirect uris input"
    And I click the "checkbox list item" number "1"
    And I click the "application add submit"
    Then I should be on "application list" page
    And page should contain "2" "application list row"

  Scenario: Edit application
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application list" page
    And I click the "application list row" number "1"
    Then I should read value "5c9a72e8066cd3341852cf2e" in "application client id input"
    And "application client id input" should be readonly
    And I should read value "5c9a72e8066cd3341852cf2e5c9a72e8066cd3341852cf2e" in "application client secret input"
    And "application client secret input" should be readonly

    When I type "{selectall}Edited app" in "application name input"
    And I click the "application edit submit"
    Then I should be on "application list" page
    And I should read "Edited appLorem ipsum dolor sit ametDELAMARRE Benjamin" in "application list row" number "1"

  Scenario: Delete application
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application list" page
    And I click the "application list row" number "1"
    And I click the "application delete button"
    Then I should see "application delete dialog"

    When I click the "application delete submit"
    Then page should contain "0" "application list row"
