'use strict';

const header  = 'x-auth-key',
      authKey  = 'fortune-cookie-auth-key',
      storage   = window.localStorage,
      stringify = JSON.stringify;

function formatDate(date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
}

function parseResponse(response) {
    if (Array.isArray(response.result) && response.result[0].shareDate) {

        response.result.forEach((cookie) => cookie.shareDate = formatDate(cookie.shareDate));
        return response.result;
    } else if (response.result.shareDate) {

        response.result.shareDate = formatDate(response.result.shareDate);
        return response.result;
    }

    return response.result;
}

function getAllCookies() {
    return new Promise((resolve, reject) => {
        $.getJSON('/api/cookies')
         .done((response) => resolve(parseResponse(response)))
         .fail((error) => reject(error.responseText));
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : 'api/users',
            headers    : {[header]: storage.getItem(authKey)},
            contentType: 'application/json',
            success    : (response) => resolve(response.result),
            error      : (error) => reject(error.responseText)
        });
    });
}

function createUser(user) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : '/api/users',
            method     : 'POST',
            contentType: 'application/json',
            dataType   : 'json',
            data       : stringify(user),
            success    : (response) => resolve(response.result),
            error      : (error) => reject(error.responseText)
        });
    });
}

function authUser(user) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : '/api/auth',
            method     : 'PUT',
            contentType: 'application/json',
            dataType   : 'json',
            data       : stringify(user),
            success    : (response) => {
                storage.setItem(authKey, response.result.authKey);
                resolve(response.result.username);
            },
            error      : (error) => reject(error.responseText)
        });
    });
}

function shareCookie(cookie) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : '/api/cookies',
            method     : 'POST',
            contentType: 'application/json',
            dataType   : 'json',
            data       : stringify(cookie),
            headers    : {[header]: storage.getItem(authKey)},
            success    : resolve,
            error      : (error) => reject(error.responseText)
        });
    });
}

function rateCookie(data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : `/api/cookies/${data.id}`,
            method     : 'PUT',
            headers    : {[header]: storage.getItem(authKey)},
            data       : stringify({type: data.type}),
            contentType: 'application/json',
            success    : resolve,
            error      : (error) => reject(error.responseText)
        });
    });
}

function getMyCookie() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url        : 'api/my-cookie',
            headers    : {[header]: storage.getItem(authKey)},
            contentType: 'application/json',
            success    : (response) => resolve(parseResponse(response)),
            error      : (error) => reject(error.responseText)
        });
    });
}

function getCategory(category) {
    return new Promise((resolve, reject) => {
        getAllCookies()
          .then((response) => {
              let categoryCookies = response.filter((cookie) => cookie.category === category);
              resolve(categoryCookies);
          })
          .catch((error) => reject(error.responseText));
    });
}

const db = {
    getAllUsers,
    createUser,
    authUser,
    getAllCookies,
    shareCookie,
    rateCookie,
    getMyCookie,
    getCategory
};
