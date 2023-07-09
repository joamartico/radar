const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    // runtimeCaching
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              'node_modules/ionicons/dist/ionicons/svg'
            ),
            to: path.join(__dirname, 'public/svg'),
          },
        ],
      })
    )
    
    // Agrega serialport a la lista de externals
    config.externals.push('serialport')

    return config
  },
})
