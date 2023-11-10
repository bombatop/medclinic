bugs to fix / microfeatures to add: 

  functionality:
    пометка на удаление (доктор, мб что-то еще),
    при добавлении цены повторно, она добавляется на клиенте, но не на бэке(нужно либо убрать на клиенте, либо дублировать на бэке),
    регистрация врачей и админа,
    не удалять без проверки на использование в других таблицах (валидация cascade),
    допилить отображение валидации на асболютно всех страницах, отключить ошибки при прохождении валидации,
    печатная форма записи со всеми данными по ней в виде pdf
    цены для страховой компании
    кастомные классификаторы
    парсинг МКБ
    хранить договоры страхований, подтягивать их для страницы пользователя и записи, в записи подбирать цену на основе даты договора 

  QoL, UI:
    drag and drop на загрузке файлов,
    поменять длину pageable на нормальное число во фронте,
    изменять дату только если нет прайсов (фронт) УЖЕ ПОФИКСИЛ, СДЕЛАТЬ ДИАЛОГОВОЕ ОКНО или другой календарь
    сортировать таблицы на клиенте
    поменять все календари и строки поиска (treatments, profits)
    при создании записи если в поле поиска ничего нет, то предложить создать

  Code Readability:
    перенести на спрингбут
    распилить фронт на папки
    убрать или привести к одному виду логи на фронте
  
