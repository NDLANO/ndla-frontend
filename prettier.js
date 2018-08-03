const path = require('path');
const spawn = require('child_process').spawnSync;
const chalk = require('chalk');

function runCommand(cmd, args, cwd = __dirname) {
  const displayArgs =
    args.length > 25 ? `${args.slice(0, 25)}...` : args.join(' ');
  console.log(chalk.dim(`$ cwd ${cwd}\n$ ${cmd} ${displayArgs}\n`)); // eslint-disable-line
  const result = spawn(cmd, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0) {
    const message = 'Error running command.';
    const error = new Error(message);
    error.stack = message;
    throw error;
  }
}

const shouldWrite = process.argv[2] === 'write';
const isWindows = process.platform === 'win32';
const prettier = isWindows ? 'prettier.cmd' : 'prettier';
const prettierCmd = path.resolve(__dirname, `node_modules/.bin/${prettier}`);

const options = {
  config: './.prettierrc.js',
};

// prettier-ignore
const args = Object.keys(options)
  .map(key => `--${key}=${options[key]}`)
  .concat(
    `--${shouldWrite ? 'write' : 'l'}`,
    '"{src,e2e}/**/*(*.js|*.jsx)"'
  );

try {
  runCommand(prettierCmd, args);
} catch (e) {
  if (!shouldWrite) {
    // prettier-ignore
    console.log( // eslint-disable-line
      `${chalk.red(`\nThis project uses prettier to format all JavaScript code.\n`) +
        chalk.dim(`Please run `) +
        chalk.reset('yarn prettier') +
        chalk.dim(` and add changes to files listed above to your commit.`)
       }\n`
    );
    process.exitCode = 1;
  }
}
