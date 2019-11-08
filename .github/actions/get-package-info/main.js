const core = require('@actions/core');
const package = require('../../../package.json')

const package_version = package.version
const package_name = package.name

core.setOutput('package_version', package_version)
core.setOutput('package_name', package_name)
