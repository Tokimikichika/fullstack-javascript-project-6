// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer' },
        executorId: { type: ['integer', 'null'] },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: './Status.cjs',
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: './User.cjs',
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: './User.cjs',
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: './Label.cjs',
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }

  static modifiers = {
    defaultSelects(query) {
      query.select();
    },

    filterStatus(query, statusId) {
      query.where('statusId', statusId);
    },

    filterExecutor(query, executorId) {
      query.where('executorId', executorId);
    },

    filterLabel(query, labelId) {
      query.joinRelated('labels').where('labels.id', labelId);
    },

    filterIsCreatorUser(query, userId) {
      query.where('creatorId', userId);
    },
  };

  $parseJson(json, opt) {
    // eslint-disable-next-line no-param-reassign
    json = super.$parseJson(json, opt);
    const labelIds = [].concat((json.labels || [])).map((l) => ({ id: Number(l) }));
    return {
      ...json,
      statusId: Number(json.statusId),
      executorId: Number(json.executorId) || null,
      labels: labelIds,
    };
  }
};
