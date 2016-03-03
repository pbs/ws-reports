#!/usr/bin/env node
'use strict';

var execSync = require('sync-exec');
var format = require('string-format');

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

function pushToGithub(){
    var cmd = format(
            'git config user.name {bamboo_GIT_USER_NAME} &&' +
            'git config user.email {bamboo_GIT_USER_EMAIL} &&'+
            'git remote rm origin &&' +
            'git remote add origin {repoURL} &&' +
            'git add {reportsFolder} &&' +
            'git commit -m "{now} report" &&' +
            'git push origin gh-pages',{
                bamboo_GIT_USER_NAME: process.evn.bamboo_GIT_USER_NAME,
                bamboo_GIT_USER_EMAIL: process.env.bamboo_GIT_USER_EMAIL,
                repoURL: 'git@github.com:pbs/ws-reports.git',
                reportsFolder: 'plato',
                now: (new Date()).toLocaleDateString()
            });

    execSync(cmd, {
        cwd: appRoot
    });
}

exports.runPlato = function(project, projectsDir){
    var projectRoot = appRoot + '/' + projectsDir + '/' + project.name;
    var platoCfg = require(projectRoot + '/plato.json');
    var cmd = appRoot + '/node_modules/plato/bin/plato';
    var args = [
        '-q ',
        '-r ',
        '-l ' + projectRoot + '/' + platoCfg.options.jshint,
        '-x "' + platoCfg.exclude.map(globToRegex).join('|') + '"',
        '-d ' + appRoot + '/plato/' + project.name,
        '-t ' + platoCfg.options.title,
        platoCfg.files.join(' ')
    ];
    cmd += ' ' + args.join(' ');
    console.log(cmd);
    execSync(cmd, {
        cwd: projectRoot
    });
    pushToGithub();
};