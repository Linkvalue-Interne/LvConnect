module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-flow',
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        exclude: ['transform-regenerator'],
      },
    ],
  ],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-proposal-class-properties',
    'module:fast-async',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-react',
        '@babel/preset-flow',
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            useBuiltIns: 'usage',
            exclude: ['transform-regenerator'],
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        'module:fast-async',
      ],
    },
  },
};
