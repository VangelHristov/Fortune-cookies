'use strict';

import toastr from 'toastr';

const
  usernameRegx    = /^[A-Za-z0-9._]{6,30}/,
  passwordRegx    = /^[^\s]{6,}$/,
  cookieTextRegex = /.{6,30}/,
  urlRegex        = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;

function validatePassword(password) {
    if (passwordRegx.test(password)) {
        return true;
    }

    toastr.info('The password should be at least 6 characters long and can\'t contain spaces.');
    return false;
}

function validateUsername(name) {
    if (usernameRegx.test(name)) {
        return true;
    }

    toastr.info('The username must be between 6 and 30 symbols long, and can contain only alpha-numeric characters, "_" and ".".');
    return false;
}

function validateUrl(url) {
    if (urlRegex.test(url)) {
        return true;
    }

    // url is optional, but if provided must be valid
    if (!url) {
        return true;
    }

    toastr.error('Invalid image url.');
    return false;
}

function validateText(text) {
    if (cookieTextRegex.test(text)) {
        return true;
    }

    toastr.info('The text and category of the cookie must be between 6 and 30 characters.');
    return false;
}

export const validator = {
    validatePassword,
    validateText,
    validateUrl,
    validateUsername
};