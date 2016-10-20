import 'jquery';
import * as Handlebars from 'handlebars';

export const GET_TEMPLATE = (() => {
    "use strict";

    const CACHE = {};

    return (templateName) => {

        return new Promise((resolve, reject) => {

            if (CACHE[templateName]) {
                return resolve(CACHE[templateName]);
            }

            $.ajax({
                url: `templates/${templateName}.html`,
                contentType: 'application/json',
                success: (response) => {
                    CACHE[templateName] = Handlebars.compile(response);
                    resolve(CACHE[templateName]);
                },
                error: reject
            })
        });
    }
})();