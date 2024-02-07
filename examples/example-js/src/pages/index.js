import { graphql } from 'gatsby';
import Mdx, { MDXProvider } from 'gatsby-transformer-mdx-data';

const IndexPage = ({ data }) => {
    const products = data.products.nodes;
    return (
        <MDXProvider
            components={{
                Product: ({ children }) => (
                    <p
                        style={{
                            fontFamily: 'fantasy',
                            color: 'green',
                            fontSize: '1.5rem',
                        }}
                    >
                        {children}
                    </p>
                ),
            }}
        >
            {products.map(({ id, name, mdx }) => (
                <div
                    key={id}
                    style={{ maxWidth: '800px', margin: '10px auto' }}
                >
                    <h1>{name}</h1>
                    <div>
                        <Mdx>{mdx}</Mdx>
                    </div>
                </div>
            ))}
        </MDXProvider>
    );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;

export const query = graphql`
    query IndexPage {
        products: allDataProduct(sort: { name: ASC }) {
            nodes {
                id
                name
                mdx
            }
        }
    }
`;
