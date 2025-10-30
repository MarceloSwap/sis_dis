*** Settings ***
Documentation        Ações e elementos da página de login

Library        Browser

*** Keywords ***
Submit login form
    [Arguments]        ${user}

    Fill Text    id=loginEmail       ${user}[email]
    Fill Text    id=loginPassword    ${user}[password]

    Click        css=button[type=submit] >> text=Entrar


