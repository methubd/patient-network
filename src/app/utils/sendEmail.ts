import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'fmethubd@gmail.com',
      pass: 'zstm sxek qzyc xqih',
    },
  });

  await transporter.sendMail({
    from: '"Reset Password" <fmethubd@gmail.com>', // sender address
    to, // list of receivers
    subject: 'Reset you password within 10 min!', // Subject line
    text: 'We are ready to recover your password again!', // plain text body
    html, // html body
  });
};
