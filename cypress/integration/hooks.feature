Feature: Hooks for applications

  LVConnect should provide a way for applications to register web hooks that will listen
  to modifications made to users.

  Scenario: Create a hook
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application list" page
    And I click the "application list row" number "1"
    Then page should contain "1" "hook list row"

    When I click the "hook add button"
    Then I should be on "hook add" page

    When I type "Test hook" in "hook name input"
    And I type "foo.bar" in "hook uri input"
    And I click "checkbox list item" number "2"
    And I type "azertyuiopqsdfghjklmwxcvbnazertyuiopqsdfghjklmwxcvbn" in "hook secret input"
    And I click the "hook add submit"

    Then I should be on "application edit" page
    And page should contain "2" "hook list row"
    And I should read "Test hookhttps://foo.bar" in "hook list row" number "2"

  Scenario: Edit hook
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "application edit" page
    And I click on "hook list row" number "1"
    Then I should be on "hook edit" page

    When I type "{selectall}Edited hook" in "hook name input"
    And I click the "hook edit submit"
    Then I should be on "application edit" page
    And I should read "Edited hookhttp://localhost:8000/testing/hooks/5c9a72e8066cd3341852df2c" in "hook list row" number "1"

  Scenario: Delete hook
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "hook edit" page
    And I click the "hook delete button"
    Then page should contain "0" "hook list row"

  Scenario: Inactive hooks not triggered
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "hook edit" page
    Then page should contain "0" "hook runs list row"

    When I visit the "partner edit" page
    And I type "Edited" in "partner last name input"
    And I click the "partner edit submit"
    And I visit the "hook edit" page
    Then page should contain "0" "hook runs list row"

  Scenario: Active hooks triggered
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "hook edit" page
    Then page should contain "0" "hook runs list row"

    When I click the "hook active checkbox"
    And I click the "hook edit submit"

    Given I'm logged as "vanessa.roy@link-value.fr"
    When I visit the "partner edit" page
    And I type "{selectall}Edited" in "partner last name input"
    And I click the "partner edit submit"
    And I wait "0.2" seconds
    And I visit the "hook edit" page
    Then page should contain "1" "hook runs list row"

    When I click the "hook runs list row" number "1"
    And I scroll to "bottom"
    Then I should read "200" in "hook run status"
    And I should read "X-LVConnect-Event: user:modified" in "hook run request headers"
    And I should read "X-LVConnect-Signature: sha1=" in "hook run request headers"
    And I should read "X-LVConnect-Delivery:" in "hook run request headers"
    And I should read "Request URL: http://localhost:8000/testing/hooks/5c9a72e8066cd3341852df2c" in "hook run request headers"
    And I should read ""lastName": "EDITED"," in "hook run request payload"

    When I click the "hook run response tab"
    Then I should read ""status": "Ok"" in "hook run response payload"

  Scenario: Active hooks triggered with error
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "hook edit" page
    And I click the "checkbox list item" number "1"
    And I click the "checkbox list item" number "3"
    And I click the "hook active checkbox"
    And I click the "hook edit submit"

    Given I'm logged as "vanessa.roy@link-value.fr"
    When I visit the "partner add" page
    And I type "Foo" in "partner first name input"
    And I type "Bar" in "partner last name input"
    And I type "foo@bar.com" in "partner email input"
    And I click the "partner add submit"
    And I wait "0.2" seconds
    And I visit the "hook edit" page
    Then page should contain "1" "hook runs list row"

    When I click the "hook runs list row" number "1"
    Then I should read "400" in "hook run status"
    And I should read "X-LVConnect-Event: user:created" in "hook run request headers"

    When I click the "hook run response tab"
    Then I should read ""message": "invalid_event"" in "hook run response payload"
