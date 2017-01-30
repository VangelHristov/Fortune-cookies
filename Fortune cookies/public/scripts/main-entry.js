'use strict';

import $ from 'jquery';
import toastr from 'toastr';
import {app} from 'router';
import {userAuthenticator} from 'user-authenticator';
import '/css/main.css!';
import 'bootstrap';
import 'jspm_packages/npm/bootstrap@4.0.0-alpha.6/dist/css/bootstrap.min.css!';

$(() => {
    app.run();

    toastr.options = {
        "closeButton"      : false,
        "debug"            : false,
        "newestOnTop"      : true,
        "progressBar"      : false,
        "positionClass"    : "toast-top-right",
        "preventDuplicates": true,
        "onclick"          : null,
        "showDuration"     : "400",
        "hideDuration"     : "1000",
        "timeOut"          : "5000",
        "extendedTimeOut"  : "1000",
        "showEasing"       : "swing",
        "hideEasing"       : "linear",
        "showMethod"       : "fadeIn",
        "hideMethod"       : "fadeOut"
    };

    userAuthenticator.checkForUsername();
});

