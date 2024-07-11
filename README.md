# semantic-release-sfdx

[semantic-release](https://github.com/semantic-release/semantic-release) plugin for publishing an SFDX package

## Aside

This is a fork of https://github.com/leboff/semantic-release-sfdx with the following changes:

- Updated to use the latest version of sfdx-node
- ESM module support
- Add more options for configuration

## Prerequisites

You must have SFDX installed and connected to your DevHub (see Authorization in the [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth.htm)).

## Installation

```bash
npm install -D semantic-release-sfdx2
```

or using yarn:

```bash
yarn add -D semantic-release-sfdx2
```

## Configuration

To enable this plugin, simply add the following to your `package.json` or [release configuration file](https://semantic-release.gitbook.io/semantic-release/usage/configuration).

```json
{
  "release": {
    "plugins": ["semantic-release-sfdx2"]
  }
}
```

### DevHub

By default this plugin uses the DevHub which is set in your `defaultdevhubusername` sfdx config.

To use another DevHub, set the environment variable `SFDX_DEFAULTDEVHUBUSERNAME` (see [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_dev_cli_env_variables.htm)).

### Advanced Configuration

You can configure the plugin by providing an object instead of a string in the `plugins` array, available options are:

- `codecoverage` - boolean - whether to run tests with code coverage
- `promote` - boolean - whether to promote the package version
- `installationkey` - string - the installation key for the package
- `versionCreateWait` - number - the wait time for package version creation. Defaults to 15 minutes.
- `definitionfile` - string - the path to the definition file
- `devhubusername` - string - the dev hub username, if you wish to override the default
- `skipvalidation` - boolean - whether to skip validation
- `skipancestorcheck` - boolean - whether to skip ancestor check

**static config via `package.json`**

```json
{
  "release": {
    "plugins": [
      [
        "semantic-release-sfdx2",
        {
          "codecoverage": true,
          "promote": true,
          "installationkey": "mysecretkey"
        }
      ]
    ]
  }
}
```

**dynamic config via `release.config.js`**

```javascript
module.exports = {
  plugins: [
    [
      'semantic-release-sfdx',
      {
        codecoverage: process.env.PROMOTE_PACKAGE_VERSION === 'true',
        promote: process.env.PROMOTE_PACKAGE_VERSION === 'true',
        installationkey: process.env.INSTALLATIONKEY,
      },
    ],
  ],
}
```

### `verifyConditions`

To disable the verification of your SFDX project, DevHub and installationkey:

```json
{
  "release": {
    "plugins": [
      "semantic-release-sfdx",
      {
        "verifyConditions": false
      }
    ]
  }
}
```

## Credits

Thanks to https://github.com/carlos-cubas/semantic-release-gcp.git for kicking off point

Thanks to https://github.com/leboff/semantic-release-sfdx for creating the original package
