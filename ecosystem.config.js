module.exports = {
  apps: [
    {
      name: 'ameinfo-api',
      script: 'app.js',
      node_args: '--max_old_space_size=8192',
      env_production: {
        'NODE_ENV': 'production'
      }
    }
  ]
};
