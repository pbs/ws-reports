#!/usr/bin/node

'use strict';
var execSync = require('sync-exec');
var program = require('commander');

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

function runPlato(){
    execSync('rm -rf ' + projectsDir + ' && mkdir ' + projectsDir);
    wsProjects.forEach(function(project){
        var cloneCmd = (project.clone instanceof Array ?
                        project.clone.join(' && ') :
                        project.clone);
        execSync(cloneCmd, {cwd: projectsDir});
        reports.runPlato(project, projectsDir);
    });
}

if(require.main == module){
    program
        .version(require('./package.json').version)
        .option('-p, --plato', 'run plato reports')
        .option('-c, --commit', 'commit and push generated reports to Github')
        .parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
    if(program.plato){
        runPlato();
    }
    if(program.commit){
        reports.pushToGithub();
    }
}
