var path = require('path');
var fs = require('fs');
var clap = require('clap');


function applyConfig(command, config){
  command.values.base = path.resolve(config._configPath || '');

  if ('l10n' in config)
    command.values.l10n = !!config.l10n;

  command.values._configPath = config._configPath;
  command.values._paths = config.path;
  command.values.templates = config.templates;
  command.values.appName = config.appName || 'app';

  return command;
}

function normOptions(options){
  if (!options.name)
  {
    console.warn('Name is not specified');
    process.exit();
  }

  if (!/^[a-z\_$][\.a-z0-9\_\-$]*$/i.test(options.name))
  {
    console.warn('Topic name has wrong symbols:', options.name);
    process.exit();
  }

  options.base = path.normalize(path.resolve(options.base || '') + '/'); // [base]

  // resolve output dir
  var paths = options._paths || {};
  switch (options.topic)
  {
    case 'component':
      options.output = path.resolve(options.base, paths.component || '');
      options.index = paths.typeIndex ? path.resolve(options.base, paths.typeIndex) : false;
    break;
    default:
      options.output = path.resolve(options.output);
  }
  options.outputDir = path.normalize(options.output);

  // resolve input dir
  options.templates = (options.templates || [])
    .concat(__dirname + '/template/')
    .map(function(dir){
      return path.resolve(options._configPath || options.base, dir);
    });

  return options;
}

var command = clap.create('create')
  .description('Code generator')
  .option('-b, --base <path>', 'base path for relative path resolving (current path by default)', '.')
  .init(function(){
    if (this.config)
    {
      var data = this.config[this.name] || {};
      data._configPath = this.configPath;
      applyConfig(this, data);
    }
  })
  .delegate(function(nextCommand){
    if (this.config)
    {
      var data = this.config[this.name] || {};
      data._configPath = this.configPath;
      nextCommand.configFile = this.configFile;
      applyConfig(nextCommand, data);
    }
  });

// create component
command.command('component', '[name]')
  .description('Create a data type')
  .option('-b, --base <path>', 'base path for relative path resolving (current path by default)', '.')
  .option('-t, --template <name>', 'name of template', 'default')
  .option('-n, --name <name>', 'name of component')
  .option('-i, --ignorePath <ignorePath>', 'ignore path')
  .args(function(name){
    this.setOption('name', name);
  })
  .action(function(){
    if (this.configFile)
      console.log('Config: ' + this.configFile + '\n');

    require('./index.js').create.call(this, 'component', this.values);
  });

module.exports = command;
module.exports.norm = normOptions;
