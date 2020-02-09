import mailer from 'nodemailer';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts, done) => {
  const transport = mailer.createTransport({
    host: 'smtp.server.io',
    port: 2525,
    // secure: true, // use TLS
    auth: {
      user: '',
      pass: '',
    },
    // tls: {
    //   // do not fail on invalid certs
    //   rejectUnauthorized: false,
    // },
  });

  transport.verify((error, success) => {
    if (error) {
      fastify.log.error(`[SMTP] Unable to connect to SMTP server: ${error}`);
    } else {
      fastify.log.info('[SMTP] Connection established');
    }
  });

  function sendMail(to, from, subject, message) {
    const mail = {
      from,
      to,
      subject,
      html: message,
    };

    transport.sendMail(mail, (error, info) => {
      if (error) {
        fastify.log.error(`[SMTP] Unable to send email ${error}`);
      } else {
        fastify.log.info('[SMTP] Mail has been sent');
      }
    });
  }

  fastify.decorate('sendMail', sendMail);

  done();
});
