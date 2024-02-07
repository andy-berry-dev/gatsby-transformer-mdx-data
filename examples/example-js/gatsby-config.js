const path = require('path');

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
    plugins: [
        'gatsby-plugin-mdx',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: './src/pages/',
            },
            __key: 'pages',
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'products',
                path: './src/data/products',
            },
            __key: 'products',
        },
        {
            // resolve: 'gatsby-transformer-mdx-data',
            /* This would usually be the name of the plugin but it uses a path here so the examples can use a local version of the plugin for development */
            resolve: path.resolve('../../dist'),
            options: {
                dataDirs: [path.resolve(__dirname, 'src/data/products')],
            },
        },
    ],
    jsxRuntime: 'automatic',
};
