import path from 'path';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(path.resolve('.'), 'logs'),
});

export default morgan('combined', { stream: accessLogStream });
