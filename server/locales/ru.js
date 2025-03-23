// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    sourceCode: 'Исходный код',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          success: 'Пользователь успешно зарегистрирован',
          error: 'Не удалось зарегистрировать',
        },
        update: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          error: 'Не удалось удалить пользователя',
        },
        onlyOwnerAccess: 'Вы не можете редактировать или удалять другого пользователя',
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        update: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удалён',
          errorTask: 'Нельзя удалить статус связанный с задачей',
          error: 'Не удалось удалить статус',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        update: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          errorTask: 'Нельзя удалить метку связанную с задачей',
          error: 'Не удалось удалить метку',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        update: {
          success: 'Задача успешно изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        email: 'Email',
        password: 'Пароль',
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        users: 'Пользователи',
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        email: 'Email',
        password: 'Пароль',
        actions: 'Действия',
        updateAction: 'Изменить',
        deleteAction: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
          back: 'Назад',
        },
        update: {
          title: 'Изменение пользователя',
          submit: 'Изменить',
          back: 'Отмена',
        },
      },
      statuses: {
        statuses: 'Статусы',
        createAction: 'Создать статус',
        id: 'ID',
        name: 'Наименование',
        updateAction: 'Изменить',
        deleteAction: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          title: 'Создание статуса',
          submit: 'Создать',
          back: 'Отмена',
        },
        update: {
          title: 'Изменение статуса',
          submit: 'Изменить',
          back: 'Отмена',
        },
      },
      labels: {
        labels: 'Метки',
        createAction: 'Создать метку',
        id: 'ID',
        name: 'Наименование',
        updateAction: 'Изменить',
        deleteAction: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          title: 'Создание метки',
          submit: 'Создать',
          back: 'Отмена',
        },
        update: {
          title: 'Изменение метки',
          submit: 'Изменить',
          back: 'Отмена',
        },
      },
      tasks: {
        tasks: 'Задачи',
        createAction: 'Создать задачу',
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        labels: 'Метки',
        updateAction: 'Изменить',
        deleteAction: 'Удалить',
        createdAt: 'Дата создания',
        label: 'Метка',
        onlyMyTasks: 'Только мои задачи',
        showAction: 'Показать',
        new: {
          title: 'Создание задачи',
          submit: 'Создать',
          back: 'Отмена',
        },
        update: {
          title: 'Изменение задачи',
          submit: 'Изменить',
          back: 'Отмена',
        },
        show: {
          back: 'Назад',
        },
      },
      welcome: {
        title: 'Менеджер задач',
        description: 'Организуйте всю свою команду и себя. Получите полный контроль над задачами',
        start: 'Начать',
      },
    },
  },
};
