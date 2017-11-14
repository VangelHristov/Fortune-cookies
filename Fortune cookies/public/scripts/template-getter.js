"use strict";

import $ from 'jquery';
import * as Handlebars from 'handlebars';

const templateCache = {};

export const getTemplate = (templateName) => {

    return new Promise((resolve, reject) => {

        if (templateCache[templateName]) {
            return resolve(templateCache[templateName]);
        }

        $.ajax({
            url        : `templates/${templateName}.html`,
            contentType: 'application/json',
            success    : (response) => {
                templateCache[templateName] = Handlebars.compile(response);
                resolve(templateCache[templateName]);
            },
            error      : reject
        });
    });
};
