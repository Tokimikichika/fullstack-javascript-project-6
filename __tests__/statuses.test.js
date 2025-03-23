// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  prepareUsersData,
  getFakeStatus,
  prepareStatusesData,
  signInApp,
} from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let sessionCookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareUsersData(app); // for Auth
    sessionCookie = await signInApp(app);
    await prepareStatusesData(app);
  });

  it('index', async () => {
    const request = {
      method: 'GET',
      url: app.reverse('statuses'),
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('new', async () => {
    const request = {
      method: 'GET',
      url: app.reverse('newStatus'),
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = getFakeStatus();
    const request = {
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
    };
    await app.inject(request);
    const noExistingStatus = await models.status.query().findOne({ name: params.name });
    expect(noExistingStatus).toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const newStatus = await models.status.query().findOne({ name: params.name });
    expect(newStatus).toMatchObject(params);
  });

  it('edit', async () => {
    const id = 1;

    const request = {
      method: 'GET',
      url: app.reverse('editStatus', { id }),
    };

    // no render without auth
    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    // render with auth and owner id
    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('update', async () => {
    const params = getFakeStatus();
    const id = 1;
    const statusExisting = await models.status.query().findById(1);
    const request = {
      method: 'PATCH',
      url: app.reverse('oneStatus', { id }),
      payload: {
        data: params,
      },
    };

    await app.inject(request);
    const statusExistingSame = await models.status.query().findById(1);
    expect(statusExisting).toMatchObject(statusExistingSame);

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const statusUpdate = await models.status.query().findById(id);
    expect({ ...statusExisting, ...params }).toMatchObject(statusUpdate);
  });

  it('delete', async () => {
    const id = 1;
    const request = {
      method: 'DELETE',
      url: app.reverse('oneStatus', { id }),
    };

    const statusExisting = await models.status.query().findById(id);
    expect(statusExisting).not.toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const statusDelete = await models.status.query().findById(id);
    expect(statusDelete).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
