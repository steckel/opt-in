import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/opt-in.umd.js';
config.moduleName = 'OptIn';

export default config;
