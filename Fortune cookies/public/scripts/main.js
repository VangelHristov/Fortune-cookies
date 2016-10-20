import 'jquery';
import {CONTROLLER} from 'controllers';
import {UTIL} from 'utils';

$(() => {
    const router = new Navigo(null, false);

    UTIL.checkForUsername();

    router.on({
        '#/home': CONTROLLER.home,
        '#/category/:category':(params) => CONTROLLER.category(params.category),
        '#/my-cookie': CONTROLLER.myCookie,
        '#/login': CONTROLLER.login,
        '#/share-new-cookie': CONTROLLER.shareNewCookie,
        '#/sign-up': CONTROLLER.signUp,
        '*': () => router.navigate('#/home')
    })
        .resolve();
});