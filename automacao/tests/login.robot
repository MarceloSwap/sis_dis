*** Settings ***
Documentation        Cenários de autenticação do usuário

Library         Collections
Resource        ../resources/base.resource

Test Setup      Start Session
Test Teardown   Take Screenshot

*** Test Cases ***
Deve poder logar com um usuário pré-cadastrado

    ${user}    Create Dictionary
    ...    name=Marcelo
    ...    email=marcelo@mail.com
    ...    password=pwd123
    
    Remove user from database    ${user}[email]
    Insert user from database    ${user}
    
    Submit login form           ${user}
    User should be logged in    ${user}[name]

Não deve logar com senha inválida

    ${user}    Create Dictionary
    ...    name=Friedrich Nietzsche 
    ...    email=friedrich@mail.com
    ...    password=123456
    
    Remove user from database    ${user}[email]
    Insert user from database    ${user}

    Set To Dictionary    ${user}        password=abc123
    
    Submit login form       ${user}
    Alert should be        Credenciais inválidas