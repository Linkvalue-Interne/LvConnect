Feature: OAuth authentication

  LVConnect should provide a way to authenticate from any app with an authorization process.

  Scenario: OAuth authorization from scratch
    Given I'm using fresh database

    When I visit the "authorize app" page
    And I type "benjamin.delamarre@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should see "oauth permissions list"
    And page should contain "2" "oauth permissions list item"
    And I should read "Visionner votre profil" in "oauth permissions list item" number "1"
    And I should read "Modification de votre profil" in "oauth permissions list item" number "2"

    When I click the "oauth permissions submit"
    Then I should be on "oauth callback" page
    And I should read "Test app" in "oauth callback app name"
    And I should read "Successfully" in "oauth callback auth code status"
    And I should read "Successfully" in "oauth callback refresh token status"
    And I should read "Benjamin DELAMARRE" in "oauth callback profile status"
    And I should read "No state given" in "oauth callback state"

  Scenario: OAuth authorize with partial permissions
    Given I'm using fresh database

    When I visit the "authorize app" page
    And I type "vanessa.roy@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then page should contain "1" "oauth permissions list item"

  Scenario: Authorize when already logged in
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize app" page
    Then I should see "oauth permissions list"
    And page should contain "2" "oauth permissions list item"

  Scenario: Already logged in and authorized
    Given I'm using fresh database
    And I'm logged as "vanessa.roy@link-value.fr"

    When I visit the "authorize app with scopes" page
    Then I should be on "oauth callback" page
    And I should read "Vanessa ROY" in "oauth callback profile status"

  Scenario: Decline permissions
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize app" page
    And I click the "oauth permissions deny"
    And I should read "Permissions denied" in "oauth callback error"

  Scenario: Authorize with scopes
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize app with scopes" page
    Then page should contain "1" "oauth permissions list item"

  Scenario: Authorize with state
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize app with state" page
    And I click the "oauth permissions submit"
    And I should read "State is: foo" in "oauth callback state"

  Scenario: Authorize with wildcard redirect uri
    Given I'm using fresh database

    When I visit the "authorize app with wildcard redirect uri" page
    And I type "benjamin.delamarre@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should see "oauth permissions list"
    And page should contain "2" "oauth permissions list item"

  Scenario: Invalid app
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize invalid app" page
    Then I should see "not found page"
    And I should read "404" in "not found code"
    And I should read "L'application n'existe pas" in "not found message"

  Scenario: Invalid redirect uri
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize invalid redirect" page
    Then I should see "not found page"
    And I should read "403" in "not found code"
    And I should read "URL de redirection invalide" in "not found message"

  Scenario: Invalid wildcard redirect uri
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize invalid wildcard redirect" page
    Then I should see "not found page"
    And I should read "403" in "not found code"
    And I should read "URL de redirection invalide" in "not found message"

  Scenario: Invalid scopes
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize invalid scopes" page
    Then I should see "not found page"
    And I should read "403" in "not found code"
    And I should read "Scopes invalides" in "not found message"

  Scenario: Missing scopes in app
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "authorize missing scopes" page
    Then I should see "not found page"
    And I should read "403" in "not found code"
    And I should read "Scopes invalides" in "not found message"

  Scenario: Disabled account
    Given I'm using fresh database

    When I visit the "authorize app" page
    And I type "quentin.cerny@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should read "Ce compte est désactivé" in "login password helper text"

  Scenario: Disabled account already logged in
    Given I'm using fresh database
    And I'm logged as "quentin.cerny@link-value.fr"

    When I visit the "authorize app" page
    Then I should see "login email input"
