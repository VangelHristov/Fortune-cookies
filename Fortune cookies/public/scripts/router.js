'use strict';

import {controller} from 'controller';
import Sammy from 'sammy';

export const app = Sammy('#content', function () {
    this.get('#/home', controller.home);
    this.get('#/category/:category', (context) => controller.category(context.params.category));
    this.get('#/my-cookie', controller.myCookie);
    this.get('#/login', controller.login);
    this.get('#/share-new-cookie', controller.shareNewCookie);
    this.get('#/sign-up', controller.signUp);
    this.get('#', (context) => context.redirect('#/home'));
});