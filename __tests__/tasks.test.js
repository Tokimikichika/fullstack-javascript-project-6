// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  getFakeTask,
  prepareTasksData,
  signInApp,
} from './helpers/index.js';

describe('test tasks CRUD', () => {
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
    await prepareTasksData(app);
    sessionCookie = await signInApp(app);
  });

  it('index', async () => {
    const request = {
      method: 'GET',
      url: app.reverse('tasks'),
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
      url: app.reverse('newTask'),
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
    const params = getFakeTask(true);
    const request = {
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
    };
    await app.inject(request);
    const noExistingTask = await models.task.query().findOne({ name: params.name });
    expect(noExistingTask).toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const newTask = await models.task.query().findOne({ name: params.name }).withGraphFetched('labels');
    newTask.labels = newTask.labels.map(({ id }) => id).sort();
    expect(newTask).toMatchObject(params);
  });

  it('edit', async () => {
    const id = 1;

    const request = {
      method: 'GET',
      url: app.reverse('editTask', { id }),
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
    const params = getFakeTask(true);
    const id = 1;
    const taskExisting = await models.task.query().findById(1);
    const request = {
      method: 'PATCH',
      url: app.reverse('oneTask', { id }),
      payload: {
        data: params,
      },
    };

    await app.inject(request);
    const taskExistingSame = await models.task.query().findById(1);
    expect(taskExisting).toMatchObject(taskExistingSame);

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const taskUpdate = await models.task.query().findById(id).withGraphFetched('labels');
    taskUpdate.labels = taskUpdate.labels.map(({ id: labelId }) => labelId).sort();
    expect({ ...taskExisting, ...params }).toMatchObject(taskUpdate);
  });

  it('delete', async () => {
    const id = 1;
    const request = {
      method: 'DELETE',
      url: app.reverse('oneTask', { id }),
    };

    const taskExisting = await models.task.query().findById(id);
    expect(taskExisting).not.toBeUndefined();

    await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    const taskDelete = await models.task.query().findById(id);
    expect(taskDelete).toBeUndefined();
  });

  it('filter', async () => {
    const requestEmptyFilter = {
      method: 'GET',
      url: `${app.reverse('tasks')}?status=&executor=&label=`,
    };
    const responseEmptyFilter = await app.inject({
      ...requestEmptyFilter,
      cookies: sessionCookie,
    });
    expect(responseEmptyFilter.statusCode).toBe(200);

    const id = 1;
    const task = await models.task.query().findById(id).withGraphFetched('labels');
    const requestFilledFilter = {
      method: 'GET',
      url: `${app.reverse('tasks')}?status=${task.statusId}&executor=${task.executorId}&label=${task.labels[0].id}`,
    };
    const responseFilledFilter = await app.inject({
      ...requestFilledFilter,
      cookies: sessionCookie,
    });
    expect(responseFilledFilter.statusCode).toBe(200);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
