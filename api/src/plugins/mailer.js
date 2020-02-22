import mailer from 'nodemailer';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts, done) => {
  const transport = mailer.createTransport(opts);

  transport.verify((error, success) => {
    if (error) {
      fastify.log.error(`[SMTP] Unable to connect to SMTP server: \n${error}`);
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

    transport.sendMail(mail, error => {
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
