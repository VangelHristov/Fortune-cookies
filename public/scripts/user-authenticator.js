'use strict';

import $ from 'jquery';
import * as CryptoJS from 'crypto-js';
import toastr from 'toastr';

const
  storage   = window.localStorage,
  user  = 'username-key',
  hash      = 'passHash',
  logoutBtn = $('#logout'),
  loginBtns = $('#login');

let loggedIn = false;

function isLoggedIn() {
    return loggedIn;
}

function showLogout() {
    if (logoutBtn.hasClass('hidden')) {
        logoutBtn.removeClass('hidden');
    }
}

function showLogin() {
    if (loginBtns.hasClass('hidden')) {
        loginBtns.removeClass('hidden');
    }
}

function hideLogin() {
    if (!loginBtns.hasClass('hidden')) {
        loginBtns.addClass('hidden');
    }
}

function hideLogout() {
    if (!logoutBtn.hasClass('hidden')) {
        logoutBtn.addClass('hidden');
    }
}

function logIn(username) {
    loggedIn = true;

    $('#username-placeholder').text(username);
    hideLogin();
    showLogout();

    storage[user] = username;

    window.location = "#/home";
    toastr.success(`Welcome back ${username}.`);
}

function logOut() {
    loggedIn = false;
    hideLogout();
    showLogin();

    storage.removeItem(user);
    storage.removeItem(hash);
    toastr.success('Good bye.');
}

function checkForUsername() {
    let username = storage[user];
    if (username) {

        loggedIn = true;
        hideLogin();
        showLogout();

        $('#username-placeholder').text(username);
    }
}

function encrypt(password) {
    return CryptoJS.SHA1(password).toString();
}

export const userAuthenticator = {
    logIn,
    logOut,
    isLoggedIn,
    checkForUsername,
    encrypt
};
