// @ts-check

import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareUsersData = async (app) => {
  const { knex } = app.objection;

  // получаем данные из фикстур и заполняем БД
  await knex('users').insert(getFixtureData('users.json'));
};

export const getFakeStatus = () => ({
  name: faker.word.adjective(),
});

export const prepareStatusesData = async (app) => {
  const { knex } = app.objection;
  const statuses = Array(10).fill().map(getFakeStatus);
  await knex('statuses').insert(statuses);
};

export const getFakeLabel = () => ({
  name: faker.word.adjective(),
});

export const prepareLabelsData = async (app) => {
  const { knex } = app.objection;
  const labels = Array(10).fill().map(getFakeLabel);
  await knex('labels').insert(labels);
};

export const getFakeTask = (withLabels) => {
  const task = {
    name: faker.word.adjective(),
    description: faker.lorem.paragraph(),
    statusId: faker.number.int({ min: 1, max: 10 }),
    creatorId: 2, // Marjorie Thiel
    executorId: faker.number.int({ min: 1, max: 3 }),
  };
  return withLabels
    ? {
      ...task,
      labels: [faker.number.int({ min: 1, max: 2 }), faker.number.int({ min: 3, max: 4 })].sort(),
    }
    : task;
};

export const getFakeTaskLabel = (taskId) => ({
  taskId,
  labelId: faker.number.int({ min: 1, max: 10 }),
});

export const prepareTasksData = async (app) => {
  await prepareUsersData(app);
  await prepareLabelsData(app);
  await prepareStatusesData(app);
  const { knex } = app.objection;
  const tasks = Array(5).fill().map(getFakeTask);
  await knex('tasks').insert(tasks);

  const taskLabels = [
    getFakeTaskLabel(1),
    getFakeTaskLabel(1),
    getFakeTaskLabel(2),
    getFakeTaskLabel(4),
    getFakeTaskLabel(5),
    getFakeTaskLabel(5),
    getFakeTaskLabel(5),
  ];
  await knex('tasks_labels').insert(taskLabels);
};

export const signInApp = async (app) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    url: '/session',
    payload: {
      data: getTestData().users.existing,
    },
  });
  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;

  return { [name]: value };
};
