Feature: Login screen

  LVConnect should have a login screen with possibility to reset password if forgotten.

  Scenario: Simple login
    Given I'm using fresh database

    When I visit the "home" page
    And I type "benjamin.delamarre@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should be on "partner list" page

  Scenario: Forgot password
    Given I'm using fresh database

    When I visit the "home" page
    And I click the "forgot password button"
    And I type "benjamin.delamarre@link-value.fr" in "forgot password email input"
    And I click the "forgot password submit"
    Then I should be on "login" page
    And I wait "0.2" seconds
    And "1" emails should have been sent
    And "benjamin.delamarre@link-value.fr" should receive a "password reset" email

    When I consult asserted email
    And I click the "reset password email link"
    Then I should be on "password reset" page

    When I type "1234test" in "password change input"
    And I type "1234test" in "password change confirm input"
    And I click the "password change submit"
    Then I should be on "login" page

    When I type "benjamin.delamarre@link-value.fr" in "login email input"
    And I type "1234test" in "login password input"
    And I click the "login submit"
    Then I should be on "partner list" page

  Scenario: Login with disabled account
    Given I'm using fresh database

    When I visit the "home" page
    And I type "quentin.cerny@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should read "Ce compte est désactivé" in "login password helper text"

  Scenario: Login invalid credentials
    Given I'm using fresh database

    When I visit the "home" page
    And I type "romain.vacher@link-value.fr" in "login email input"
    And I type "test1234" in "login password input"
    And I click the "login submit"
    Then I should read "Email ou mot de passe invalide" in "login password helper text"

  Scenario: Reset password of disabled account
    Given I'm using fresh database

    When I visit the "home" page
    And I click the "forgot password button"
    And I type "quentin.cerny@link-value.fr" in "forgot password email input"
    And I click the "forgot password submit"
    Then I should read "Email invalide" in "forgot password email helper text"

  Scenario: Reset password of invalid account
    Given I'm using fresh database

    When I visit the "home" page
    And I click the "forgot password button"
    And I type "foo.bar@link-value.fr" in "forgot password email input"
    And I click the "forgot password submit"
    Then I should read "Email invalide" in "forgot password email helper text"
