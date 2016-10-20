import 'jquery';
import {UTIL} from 'utils';
import {DB} from 'dao';
import {CONTROLLER} from 'controllers';

export const EVENT_HANDLER = (() => {
    "use strict";

    function getUser(ev) {
        ev.preventDefault();

        let target = $(ev.target),
            username = target.find('#username').val(),
            password = target.find('#password').val();

        let validCredentials = UTIL.validateUsername(username) && UTIL.validatePassword(password);

        if (validCredentials) {
            let passHash = UTIL.encrypt(password);
            return {username: username, passHash: passHash};
        }

        return false;
    }

    function signUpForm(ev) {
        let validUser = getUser(ev);

        if (validUser) {
            DB.createUser(validUser, UTIL.warn)
                .then(() => UTIL.confirm('You have successfully signed up.'));
        }
    }

    function loginForm(ev) {
        let validUser = getUser(ev);

        if (validUser) {
            DB.authUser(validUser, UTIL.warn)
                .then(UTIL.logIn);
        }
    }

    function shareForm(ev) {
        ev.preventDefault();

        let $target = $(ev.target),
            cookieText = $target.find('#text').val(),
            cookieCategory = $target.find('#category').val(),
            cookieImageUrl = $target.find('#url').val(),
            validCookie;

        validCookie = UTIL.validateText(cookieText) && UTIL.validateText(cookieCategory) && UTIL.validateUrl(cookieImageUrl);

        if (validCookie) {
            DB.shareCookie({
                text: cookieText,
                category: cookieCategory,
                url: cookieImageUrl
            })
              .then(() => {
                  UTIL.confirm('Successfully added new cookie.');
                  CONTROLLER.update(window.location.hash);
              })
              .catch(UTIL.warn);
        }
    }

    function rate(ev) {
        if (!UTIL.isLoggedIn()) {
            return UTIL.warn('You must be logged in.');
        }

        let $target = $(ev.target),
            cookieId = $target.parents('.cookie-details').data('id'),
            type = $target.hasClass('like')
                ? 'like'
                : 'dislike';

        DB.rateCookie({id: cookieId, type: type})
          .then(() =>  {
              UTIL.confirm('Thank you for your feedback.');
              CONTROLLER.update(window.location.hash);
          })
          .catch(UTIL.warn);

    }

    function share(ev) {
        if (!UTIL.isLoggedIn()) {
            return UTIL.warn('You must be logged in.');
        }

        let $targetParent = $(ev.target).parent(),
            cookie = {
                text: $targetParent.siblings('.cookie-text').val(),
                category: $targetParent.siblings('.cookie-category').val(),
                url: $targetParent.siblings('.cookie-img').attr('src')
            };

        DB.shareCookie(cookie)
          .then(() => {
              UTIL.confirm('The cookie was successfully re-shared.');
              CONTROLLER.update(window.location.hash);
          })
          .catch(UTIL.warn);
    }

    return {signUpForm, loginForm, shareForm, rate, share};
})();