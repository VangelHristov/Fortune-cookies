import 'jquery';
import * as CryptoJS from 'crypto';

export const UTIL = (() => {
    "use strict";

    const STORAGE = window.localStorage,
        USER = 'username-key',
        PASSHASH = 'passHash',
        USERNAME_PATTERN = /^[A-Za-z0-9._]{6,30}/,
        PASSWORD_PATTERN = /^[^\s]{6,}$/,
        TEXT_PATTERN = /.{6,30}/,
        URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
        ROOT = $('#root'),
        ALERT = $('<div />')
            .attr('id', 'alert')
            .addClass('alert col-lg-4'),
	LOGOUT_BTN = $('#logout'),
	LOGIN_BTNS = $('#login');

    let loggedIn = false;

    function isLoggedIn() {
        return loggedIn;
    }

    function confirm(message) {
        ALERT
            .removeClass('alert-danger')
            .addClass('alert-success')
            .text(`Success: ${message}`)
            .appendTo(ROOT);

        setTimeout(() => ALERT.remove(), 2000);
    }

    function warn(message) {
        ALERT
            .removeClass('alert-success')
            .addClass('alert-danger')
            .text(`Warning: ${message}`)
            .appendTo(ROOT);

        setTimeout(() => ALERT.remove(), 2000);
    }

    function validatePassword(password) {
        if (PASSWORD_PATTERN.test(password)) {
            return true;
        }

        warn('The password should be at least 6 characters long and can\'t contain spaces.');
        return false;
    }

    function validateUsername(name) {
        if (USERNAME_PATTERN.test(name)) {
            return true;
        }

        warn('The username must be between 6 and 30 symbols long, and can contain only alpha-numeric characters, "_" and ".".');
        return false;
    }

    function validateUrl(url) {
        if (URL_PATTERN.test(url)) {
            return true;
        }

        // url is optional, but if provided must be valid
        if (!url) {
            return true;
        }

        warn('Invalid image url.');
        return false;
    }

    function validateText(text) {
        if (TEXT_PATTERN.test(text)) {
            return true;
        }

        warn('The text and category of the cookie must be between 6 and 30 characters.');
        return false;
    }

    function logIn(username) {
        loggedIn = true;

        $('#username-placeholder').text(username);
        hideLogin();
	showLogout();

        STORAGE[USER] = username;

        window.location = "#/home";
        confirm('You have signed up.');
    }

    function logOut() {
        loggedIn = false;
        hideLogout();
	showLogin();

        STORAGE.removeItem(USER);
        STORAGE.removeItem(PASSHASH);
        window.location.reload(true);
        confirm('You have logged out.');
    }

    function checkForUsername() {
        let username = STORAGE[USER];
        if (username) {

            loggedIn = true;
            hideLogin();
	    showLogout();

            $('#username-placeholder').text(username);
        }
    }

    function showLogout(){
	if(LOGOUT_BTN.hasClass('hidden')){
	     	LOGOUT_BTN.removeClass('hidden');
	}
    }

    function showLogin(){
	if(LOGIN_BTNS.hasClass('hidden')){
	     	LOGIN_BTNS.removeClass('hidden');
	}
    }

    function hideLogin(){
	if(!LOGIN_BTNS.hasClass('hidden')){
	     	LOGIN_BTNS.addClass('hidden');
	}	
    }

    function hideLogout(){
	if(!LOGOUT_BTN.hasClass('hidden')){
	     	LOGOUT_BTN.addClass('hidden');
	}	
    }

    function encrypt(password) {
        return CryptoJS.SHA1(password).toString();
    }

    return {
        logIn,
        logOut,
        isLoggedIn,
        checkForUsername,
        warn,
        confirm,
        validatePassword,
        validateUsername,
        validateText,
        validateUrl,
        encrypt
    };
})();
