System.config({
    baseURL            : "/",
    defaultJSExtensions: true,
    transpiler         : "babel",
    babelOptions       : {
        "optional": [
            "runtime",
            "optimisation.modules.system"
        ]
    },
    paths              : {
        "github:*": "jspm_packages/github/*",
        "npm:*"   : "jspm_packages/npm/*"
    },

    map : {

        // my scripts
        "main-entry"                        : "scripts/main-entry",
        "database-access"                   : "scripts/database-access",
        "template-getter"                   : "scripts/template-getter",
        "validator"                         : "scripts/validator",
        "user-authenticator"                : "scripts/user-authenticator",
        "controller"                        : "scripts/controller",
        "event-handler"                     : "scripts/event-handler",
        "router"                            : "scripts/router",
        // jspm
        "babel"                             : "npm:babel-core@5.8.38",
        "babel-runtime"                     : "npm:babel-runtime@5.8.38",
        "bootstrap"                         : "npm:bootstrap@4.0.0-alpha.6/dist/js/bootstrap",
        "core-js"                           : "npm:core-js@1.2.7",
        "crypto-js"                         : "npm:crypto-js@3.1.9-1",
        "css"                               : "github:systemjs/plugin-css@0.1.32",
        "handlebars"                        : "github:components/handlebars.js@4.0.5",
        "jquery"                            : "npm:jquery@3.1.1",
        "moment"                            : "npm:moment@2.17.1",
        "sammy"                             : "github:quirkey/sammy@0.7.6/lib/sammy",
        "systemjs-plugin-css"               : "npm:systemjs-plugin-css@0.1.32",
        "toastr"                            : "github:CodeSeven/toastr@2.1.3",
        "github:CodeSeven/toastr@2.1.3"     : {
            "css"   : "github:systemjs/plugin-css@0.1.32",
            "jquery": "npm:jquery@3.1.1"
        },
        "github:jspm/nodelibs-assert@0.1.0" : {
            "assert": "npm:assert@1.4.1"
        },
        "github:jspm/nodelibs-buffer@0.1.0" : {
            "buffer": "npm:buffer@3.6.0"
        },
        "github:jspm/nodelibs-path@0.1.0"   : {
            "path-browserify": "npm:path-browserify@0.0.0"
        },
        "github:jspm/nodelibs-process@0.1.2": {
            "process": "npm:process@0.11.9"
        },
        "github:jspm/nodelibs-util@0.1.0"   : {
            "util": "npm:util@0.10.3"
        },
        "github:jspm/nodelibs-vm@0.1.0"     : {
            "vm-browserify": "npm:vm-browserify@0.0.4"
        },
        "npm:assert@1.4.1"                  : {
            "assert" : "github:jspm/nodelibs-assert@0.1.0",
            "buffer" : "github:jspm/nodelibs-buffer@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "util"   : "npm:util@0.10.3"
        },
        "npm:babel-runtime@5.8.38"          : {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:bootstrap@4.0.0-alpha.6"       : {
            "jquery": "npm:jquery@3.1.1",
            "tether": "github:HubSpot/tether@1.4.0"
        },
        "npm:buffer@3.6.0"                  : {
            "base64-js"    : "npm:base64-js@0.0.8",
            "child_process": "github:jspm/nodelibs-child_process@0.1.0",
            "fs"           : "github:jspm/nodelibs-fs@0.1.2",
            "ieee754"      : "npm:ieee754@1.1.8",
            "isarray"      : "npm:isarray@1.0.0",
            "process"      : "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:core-js@1.2.7"                 : {
            "fs"           : "github:jspm/nodelibs-fs@0.1.2",
            "path"         : "github:jspm/nodelibs-path@0.1.0",
            "process"      : "github:jspm/nodelibs-process@0.1.2",
            "systemjs-json": "github:systemjs/plugin-json@0.1.2"
        },
        "npm:crypto-js@3.1.9-1"             : {
            "buffer" : "github:jspm/nodelibs-buffer@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:inherits@2.0.1"                : {
            "util": "github:jspm/nodelibs-util@0.1.0"
        },
        "npm:path-browserify@0.0.0"         : {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:process@0.11.9"                : {
            "assert": "github:jspm/nodelibs-assert@0.1.0",
            "fs"    : "github:jspm/nodelibs-fs@0.1.2",
            "vm"    : "github:jspm/nodelibs-vm@0.1.0"
        },
        "npm:util@0.10.3"                   : {
            "inherits": "npm:inherits@2.0.1",
            "process" : "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:vm-browserify@0.0.4"           : {
            "indexof": "npm:indexof@0.0.1"
        }
    },
    meta: {
        '*.css': {loader: 'css'}
    }
});
