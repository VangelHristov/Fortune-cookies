(function notificationFactoryModule() {
	'use strict';
	angular
		.module('app')
		.factory('notification', function notification() {
			toastr.options = {
				"closeButton"      : false,
				"debug"            : false,
				"newestOnTop"      : true,
				"progressBar"      : false,
				"positionClass"    : "toast-top-right",
				"preventDuplicates": false,
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

			return {
				success: function (text) {
					toastr.success(text, 'Success:');
				},
				error  : function (text) {
					toastr.error(text.data, 'Error:');
				},
				warn   : function (text) {
					toastr.warning(text, 'Warning:');
				}
			};
		});
}());