import type { GatsbyNode, PluginOptions as GatsbyPluginOptions } from 'gatsby';
import path from 'path';
import { isNil } from 'lodash';
import { singularize, camelize } from 'inflection';
import { compileMDXWithCustomOptions } from 'gatsby-plugin-mdx';

export type PluginOptions = {
    dataDirs: string[];
};

const isParentDir = (parent: string, child: string) => {
    const relative = path.relative(parent, child);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};

const createNodeTypeFromDataDir = (dir: string) => {
    const dataDirPathName = path.basename(dir);
    const dataDirPathNameSingular = singularize(dataDirPathName);
    return `Data${camelize(dataDirPathNameSingular)}`;
};

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
    { node, actions, createNodeId },
    pluginOptions: PluginOptions & GatsbyPluginOptions,
) => {
    const { createNode, createParentChildLink } = actions;

    if (node.internal.type === 'Mdx') {
        const { contentFilePath } = node.internal;
        if (isNil(contentFilePath)) {
            return;
        }
        const dataDirPath = pluginOptions.dataDirs.find((path) =>
            isParentDir(path, contentFilePath),
        );
        if (isNil(dataDirPath)) {
            return;
        }
        const nodeType = createNodeTypeFromDataDir(dataDirPath);
        const filename = path.basename(contentFilePath);
        const name = filename.split('.').shift();
        const relativePath = path.relative(dataDirPath, contentFilePath);
        const dataNode = {
            excerpt: node?.excerpt || '', // this might be overridden by frontmatter
            ...(node?.frontmatter as Record<string, any>),
            id: createNodeId(`DataMdx-${node.id}`),
            parent: node.id,
            name,
            file: relativePath,
            dataDirPath,
            body: node?.body,
            internal: {
                type: nodeType,
                contentDigest: node.internal.contentDigest,
                content: node.internal.content,
                contentFilePath: node.internal.contentFilePath,
                description: node.internal.description,
                mediaType: node.internal.mediaType,
            },
        };
        createNode(dataNode);
        createParentChildLink({ parent: node, child: dataNode });
    }
};

export const createResolvers: GatsbyNode['createResolvers'] = (
    {
        createResolvers: create,
        getNode,
        getNodesByType,
        pathPrefix,
        reporter,
        cache,
        store,
    },
    pluginOptions: PluginOptions & GatsbyPluginOptions,
) => {
    // @ts-ignore
    const mdxResolver = async ({ body, internal }) => {
        const mdx = await compileMDXWithCustomOptions(
            {
                source: body as string,
                absolutePath: internal.contentFilePath,
            },
            {
                pluginOptions: {
                    plugins: [],
                },
                customOptions: {
                    mdxOptions: {
                        outputFormat: 'function-body',
                        development: false,
                    },
                },
                getNode,
                getNodesByType,
                pathPrefix,
                reporter,
                cache,
                store,
            },
        );
        return mdx?.processedMDX.toString();
    };
    create({
        ...pluginOptions.dataDirs.reduce((config, datadirPath) => {
            const nodeType = createNodeTypeFromDataDir(datadirPath);
            return {
                ...config,
                [nodeType as string]: {
                    mdx: {
                        type: 'String',
                        resolve: mdxResolver,
                    },
                },
            };
        }, {}),
    });
};
