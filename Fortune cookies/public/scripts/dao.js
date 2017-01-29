import 'jquery';
import moment from 'moment';

export const DB = (() => {
    "use strict";

    const X_HEADER = 'x-auth-key',
        AUTH_KEY = 'fortune-cookie-auth-key',
        STORAGE = window.localStorage,
        STRINGIFY = JSON.stringify;

    function getAuthKey() {
        return STORAGE.getItem(AUTH_KEY);
    }

    function setAuthKey(key) {
        STORAGE.setItem(AUTH_KEY, key);
    }

    function formatDate(date) {
        return moment(date).format('DD.MM.YYYY HH:mm');
    }

    function parse(response) {
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
             .done((response) => resolve(parse(response)))
             .fail((error) => reject(error.responseText));
        });
    }

    function getAllUsers() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'api/users',
                headers: {[X_HEADER]: getAuthKey()},
                contentType: 'application/json',
                success: (response) => resolve(response.result),
                error: (error) => reject(error.responseText)
            });
        });
    }

    function createUser(user) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/users',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: STRINGIFY(user),
                success: (response) => resolve(response.result),
                error: (error) => reject(error.responseText)
            });
        });
    }

    function authUser(user) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/auth',
                method: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: STRINGIFY(user),
                success: (response) => {
                    setAuthKey(response.result.authKey);
                    resolve(response.result.username);
                },
                error: (error) => reject(error.responseText)
            });
        });
    }

    function shareCookie(cookie) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/cookies',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: STRINGIFY(cookie),
                headers: {[X_HEADER]: getAuthKey()},
                success: resolve,
                error: (error) => reject(error.responseText)
            });
        });
    }

    function rateCookie(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/api/cookies/${data.id}`,
                method: 'PUT',
                headers: {[X_HEADER]: getAuthKey()},
                data: STRINGIFY({type: data.type}),
                contentType: 'application/json',
                success: resolve,
                error: (error) => reject(error.responseText)
            });
        });
    }

    function getMyCookie() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'api/my-cookie',
                headers: {[X_HEADER]: getAuthKey()},
                contentType: 'application/json',
                success: (response) => resolve(parse(response)),
                error: (error) => reject(error.responseText)
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

    return {
        getAllUsers,
        createUser,
        authUser,
        getAllCookies,
        shareCookie,
        rateCookie,
        getMyCookie,
        getCategory
    };
})();
