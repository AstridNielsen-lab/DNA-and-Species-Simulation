const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { serialize } = require('cookie');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const CLIENT_ID = "6686456196-725lc9rcv7ooibi3ce3n2s3aqoc60d0g.apps.googleusercontent.com"; // Substitua pelo seu Client ID
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error("Invalid Google token.");
    }
  }
  
  app.post('/api/auth/verify-google-token', async (req, res) => {
    const { token } = req.body;
  
    try {
      const payload = await verifyGoogleToken(token);
      const user = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
  
      const session = {
        email: payload.email,
      };
      const sessionToken = crypto.randomBytes(32).toString('hex'); // Gera um token de sessão seguro
      const cookie = serialize('session', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      });
      res.setHeader('Set-Cookie', cookie);
  
      return res.status(200).json({
        message: "Login successful",
        user: user,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.get('/', (req, res) => {
    res.send('Servidor rodando!');
  });
  
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
  