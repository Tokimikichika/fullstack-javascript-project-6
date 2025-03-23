// @ts-check

export default {
  translation: {
    appName: 'Task manager',
    sourceCode: 'Source code',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          success: 'User registered successfully',
          error: 'Failed to register',
        },
        update: {
          success: 'User updated successfully',
          error: 'Failed to update user',
        },
        delete: {
          success: 'User deleted successfully',
          error: 'Failed to delete user',
        },
        onlyOwnerAccess: 'You cannot update or delete another user',
      },
      statuses: {
        create: {
          success: 'Status created successfully',
          error: 'Failed to create status',
        },
        update: {
          success: 'Status updated successfully',
          error: 'Failed to update status',
        },
        delete: {
          success: 'Status deleted successfully',
          errorTask: 'Impossible to delete status connected to a task',
          error: 'Failed to delete status',
        },
      },
      labels: {
        create: {
          success: 'Label created successfully',
          error: 'Failed to create label',
        },
        update: {
          success: 'Label updated successfully',
          error: 'Failed to update label',
        },
        delete: {
          success: 'Label deleted successfully',
          errorTask: 'Impossible to delete label connected to a task',
          error: 'Failed to delete label',
        },
      },
      tasks: {
        create: {
          success: 'Task created successfully',
          error: 'Failed to create task',
        },
        update: {
          success: 'Task updated successfully',
          error: 'Failed to update task',
        },
        delete: {
          success: 'Task deleted successfully',
          error: 'Failed to delete task',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        labels: 'Labels',
        tasks: 'Tasks',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        email: 'Email',
        password: 'Password',
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        users: 'Users',
        id: 'ID',
        firstName: 'First name',
        lastName: 'Last name',
        fullName: 'Full name',
        email: 'Email',
        password: 'Password',
        actions: 'Actions',
        updateAction: 'Update',
        deleteAction: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Register',
          signUp: 'Register',
          back: 'Back',
        },
        update: {
          title: 'Update user',
          submit: 'Save',
          back: 'Cancel',
        },
      },
      statuses: {
        statuses: 'Statuses',
        createAction: 'Create status',
        id: 'ID',
        name: 'Name',
        updateAction: 'Update',
        deleteAction: 'Delete',
        createdAt: 'Created at',
        new: {
          title: 'Create status',
          submit: 'Create',
          back: 'Cancel',
        },
        update: {
          title: 'Update status',
          submit: 'Save',
          back: 'Cancel',
        },
      },
      labels: {
        labels: 'Labels',
        createAction: 'Create label',
        id: 'ID',
        name: 'Name',
        updateAction: 'Update',
        deleteAction: 'Delete',
        createdAt: 'Created at',
        new: {
          title: 'Create label',
          submit: 'Create',
          back: 'Cancel',
        },
        update: {
          title: 'Update label',
          submit: 'Save',
          back: 'Cancel',
        },
      },
      tasks: {
        tasks: 'Tasks',
        createAction: 'Create task',
        id: 'ID',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        creator: 'Creator',
        executor: 'Executor',
        labels: 'Labels',
        updateAction: 'Update',
        deleteAction: 'Delete',
        createdAt: 'Created at',
        label: 'Label',
        onlyMyTasks: 'Only my tasks',
        showAction: 'Show',
        new: {
          title: 'Create task',
          submit: 'Create',
          back: 'Cancel',
        },
        update: {
          title: 'Update task',
          submit: 'Save',
          back: 'Cancel',
        },
        show: {
          back: 'Back',
        },
      },
      welcome: {
        title: 'Task manager',
        description: 'Organize your entire team and yourself. Get full control over tasks',
        start: 'Start',
      },
    },
  },
};
