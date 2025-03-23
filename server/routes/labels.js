// @ts-check

import i18next from 'i18next';

export default (app) => {
  const LabelModel = app.objection.models.label;
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await LabelModel.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new LabelModel();
      reply.render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new LabelModel();
      label.$set(req.body.data);

      try {
        const validLabel = await LabelModel.fromJson(req.body.data);
        await LabelModel.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await LabelModel.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .patch('/labels/:id', { name: 'oneLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await LabelModel.query().findById(id);

      try {
        await label.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const labelTasks = await LabelModel.query().findById(id).withGraphFetched('tasks');
      if (labelTasks.tasks?.length) {
        req.flash('error', i18next.t('flash.labels.delete.errorTask'));
        reply.redirect(app.reverse('labels'));
        return reply;
      }

      try {
        await LabelModel.query().deleteById(Number(id));
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }
      reply.redirect(app.reverse('labels'));
      return reply;
    });
};
