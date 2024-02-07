import type { GatsbyConfig } from 'gatsby';
import path from 'path';

const config: GatsbyConfig = {
    graphqlTypegen: true,
    plugins: [
        {
            resolve: 'gatsby-plugin-mdx',
            options: {
                extensions: ['.mdx', '.md'],
            },
        },
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
            resolve: path.resolve(__dirname, '../../dist'),
            options: {
                dataDirs: [path.resolve(__dirname, 'src/data/products')],
            },
        },
    ],
    jsxRuntime: 'automatic',
};

export default config;
