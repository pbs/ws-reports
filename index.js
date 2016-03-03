#!/usr/bin/node

'use strict';
var execSync = require('sync-exec');

var reports = require('./src/plato-reports');

var wsProjects = [
    {
        name: 'bento',
        clone: [
            'git clone git@github.com:pbs/lunchbox.git bento',
            'cd bento',
            'mkdir deps_src',
            'python setup.py bento_pkgs_clone -s deps_src'
        ]
    },
    {
        name: 'videoportal',
        clone: 'git clone git@github.com:pbs/mobileweb.git videoportal'
    },
    {
        name: 'jaws',
        clone: 'git clone git@github.com:pbs/jaws.git jaws'
    },
    {
        name: 'mordor',
        clone: 'git clone git@github.com:pbs/mordor.git mordor'
    },
    {
        name: 'themes',
        clone: 'git clone git@github.com:pbs/lunchbox_themes.git themes'
    }
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

