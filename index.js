#!/usr/bin/env node

'use strict';
var proc = require('child_process');

var reports = require('./src/plato-reports');

var wsProjects = [
    {
        name: 'bento',
        clone: [
            'git clone -b LUN-2933 git@github.com:pbs/lunchbox.git bento',
            'cd bento',
            'mkdir deps_src',
            'python setup.py bento_pkgs_clone -s deps_src'
        ]
    },
    // {
    //     name: 'Videportal',
    //     clone: 'git clone git@github.com:pbs/mobileweb.git Videportal'
    // }
];

var projectsDir = 'projects_src';

if(require.main == module){
    console.log("Setting Git username and email from env vars...");
    proc.execSync('git config user.name ' + process.env.bamboo_GIT_USER_NAME);
    proc.execSync('git config user.email ' + process.env.bamboo_GIT_USER_EMAIL);

    wsProjects.forEach(function(project){
        proc.execSync('rm -rf ' + projectsDir + ' && mkdir ' + projectsDir);
        var cloneCmd = (project.clone instanceof Array ?
                        project.clone.join(' && ') :
                        project.clone);
        proc.execSync(cloneCmd, {cwd: projectsDir});
        reports.runPlato(project, projectsDir);
    });

    var today = (new Date()).toLocaleDateString();

    proc.execSync('git add . && git commit -m "' + today + ' plato report"');
    proc.execSync('git push origin gh-pages');
}

