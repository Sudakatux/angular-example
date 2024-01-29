import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import {
  orkesConductorClient,
  Workflow,
  HumanTaskEntry,
  HumanExecutor,
  HumanTaskTemplate,
  WorkflowExecutor,
  OrkesApiConfig,
  ConductorClient,
  HumanTaskDefinition,
} from '@io-orkes/conductor-javascript';
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  // server.get('/api/token', (req, res) => {
  //   orkesConductorClient({
  //     keyId: 'a13db487-58c2-429e-bd31-bf78f3736fda',
  //     keySecret: 'ORSurEyOF7PTG59jBMIwFOUGvTptzWOLtRyPRYwwxSkpFJgz',
  //     serverUrl: 'https://ui-dev.orkesconductor.io/api',
  //   }).then((client) => {
  //     res.json({
  //       token: client.token,
  //     });
  //   });
    // Implement your API call logic here, using the API_KEY
    // Example with axios:
    // axios.get('https://third-party-api.com/data', {
    //   headers: { 'Authorization': `Bearer ${API_KEY}` }
    // }).then(apiRes => {
    //   res.json(apiRes.data);
    // }).catch(error => {
    //   console.error('API call error:', error);
    //   res.status(500).send('Error fetching data');
    // });
  //});
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
