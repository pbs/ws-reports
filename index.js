#!/usr/bin/node

'use strict';
var execSync = require('sync-exec');

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
    wsProjects.forEach(function(project){
        execSync('rm -rf ' + projectsDir + ' && mkdir ' + projectsDir);
        var cloneCmd = (project.clone instanceof Array ?
                        project.clone.join(' && ') :
                        project.clone);
        execSync(cloneCmd, {cwd: projectsDir});
        reports.runPlato(project, projectsDir);
    });
}

