import 'jquery';
import {CONTROLLER} from 'controllers';
import {UTIL} from 'utils';
import Sammy from 'sammy';
import 'bootstrap';


	const app = Sammy('#content', function () {
		this.get('/home', CONTROLLER.home);
		this.get('/category/:category', function(context){
			CONTROLLER.category(context.params.category)
		});
		this.get('/my-cookie', CONTROLLER.myCookie);
		this.get('/login', CONTROLLER.login);
		this.get('/share-new-cookie', CONTROLLER.shareNewCookie);
		this.get('/sign-up', CONTROLLER.signUp);
		this.get('/', function(context){
			 context.redirect('#/home');
		});
	});

$(() => app.run());

