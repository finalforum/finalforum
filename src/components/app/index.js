import React from 'react';
import styled from 'styled-components';
import {of as observableOf} from 'rxjs';
import {isomorphic, Connect} from '@isoreact/core';

import AppContext from './context';

const Main = styled.main`
    flex: 1 0 auto;
`;

const Footer = styled.footer`
    flex-shrink: 0;
`;

const App = () => (
    <React.Fragment>
        <Main>
            <h1>FinalForum</h1>
        </Main>
        <Footer>
            <Connect context={AppContext}>
                {({year}) => `Copyright © ${year} FinalForum`}
            </Connect>
        </Footer>
    </React.Fragment>
);

const getCurrentYear = () => new Date().getFullYear();

export default isomorphic({
    name: 'main',
    component: App,
    context: AppContext,
    getData: (props, hydration) => (
        observableOf({
            state: {
                year: hydration ? hydration.year : getCurrentYear(),
            },
            hydration: {
                year: hydration ? null : getCurrentYear(),
            },
        })
    ),
});
