#!/usr/bin/env node
'use strict';

// nodejs api
var proc = require('child_process');

//vendor
var appRoot = require('app-root-path').path;

function globToRegex(glob){
    function regexpEscape(str){
        return str.replace(/\//g, '\\/')
                .replace(/\./g, '\\.')
                .replace(/\*/g, '\.\*');
    }

    return '(' + regexpEscape(glob)
            .replace(/\*\*/g, '*.') + ')';
}

exports.runPlato = function(project, projectsDir){
    var projectRoot = appRoot + '/' + projectsDir + '/' + project.name;
    var platoCfg = require(projectRoot + '/plato.json');
    var cmd = appRoot + '/node_modules/plato/bin/plato';
    var args = [
        '-q ',
        '-r ',
        '-l ' + platoCfg.options.jshint,
        '-x "' + platoCfg.exclude.map(globToRegex).join('|') + '"',
        '-d ' + appRoot + '/plato/' + project.name,
        '-t ' + platoCfg.options.title,
        platoCfg.files.join(' ')
    ];
    cmd += ' ' + args.join(' ');
    console.log(cmd);
    proc.execSync(cmd, {
        cwd: projectRoot
    });
};