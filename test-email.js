import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: '198.54.115.112',
  port: 465,
  secure: true,
  auth: {
    user: 'support@minevertex.com',
    pass: '@minevertex.com',
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function test() {
  console.log('Attempting to connect to Namecheap SMTP server...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful! Credentials are valid.');
    
    console.log('Attempting to send a test email...');
    await transporter.sendMail({
      from: '"MineVertex Support" <support@minevertex.com>',
      to: 'support@minevertex.com',
      subject: 'SMTP Configuration Test',
      text: 'If you are seeing this, your SMTP configuration is perfectly valid!',
    });
    console.log('✅ Test email sent successfully to support@minevertex.com!');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

test();
