const header = {
  uz: "uz",
  ru: "ru",
  en: "en",
  action: "действия",
  create: "создать",
  delete: "удалить",
  update: "редактировать",
  basket: "Корзина",
  transfer: "Перевод",
  login: {
    welcome: "Добро пожаловать в Arifsolar",
    title: "Вход",
    password: "Пароль",
    enter: "войти",
    wrongpasswor: "Неверное имя пользователя или пароль! Пожалуйста, попробуйте снова",
  },

  alerts: {
    password_incorreect:
      "неверный пароль: пароль должен состоять как минимум из одной заглавной буквы, символа и цифры, должен содержать от 6 до 30 символов",
    confirmdelete: "Вы уверены, что хотите удалить?",
    ok: "ок",
    no: "отмена",
    inputError: "Поля ввода не должны быть пустыми",
    nodelete: "нет разрешения",
    deleted: "Успешно удалено",
    added: "Успешно добавлено в корзину",
    edited: "Успешно изменено",
    slownetwork: "Ваш интернет отсутствует или очень медленный",
    warning: "что-то пошло не так, пожалуйста, попробуйте снова",
  },

  sidebar: {
    banners: "Баннеры",
    cars: "Автомобили",
    answers: "Вопросы и ответы",
    reviews: "Отзывы",
    leeds: "Лиды",
    admins: "Менеджеры",
    mobile: "мобильный",
    type: "тип",
    exit: "Выход",
    role: "роль",
  },

  home: {
    start_time: "время начала",
    end_time: "время окончания",
    budget: "бюджет",
    clients: "клиенты",
    total_profit: "общая прибыль",
    expenses: "расходы",
  },

  table: {
    fuel_type: "тип топлива",
    max_speed: "макс. скорость",
    place: "место",
    tinting: "тонировка",
    baggage: "багаж",
    conditioner: "кондиционер",
    false: "недоступно",
    true: "доступно",

    lang: "язык",
    star: "звезда",
    from: "от",
    ordered: "заказано",
    moving_from_country: "страна отправления",
    entered_to_country: "страна прибытия",
    delivered: "доставлено",
    creator: "создатель",
    types: "фильтр просмотра",
    all: "все",
    by_category: "по категории",
    by_client: "по клиенту",
    by_fesclient: "по клиенту ФЭС",
    complated: "завершено",
    active: "активно",
    kurs: "курс",
    shipment_id: "идентификатор отправления",
    custom_date: "пользовательское время",
    residual_amount: "краткая информация",
    complated_amount: "подробная информация",
    complated: "завершено",
    image: "изображение",
    exist: "существует",
    deliver_name: " имя доставщика",
    deliver_phone: "телефон доставщика",
    truck_number: "основной",
    add_shipment: "Добавить отправление",
    name: "имя",
    sale: "продажа",
    titile: "заголовок",
    sale_cost: "стоимость продажи",
    sale_amount: "процент скидки",
    subtitle: "подзаголовок",
    info: "информация",
    created_at: "создано в",
    amount: "количество",
    overall_price: "пищевая ценность",
    payed_price: "ингредиенты",
    status: "статус",
    country: "Категория",
    country_number: " номер заказа",
    id: "идентификатор",
    inn: "ИНН",
    total_amount: "общая сумма",
    type: "Тип автомобиля",
    seria_id: "под",
    sum: "Сумма",
    dollar: "в валюте",
    stock_id: "идентификатор склада",
    price: "подзаголовок",
    client_id: "идентификатор клиента",
    new_price: "стоимость",
    direction: "направление",
    product_name: "название продукта",
    client_name: "имя клиента",
    client_number: "номер клиента",
    phone_number: "номер телефона",
    additional_info: "дополнительная информация",
    expenses_name: "название расходов",
    rows_per_page: "Строк на страницу",
    date: "время",
    status: "статус",
    direction: "направление",
    rejected: "отклонено",
    accepted: "принято",
    reject: "отклонить",
    accept: "принять",
    pending: "в ожидании",
    warehouse: "Склад",
    employee: "сотрудник",
    location: "местоположение",
  },

  modal: {
    add: "Добавить",
    addProduct: {
      addproduct: "Добавить продукт",
      editproduct: "Редактировать продукт",
      count: "количество",
      kg: "кг",
      liter: "литр",
      meter: "метр",
      sale: "продажа",
      addtocart: "Добавить в корзину",
      sale_product: "Продажа продукта",
      total_price: "Общая цена",
    },
    addDeliver: {
      adddeliver: "Добавить категорию",
      editdeliver: "Редактировать категорию",
    },
    addOrder: {
      addorder: "Добавить заказ",
      editorder: "Редактировать заказ",
    },
    addWarehouse: {
      title: "Добавить бренд",
      edit: "Редактировать бренд",
      transfer_from_werhouse: "Перевод из Главного склада",
      transfer_to_werhouse: "Перевод со склада на склад",
    },
    addClient: {
      title: "Добавить клиента",
      edit: "Редактировать клиента",
    },
    addExpenses: {
      title: "Добавить расходы",
      edit: "Редактировать расходы",
    },
    addIncome: {
      title: "Добавить доход",
      edit: "Редактировать доход",
    },
    addCategory: {
      title: "Добавить категорию",
      edit: "Редактировать категорию",
      category: "Категория",
      subcategory: "Подкатегория",
      subtitle: "Добавить подкатегорию",
      subedit: "Редактировать подкатегорию",
    },
    addCompany: {
      title: "Добавить компанию",
      edit: "Редактировать компанию",
      category: "Компания",
      subcategory: "номер счета",
      subtitle: "Добавить счет компании",
      subedit: "Редактировать счет компании",
    },
    fes: {
      AddModal: {
        type: "тип",
        power: "Мощность",
        fes_client: "Добавить клиента ФЭС",
        fes_application: "Добавить заявку ФЭС",
        edit_fes_application: "Редактировать заявку ФЭС",
        edit_fes_client: "Редактировать клиента ФЭС",
      },
    },
  },
};

export default header;
