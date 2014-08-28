var fs = require('fs');
var path = require('path');
var clap = require('clap');
var command = require('./command');


//
// launched by another module
//
exports.create = function (topic, config) {
    if (this === command || this === command.commands.component)
        create(topic, config);

    if (this === exports)
        create(topic, command.commands[topic].normalize(config));
};

//
// launched directly (i.e. node index.js ..)
//
if (process.mainModule === module)
    command.run();


//
// main function
//
function create(topic, options) {

    options.topic = topic;
    options = command.norm(options);

    //
    // init
    //

    var target;
    var output = [];

    for (var i = 0; i < options.templates.length; i++) {
        var templatePath = path.normalize(options.templates[i] + '/' + options.topic + '/' + options.template) + '/';
        if (fs.existsSync(templatePath)) {
            console.log('Use template from path: ' + templatePath);
            options.templateDir = templatePath;
            break;
        }
    }

    if (!options.templateDir) {
        console.warn(options.topic + ' template ' + options.template + ' not found!\nPaths for search:\n  ' + options.templates.join('\n  '));
        process.exit();
    }

    switch (topic) {
        case 'component':
            options.instanceName = options.name.charAt(0).toLowerCase() + options.name.substr(1);
            target = options.output;
            output = [target];

            // if folder exists and not empty - confirm possible file rewrite
            if (fs.readdirSync(target).length)
                clap.confirm('Destination folder is not empty, some files may be overwritten. Continue? (y/n) ', function (yes) {
                    if (yes)
                        createFilesStep();
                });
            else
                createFilesStep();

            break;
    }

    function createFilesStep() {
        // create file structure
        console.log('Create file structure ' + target + ':');
        createFiles(options.templateDir, output, {
            name: options.name,
            instanceName: options.instanceName
        });
    }
}




function replaceSpecial(str, values) {
    return str
        // cut
        .replace(/\{\s*(!!?)\s*([a-z\d_]+)\s*\}(.*(?:\r\n?|\n\r?|$))/ig, function (m, op, name, rest) {
            return (op == '!' ? !values[name] : !!values[name]) ? replaceSpecial(rest, values) : '';
        })
        // set value
        .replace(/\{\s*=\s*([a-z\d_]+)\s*\}/ig, function (m, name) {
            if (name in values == false) {
                console.warn('unknown replace token:', name);
                return m;
            }
            else
                return values[name];
        });
}

function indent(level) {
    var res = [];
    for (var i = 0; i < level; i++)
        res.push('  ');
    return res.join('');
}

function createFiles(input, output, values) {
    var list = fs.readdirSync(input);
    for (var i = 0, fn; fn = list[i]; i++) {
        var infn = input + '/' + fn;
        var outputfn = replaceSpecial(fn, values);
        var stat = fs.statSync(infn);

        if (!outputfn)
            continue;

        output.push(outputfn);
        outputfn = output.join('/');

        if (stat.isDirectory()) {
            console.log(indent(output.length - 1)/* + 'Create path:'*/ + output.slice(1).join('/'));
            if (!fs.existsSync(outputfn))
                fs.mkdirSync(outputfn);
            createFiles(infn, output, values);
        }
        else {
            console.log(indent(output.length - 1)/* + 'Create file:'*/ + output.slice(1).join('/'));
            fs.writeFileSync(outputfn, replaceSpecial(fs.readFileSync(infn, 'utf-8'), values));
        }

        output.pop();
    }
}

function resolveDirPath(dir) {
    var dirpath = path.normalize(dir + path.sep);
    var output = [];
    if (!fs.existsSync(dirpath)) {
        var parts = dirpath.split(path.sep);
        var curpath = parts[0] + path.sep;
        for (var i = 1; i < parts.length; i++) {
            curpath += parts[i] + path.sep;
            if (!fs.existsSync(curpath))
                fs.mkdirSync(curpath);
        }
    }
    return output;
}
