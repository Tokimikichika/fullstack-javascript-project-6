// @ts-check

import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import i18next from 'i18next';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify({
  logger: true,
});

// Настройка i18next
await i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        appName: 'Менеджер задач',
        signIn: 'Вход',
        signUp: 'Регистрация',
        users: 'Пользователи',
        welcome: 'Привет от Hexlet!',
      },
    },
  },
});

// Подключаем шаблонизатор
app.register(fastifyView, {
  engine: {
    pug: await import('pug'),
  },
  root: join(__dirname, 'views'),
  defaultContext: {
    t: i18next.t.bind(i18next),
    assetPath: (filename) => `/assets/${filename}`,
  },
});

// Подключаем статические файлы
app.register(fastifyStatic, {
  root: join(__dirname, 'public'),
  prefix: '/assets/',
});

app.get('/', async (request, reply) => {
  return reply.view('index.pug');
});

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

app.listen({ port, host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

export default app; 