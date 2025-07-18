import express from 'express';
import { AppDataSource } from './database/datasource';

const app = express();
const PORT = 8080;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco conectado!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar no banco:', error);
  });
