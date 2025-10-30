*** Settings ***
Documentation       Cenários de testes do cadastro de usuários

Resource            ../resources/base.resource

Test Setup          Start Session
Test Teardown       Take Screenshot


*** Test Cases ***
Deve poder cadastrar um novo usuário
    ${user}    Create Dictionary
    ...    name=Marcelo
    ...    email=marcelo@mail.com
    ...    password=pwd123

    Remove user from database    ${user}[email]

    Go to signup page
    Submit signup form    ${user}
    Notice should be    Cadastro realizado com sucesso! Faça login.

Não deve permitir o cadastro com email duplicado
    [Tags]    dup

    ${user}    Create Dictionary
    ...    name=Marcelo
    ...    email=marcelo@mail.com
    ...    password=pwd123

    Remove user from database    ${user}[email]
    Insert user from database    ${user}

    Go to signup page
    Submit signup form    ${user}
    Alert should be    Usuário já existe
