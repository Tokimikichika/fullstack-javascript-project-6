// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareUsersData, signInApp } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // await knex.migrate.latest();
    // await prepareUsersData(app);
  });

  beforeEach(async () => {
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareUsersData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('edit', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;

    const request = {
      method: 'GET',
      url: app.reverse('editUser', { id }),
    };

    // no render without auth
    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const sessionCookie = await signInApp(app);

    // no render with another id
    const idAnother = 3;
    const requestAnother = {
      method: 'GET',
      url: app.reverse('editUser', { id: idAnother }),
    };
    const responseAnother = await app.inject(requestAnother);
    expect(responseAnother.statusCode).toBe(302);

    // render with auth and owner id
    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('update', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;
    const updateParams = testData.users.update;

    const request = {
      method: 'PATCH',
      url: app.reverse('oneUser', { id }),
      payload: {
        data: updateParams,
      },
    };

    // no changes without auth
    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);
    const userExistingSame = await models.user.query().findById(id);
    expect(userExistingSame).toMatchObject(userExisting);

    const sessionCookie = await signInApp(app);

    // no changes with another id
    const idAnother = 3;
    const requestAnother = {
      method: 'PATCH',
      url: app.reverse('oneUser', { id: idAnother }),
      payload: {
        data: updateParams,
      },
      cookies: sessionCookie,
    };
    const userExistingAnother = await models.user.query().findById(idAnother);
    const responseAnother = await app.inject(requestAnother);
    expect(responseAnother.statusCode).toBe(302);
    const userExistingAnotherSame = await models.user.query().findById(idAnother);
    expect(userExistingAnotherSame).toMatchObject(userExistingAnother);

    // changes with auth and owner id
    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);
    const expected = {
      ..._.omit(updateParams, 'password'),
      passwordDigest: encrypt(updateParams.password),
    };
    const userUpdate = await models.user.query().findById(id);
    expect({ ...userExisting, ...expected }).toMatchObject(userUpdate);
  });

  it('delete', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;

    const sessionCookie = await signInApp(app);
    const request = {
      method: 'DELETE',
      url: app.reverse('oneUser', { id }),
    };

    // no deletion without auth
    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);
    const userExistingSame = await models.user.query().findById(id);
    expect(userExistingSame).not.toBeUndefined();

    // no deletion with another id
    const idAnother = 3;
    const requestAnother = {
      method: 'DELETE',
      url: app.reverse('oneUser', { id: idAnother }),
      cookies: sessionCookie,
    };
    const responseAnother = await app.inject(requestAnother);
    expect(responseAnother.statusCode).toBe(302);
    const userExistingAnother = await models.user.query().findById(idAnother);
    expect(userExistingAnother).not.toBeUndefined();

    // deletion with Auth and owner id
    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);
    const userDelete = await models.user.query().findById(id);
    expect(userDelete).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
