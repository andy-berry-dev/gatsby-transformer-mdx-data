import React, { useMemo } from 'react';
import * as provider from '@mdx-js/react';
import { runSync } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import isNil from 'lodash/isNil';

const MDX = ({ children }: { children?: string | null }) => {
    const MdxModule = useMemo(
        () =>
            isNil(children)
                ? null
                : // @ts-ignore
                  runSync(children, {
                      ...provider,
                      ...runtime,
                  }),
        [children],
    );
    return MdxModule && <MdxModule.default />;
};

export default MDX;
