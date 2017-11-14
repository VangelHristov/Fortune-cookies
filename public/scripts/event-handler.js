'use strict';

function refresh(location) {
    switch (location) {
        case '#/home' :
            controller.home();
            break;
        case '#/my-cookie' :
            controller.myCookie();
            break;
        default:
            let categoryName = location.substring(location.lastIndexOf('/') + 1);
            controller.category(categoryName);
    }
}

function getCredentials(ev) {
    ev.preventDefault();

    let target   = $(ev.target),
        username = target.find('#username').val(),
        password = target.find('#password').val();

    let validCredentials = validator.validateUsername(username) &&
      validator.validatePassword(password);

    if (validCredentials) {
        let passHash = userAuthenticator.encrypt(password);
        return {username: username, passHash: passHash};
    }

    return false;
}

function signUp(ev) {
    let validUser = getCredentials(ev);

    if (validUser) {
        db.createUser(validUser)
          .then(() => {
              toastr.success('You have successfully signed up.');
              window.location = '#/login';
          }, toastr.error);
    }
}

function login(ev) {
    let validUser = getCredentials(ev);
    if (validUser) {
        db.authUser(validUser)
          .then(() => {
              userAuthenticator.logIn();
              window.location = '#/home';
          }, (error) => {
            toastr.error(error);
            return false;
          });
    }else{
        return false;
    }
}

function shareNew(ev) {
    ev.preventDefault();

    let $target        = $(ev.target),
        cookieText     = $target.find('#text').val(),
        cookieCategory = $target.find('#category').val(),
        cookieImageUrl = $target.find('#url').val(),
        validCookie;

    validCookie = validator.validateText(cookieText) &&
      validator.validateText(cookieCategory) &&
      validator.validateUrl(cookieImageUrl);

    if (validCookie) {
        db.shareCookie({
              text    : cookieText,
              category: cookieCategory,
              img     : cookieImageUrl
          })
          .then(() => {
              toastr.success('Successfully added new cookie.');
              window.location = '#/home';
          })
          .catch(toastr.error);
    }
}

function saveClicked(id) {
    let clicked = window.localStorage.getItem('clicked');
    if (!clicked || clicked === 'null') {
        clicked = "[]";
    }

    clicked = JSON.parse(clicked);
    if (clicked.indexOf(id) === -1) {
        clicked.push(id);
    }

    window.localStorage.setItem('clicked', JSON.stringify(clicked));
}

function disableClicked() {
    let clicked = window.localStorage.getItem('clicked');
    if (clicked && clicked !== 'null') {
        JSON.parse(clicked).forEach(id => $(`#${id}`).prop('disabled', true));
    }
}

function rate(ev) {
    if (!userAuthenticator.isLoggedIn()) {
        return toastr.error('You must be logged in.');
    }

    let $target  = $(ev.target),
        cookieId = $target.parents('.cookie-details').data('id'),
        type     = $target.hasClass('like') ? 'like' : 'dislike';

    saveClicked($target.attr('id'));

    db.rateCookie({id: cookieId, type: type})
      .then(() => {
          toastr.success('Thank you for your feedback.');
          refresh(window.location.hash);
      })
      .catch(toastr.error);
}

function reShare(ev) {
    if (!userAuthenticator.isLoggedIn()) {
        return toastr.error('You must be logged in.');
    }

    let
      $target       = $(ev.target),
      $targetParent = $target.parent().parent(),
      cookie        = {
          text    : $targetParent.find('.cookie-text').text(),
          category: $targetParent.find('.cookie-category').text(),
          img     : $targetParent.find('.cookie-img').attr('src')
      };

    saveClicked($target.attr('id'));

    db.shareCookie(cookie)
      .then(() => {
          toastr.success('The cookie was successfully re-shared.');
          refresh(window.location.hash);
      })
      .catch(toastr.error);
}

const eventHandler = {
    signUp,
    login,
    shareNew,
    rate,
    reShare,
    disableClicked
};
