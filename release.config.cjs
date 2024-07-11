module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [{ type: 'chore', release: 'patch' }],
      },
    ],
    '@semantic-release/npm',
  ],
}
