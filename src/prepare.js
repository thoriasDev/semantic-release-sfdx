import { getPackage, removeUndefined } from './util.js'
import sfdx from 'sfdx-node'
import fs from 'node:fs'
import find from 'lodash.find'

/**
 * @typedef {Object} NextRelease
 * @property {string} version - The version of the next release. For example, 1.0.0
 *
 * @typedef {Object} Logger
 * @property {function} log - Log information.
 *
 * @typedef {Object} PluginConfig
 * @property {string} [installationkey] - The installation key for the package, if omitted the key installationkeybypass is used.
 * @property {boolean} [promote] - Whether to promote the package version.
 * @property {number} [versionCreateWait] - The wait time for package version creation. Defaults to 15 minutes.
 * @property {string} [definitionfile] - The path to the definition file.
 * @property {boolean} [codecoverage] - Whether to enable code coverage.
 * @property {string} [devhubusername] - The dev hub username, if you wish to override the default.
 * @property {boolean} [skipvalidation] - Whether to skip validation.
 * @property {boolean} [skipancestorcheck] - Whether to skip ancestor check.
 *
 * @param {PluginConfig} pluginConfig - The plugin configuration.
 * @param {NextRelease} context.nextRelease - The next release.
 * @param {Logger} context.logger - The logger.
 */
export const prepare = async (pluginConfig, { nextRelease, logger }) => {
  const { version } = nextRelease;

  const project = JSON.parse(fs.readFileSync('sfdx-project.json'))

  const pkg = getPackage(project)

  if (!version) {
    throw new Error('No version found to release')
  }

  if (pluginConfig.promote && !pluginConfig.codecoverage) {
    throw new Error('Cannot promote package version without code coverage')
  }

  const versionCreateOptions = {
    _rejectOnError: true,
    path: pkg.path,
    tag: version,
    json: true,
    versionnumber: `${version}.0`,
    wait: pluginConfig.versionCreateWait || 15,
    definitionfile: pluginConfig.definitionfile,
    targetdevhubusername: pluginConfig.devhubusername,
    skipvalidation: pluginConfig.skipvalidation,
    skipancestorcheck: pluginConfig.skipancestorcheck,
  }

  logger.log(`Creating new package version ${pkg.package}@${versionCreateOptions.versionnumber}`)

  if (pluginConfig.installationkey) {
    versionCreateOptions.installationkey = pluginConfig.installationkey
  } else {
    versionCreateOptions.installationkeybypass = true
  }

  if (pluginConfig.codecoverage) {
    versionCreateOptions.codecoverage = true
  }

  logger.log('Package Version Create Options: ' + JSON.stringify(versionCreateOptions))

  const createResult = await sfdx.force.package.versionCreate(removeUndefined(versionCreateOptions))

  logger.log('Package Version Create Result: ' + JSON.stringify(createResult))

  const { InstallUrl, SubscriberPackageVersionId } = createResult

  const list = await sfdx.force.package.versionList(removeUndefined({ targetdevhubusername: pluginConfig.devhubusername }))

  logger.log('Package Version List: ' + JSON.stringify(list))

  const latestResult = find(list, { SubscriberPackageVersionId })

  logger.log(`Package Version Create Result: ${JSON.stringify(latestResult)}`)

  if (pluginConfig.promote) {
    logger.log('Promoting Package Version')
    await sfdx.force.package.versionPromote(removeUndefined({
      _rejectOnError: true,
      package: latestResult.SubscriberPackageVersionId,
      noprompt: true,
      json: true,
      targetdevhubusername: pluginConfig.devhubusername,
    }))
  }

  try {
    const nextVersion = `${version}.NEXT`

    pkg.versionNumber = nextVersion

    if (!project.packageAliases) {
      project.packageAliases = {}
    }

    if (SubscriberPackageVersionId) {
      project.packageAliases[`${pkg.package}@${version}-0`] = SubscriberPackageVersionId
    }

    fs.writeFileSync('sfdx-project.json', JSON.stringify(project, null, 2))

    nextRelease.installUrl = InstallUrl;
    nextRelease.subscriberPackageVersionId = SubscriberPackageVersionId;
  } catch(ex) {
    logger.error('Failed to update sfdx-project.json', ex)
  }
}
