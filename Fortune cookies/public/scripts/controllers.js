import {DB} from 'dao';
import {GET_TEMPLATE} from 'templates';
import {EVENT_HANDLER} from 'event-handlers';
import {UTIL} from 'utils';

export const CONTROLLER = (() => {
    "use strict";

    const CONTENT = $('#content');

    function home() {
        let allCookies = DB.getAllCookies(),
            homeTemplate = GET_TEMPLATE('home');

        Promise.all([allCookies, homeTemplate])
            .then(([cookies, template]) => {
                CONTENT.html(template(cookies));
                $('.like, .dislike').click(EVENT_HANDLER.rate);
                $('.share').click(EVENT_HANDLER.share);
                $('#logout').click(UTIL.logOut);
            });
    }

    function category(category) {
        let categoryCookies = DB.getCategory(category),
            categoryTemplate = GET_TEMPLATE('home');

        Promise.all([categoryCookies, categoryTemplate])
            .then(([cookies, template]) => {
                CONTENT.html(template(cookies));
                $('.like, .dislike').click(EVENT_HANDLER.rate);
                $('.share').click(EVENT_HANDLER.share);
            });
    }

    function myCookie() {
        if(!UTIL.isLoggedIn()){
            return UTIL.warn('You must be logged in.');
        }

        let myCookie = DB.getMyCookie(),
            myCookieTemplate = GET_TEMPLATE('my-cookie');

        Promise.all([myCookie, myCookieTemplate])
            .then(([cookie, template]) => {
                CONTENT.html(template(cookie));
                $('.like, .dislike').click(EVENT_HANDLER.rate);
                $('.share').click(EVENT_HANDLER.share);
            });
    }

    function login(){
        GET_TEMPLATE('login')
            .then((template) => {
                CONTENT.html(template);
                $('#form-login').submit(EVENT_HANDLER.loginForm);
            });
    }

    function signUp(){
        GET_TEMPLATE('sign-up')
            .then((template) => {
                CONTENT.html(template);
                $('#form-sign-up').submit(EVENT_HANDLER.signUpForm);
            });
    }

    function shareNewCookie(){
        if(!UTIL.isLoggedIn()){
            return UTIL.warn('You must be logged in.');
        }

        GET_TEMPLATE('share-cookie')
            .then((template) => {
                CONTENT.html(template);
                $('#form-share').submit(EVENT_HANDLER.shareForm)
            });
    }

    function update(location){
        switch(location){
            case '#/home' : home();
                break;
            case '#/my-cookie' : myCookie();
                break;
            default:
                let categoryName = location.substring(location.lastIndexOf('/') + 1);
                category(categoryName);
        }
    }

    return {home, category, myCookie, login, signUp, shareNewCookie, update}
})();