'use strict';

const sammyApp = $('#content');

function home() {
    let allCookies   = db.getAllCookies(),
        homeTemplate = getTemplate('home');

    Promise.all([allCookies, homeTemplate])
           .then(([cookies, template]) => {
               sammyApp.html(template(cookies));
               $('.like, .dislike').click(eventHandler.rate);
               $('.share').click(eventHandler.reShare);
               $('#logout').click(userAuthenticator.logOut);
               eventHandler.disableClicked();
           });
}

function category(category) {
    let categoryCookies  = db.getCategory(category),
        categoryTemplate = getTemplate('home');

    Promise.all([categoryCookies, categoryTemplate])
           .then(([cookies, template]) => {
               sammyApp.html(template(cookies));
               $('.like, .dislike').click(eventHandler.rate);
               $('.share').click(eventHandler.reShare);
               eventHandler.disableClicked();
           });
}

function myCookie() {
    if (!userAuthenticator.isLoggedIn()) {
        window.location = '#/home';
        toastr.error('You must be logged in.');
        return;
    }

    let myCookie         = db.getMyCookie(),
        myCookieTemplate = getTemplate('my-cookie');

    Promise.all([myCookie, myCookieTemplate])
           .then(([cookie, template]) => {
               sammyApp.html(template(cookie));
               $('.like, .dislike').click(eventHandler.rate);
               $('.share').click(eventHandler.reShare);
               eventHandler.disableClicked();
           });
}

function login() {
    getTemplate('login')
      .then((template) => {
          sammyApp.html(template);
          $('#form-login').submit(eventHandler.login);
      });
}

function signUp() {
    getTemplate('sign-up')
      .then((template) => {
          sammyApp.html(template);
          $('#form-sign-up').submit(eventHandler.signUp);
      });
}

function shareNewCookie() {
    if (!userAuthenticator.isLoggedIn()) {
        window.location = '#/home';
        toastr.error('You must be logged in.');
        return;
    }

    getTemplate('share-cookie')
      .then((template) => {
          sammyApp.html(template);
          $('#form-share').submit(eventHandler.shareNew);
      });
}

const controller = {
    home,
    category,
    myCookie,
    login,
    signUp,
    shareNewCookie
};
