## Description

A Gatsby plugin to transform MDX files so they can be rendered without requiring a page to be created. An example use case is using MDX files as a basic CMS.

The plugin creates a `Data<Type>` node for every `Mdx` node that is created for files in the provided data directories in addition to registering an `mdx` resolver for these nodes to render markdown. This allows for the `Data<Type>` nodes to be queried as a basic CMS.

For example, using `gatsby-transformer-mdx-data` you could create a `src/data/products` folder to store product data in `.mdx` format and then query the products using `allDataProduct` and `dataProduct`.

### Why?

Following some changes to `gatsby-plugin-mdx`, in order to support MDX v2 the `html` node was removed and it was no longer possible to render markdown outside of a page (see the [v2 discussion](https://github.com/gatsbyjs/gatsby/discussions/25068), [question about including HTML in feeds](https://github.com/gatsbyjs/gatsby/discussions/37045) and [complaint about not being able to render multiple markdown items](https://github.com/gatsbyjs/gatsby/discussions/38706)).

I recently rewrote my [website](https://andy-berry.co.uk) to use the latest version of Gatsby with Typescript and wanted to use `.mdx` files as a rudimentary CMS. Following a [suggestion on one of the Gatsby GitHub issues](https://github.com/gatsbyjs/gatsby/discussions/34714#discussioncomment-4137273), I managed to get it working for my own purposes and decided to make it a plugin both to help others and for my own learning.

**DISCLAIMER: This is the first Gatsby plugin I have created and I know very little about the inner workings of bundlers and module resolution. This approach may have worked for me by sheer fluke!**

## Install

**npm**

```shell
npm i gatsby-transformer-mdx-data @mdx-js/react gatsby-plugin-mdx react
```

**yarn**

```shell
yarn add gatsby-transformer-mdx-data @mdx-js/react gatsby-plugin-mdx react
```

## How to use

### Changes to gatsby config

First, make sure you have `gatsby-plugin-mdx` and `gatsby-source-filesystem` correctly configured.

```js
module.exports = {
  // ... more config
  plugins: [
    // ... more plugins
    'gatsby-plugin-mdx',
    {
        resolve: 'gatsby-source-filesystem',
        options: {
            name: 'products',
            path: './src/data/products',
        },
        __key: 'products',
    },
  ],
}
```

You should be able to see the nodes returned with the following GraphQL query.

```graphql
{
  allMdx {
    nodes {
      internal {
        contentFilePath
      }
    }
  }
}
```

Then add the plugin to `gatsby-config.js` (or `gatsby-config.ts`) and set `jsxRuntime`:

```js
const path = require('path')
module.exports = {
  // ... more config
  plugins: [
    // ... more plugins
    {
      resolve: `gatsby-transformer-mdx-data`,
      options: {
        // Provide a list of absolute file paths of where data files live
        dataDirs: [
            path.resolve(__dirname, 'src/data/products'),
            path.resolve(__dirname, 'src/data/stores'),
        ],
      },
    },
  ],
  jsxRuntime: 'automatic',
}
```

### Create data files

e.g. **src/data/products/product1.mdx**
```mdx
---
title: Some product
price: 1234
---

Some _markdown_ about my **product**
```

### Query data

Once configured the data nodes can be queried using `allData<TYPE>` and `data<TYPE>` - e.g. using the above example you would have the additional queries of `allDataProduct`, `dataProduct`, `allDataStore` and `dataStore`. The standard filter and sorting arguments work.

Each data node has an `mdx` field to return the markdown ready to pass to the `MDX` component. Any data in "frontmatter" will be copied directly onto the node.

```graphql
{
    products: allDataProduct(limit: 10) {
        nodes {
            id
            title
            mdx
            price
        }
    }
    bestProduct: dataProduct(name: { eq: "BestProduct" }) {
        id
        title
        mdx
        price
    }
}
```

### Render data

Once you have the `mdx` data, pass the result to the `MDX` component to render markdown.

```
import Mdx from 'gatsby-transformer-mdx-data';

const ProductPage = ({ mdx }) => <Mdx>{mdx}<Mdx>;
```

Use the [MdxProvider](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#mdxprovider) to provide components for HTML elements rendered by Markdown. `gatsby-transformer-mdx-data` exports it as a convenience (`import { MDXProvider } from 'gatsby-transformer-mdx-data';`) or import from `@mdx-js/react`.

## Available options

| Option | Type | Description | Default | Required |
| ------ | ---- | ----------- | ------- | -------- |
| `dataDirs` | string array | A list of absolute file paths of where data MDX files are stored | `[]` | Yes |

## Examples of usage

There are 2 examples in the [examples](./examples) directory, one using JavaScript and one using TypeScript - the usage is essentially the same.

An example page using queried data might look like:

```js
import { graphql } from 'gatsby';
import Mdx, { MDXProvider } from 'gatsby-transformer-mdx-data';

const IndexPage = ({ data }) => {
    return (
        <MDXProvider components={{
            SomeTag: ({ children }) => <div style={{ color: 'red'}}>{children}</div>
        }}>
            {data.products.nodes.map(({ id, title, mdx }) => (
                <div key={id}>
                    <h1>{title}</h1>
                    <Mdx>{mdx}</Mdx>
                </div>
            ))}
        </MDXProvider>
    );
};

export default IndexPage;

export const query = graphql`
    {
        products: allDataProduct {
            nodes {
                id
                title
                mdx
            }
        }
    }
`;
```

## How to run tests

// TODO

## How to develop locally

// TODO

## How to contribute

// TODO
