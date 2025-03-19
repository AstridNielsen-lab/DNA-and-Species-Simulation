import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

app.post('/api/auth/verify-google-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token não fornecido' });
    }

    // Verificar o token com o Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    // Criar ou atualizar usuário no banco de dados
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visits: 1
    };

    // Aqui você pode adicionar lógica para salvar o usuário no seu banco de dados
    // Por exemplo, usando Supabase ou outro banco de dados

    res.status(200).json({
      user,
      message: 'Autenticação realizada com sucesso'
    });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({
      message: 'Erro na autenticação',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});