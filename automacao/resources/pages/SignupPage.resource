*** Settings ***
Documentation            Elementos e ações da página de cadastro

Library        Browser
Resource       ../env.resource
Resource       ../base.resource

*** Keywords ***
Go to signup page
    Click    text=Cadastre-se
    
    # Checkpoint
    Sleep    1s
    Wait For Elements State        css=h2 >> text=Criar Conta        visible      5

Submit signup form
    [Arguments]        ${user}

    Wait For Elements State    id=registerName        visible    5
    Fill Text        id=registerName        ${user}[name]
    Fill Text        id=registerEmail       ${user}[email]
    Fill Text        id=registerPassword    ${user}[password]

    Click            css=button[type=submit] >> text=Cadastrar


