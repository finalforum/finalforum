/* eslint-disable import/no-nodejs-modules */
import path from 'path';
import express from 'express';
import React from 'react';
import {renderToHtml, StyledComponentsServerRenderer} from '@isoreact/core';

import App from '../components/app';

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, '../../dist')));

app.get('/', async (req, res) => {
    const renderer = new StyledComponentsServerRenderer();
    const body = await renderToHtml(
        <App />,
        {
            className: 'app',
            render: renderer.render,
        }
    );

    res.locals = {
        head: renderer.sheet.getStyleTags(),
        body,
    };

    res.render('index');
});

app.listen(3000, () => {
    console.info('Server listening on port 3000'); // eslint-disable-line no-console
});
