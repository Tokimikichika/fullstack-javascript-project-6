// @ts-check

import i18next from 'i18next';

export default (app) => {
  const StatusModel = app.objection.models.status;
  const TaskModel = app.objection.models.task;
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await StatusModel.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new StatusModel();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new StatusModel();
      status.$set(req.body.data);

      try {
        const validStatus = await StatusModel.fromJson(req.body.data);
        await StatusModel.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await StatusModel.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', { name: 'oneStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await StatusModel.query().findById(id);

      try {
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('statuses/edit', { status, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const tasks = await TaskModel.query().where('statusId', id);
      if (tasks.length) {
        req.flash('error', i18next.t('flash.statuses.delete.errorTask'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      }

      try {
        await StatusModel.query().deleteById(Number(id));
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      }
      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
