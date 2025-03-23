// @ts-check

import i18next from 'i18next';

export default (app) => {
  const UserModel = app.objection.models.user;
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await UserModel.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new UserModel();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new UserModel();
      user.$set(req.body.data);

      try {
        const validUser = await UserModel.fromJson(req.body.data);
        await UserModel.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate, preHandler: app.onlyOwnerAccess }, async (req, reply) => {
      reply.render('users/edit', { user: req.user });
      return reply;
    })
    .patch('/users/:id', { name: 'oneUser', preValidation: app.authenticate, preHandler: app.onlyOwnerAccess }, async (req, reply) => {
      const { id } = req.params;
      const user = await UserModel.query().findById(id);

      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate, preHandler: app.onlyOwnerAccess }, async (req, reply) => {
      const { id } = req.params;
      try {
        await UserModel.query().deleteById(Number(id));
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.delete.error'));
      }
      reply.redirect(app.reverse('users'));
    });
};
