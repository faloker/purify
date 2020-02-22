import { verifyToken } from '../controllers/usersController';

const publicEndpoints = [
  '/api/users/login',
  '/api/users/auth',
  '/api/users/token',
  '/api/users/signup',
  '/documentation',
  '/css',
  '/js',
  '/img',
  '/fonts',
  '/favicon.ico',
  '/config.js',
];

export default fastify => {
  fastify.addHook('onRequest', async (req, reply) => {
    const isPublic = publicEndpoints.filter(endpoint =>
      req.raw.url.includes(endpoint)
    ).length;

    if (Object.prototype.hasOwnProperty.call(req.headers, 'x-auth-token')) {
      const [username, token] = Buffer.from(
        req.headers['x-auth-token'],
        'base64'
      )
        .toString()
        .split(':');

      await verifyToken(username, token);
    } else if (!(isPublic || req.raw.url === '/')) {
      await req.jwtVerify();
    }
  });
};
