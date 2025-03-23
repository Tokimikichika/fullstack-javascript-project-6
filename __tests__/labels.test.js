// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  prepareUsersData,
  getFakeLabel,
  prepareLabelsData,
  signInApp,
} from './helpers/index.js';

describe('test labels CRUD', () => {
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
    await prepareLabelsData(app);
  });

  it('index', async () => {
    const request = {
      method: 'GET',
      url: app.reverse('labels'),
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
      url: app.reverse('newLabel'),
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
    const params = getFakeLabel();
    const request = {
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
    };
    await app.inject(request);
    const noExistingLabel = await models.label.query().findOne({ name: params.name });
    expect(noExistingLabel).toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const newLabel = await models.label.query().findOne({ name: params.name });
    expect(newLabel).toMatchObject(params);
  });

  it('edit', async () => {
    const id = 1;

    const request = {
      method: 'GET',
      url: app.reverse('editLabel', { id }),
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
    const params = getFakeLabel();
    const id = 1;
    const labelExisting = await models.label.query().findById(1);
    const request = {
      method: 'PATCH',
      url: app.reverse('oneLabel', { id }),
      payload: {
        data: params,
      },
    };

    await app.inject(request);
    const labelExistingSame = await models.label.query().findById(1);
    expect(labelExisting).toMatchObject(labelExistingSame);

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const labelUpdate = await models.label.query().findById(id);
    expect({ ...labelExisting, ...params }).toMatchObject(labelUpdate);
  });

  it('delete', async () => {
    const id = 1;
    const request = {
      method: 'DELETE',
      url: app.reverse('oneLabel', { id }),
    };

    const labelExisting = await models.label.query().findById(id);
    expect(labelExisting).not.toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const labelDelete = await models.label.query().findById(id);
    expect(labelDelete).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
