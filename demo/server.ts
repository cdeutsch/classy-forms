// tslint:disable: no-console
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import next from 'next';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, quiet: false });
const nextRequestHandler = nextApp.getRequestHandler();

// tslint:disable-next-line: no-floating-promises
nextApp.prepare().then(() => {
  const app = express();

  if (!dev) {
    app.use(compression());
  }

  app.use('/static', express.static(__dirname + '/static'));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(cors({ credentials: true, origin: true }));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  app.all('*', async (req, res) => {
    return nextRequestHandler(req, res);
  });

  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
