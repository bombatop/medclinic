# Stack
- React.js (tailwind, zustand, react-query)
- Java Spring Boot (jpa, web, security, redis?)
- MySQL (xampp, maybe docker?)

## Функциональность:
- Перейти на react-query
- Сделать нормальный компонент календаря
- Сделать нормальный компонент селекта с поиском
- Сделать нормальный список записей, мейби как в расписании тут[ссылка](https://www.asu.ru/timetable/students/10/)
- Сделать нормальный navbar 
- Раздобыть иконки

- Хранить договоры страхований
    - подтягивать их для страницы пациента
    - при создании журнала подтягивать список всех договоров для пациента из journal_agreement
        - если нет, то явно написать о том что нет
        - если есть хоть какое-то, то явно написать о том что подобрано последнее по дате, но чтобы можно было поменять в случае чего и сохранить

- Создание журнала из нескольких этапов
    - выбор доктора, пациента и даты для записи, после выбора ставится confirm, запись создается (отправляется на бд)
    - можно выбрать любой treatment и количество
    - каждый treatment будет условно говоря строкой, дефолтная цена будет первым столбцом, договор будет вторым
    - можно нажать на "+ добавить договор", появляется селект с доступными договорами для пациента, автоматически выбирается последний и мгновенно сохраняется связь между journal и agreement, но ее можно update на любое изменение
        - если договора нет (это необходимо предварительно проверить и вывести вместо селекта соответствующий текст с предложением создать новый), всегда можно создать в меню-оверлее: страницы с созданием связи между patient и agreement нет и не будет, нужно сделать таким вот компонентом, который будет интегрироваться в другие страницы (эту и страницу пациента), тут же отследить что он был добавлен и превратить текст в селект с автовыбором единственной позиции
    - при изменении договора слетают все цены по нему, собираются новые по кусочкам
    - пересчет цен в строке при изменении количества treatment
    - запрос на новые цены при добавлении нового treatment, если есть договор, запрос и по ним
    - все это дерьмо хранится в кэше, нужно требовать с пользователя confirm, не давать ему уйти в другие компоненты если это все не сохранено
    - после сохранения есть кнопка edit, все что уже сохранено по ценам и услугам еще раз выгружается в кэш и теперь процесс редактирования работает как описано вышя

- Скрытый пользователь (доктор, мб еще какие-то сущности; определиться на каком уровне в запрос передается этот доп параметр)
- Не удалять без проверки на использование в других таблицах (валидация cascade)
- Допилить отображение валидации на асболютно всех страницах (парсить ошибку 422)
- Цены для страховой компании (проверить что сделано)
- Основная страховая компания (подтягивается для записей по дефолту) (проверить что сделано)

- Кастомные классификаторы
- Парсинг МКБ
- SECURITY

- Удалять файлы для удаленных журналов, придумать как хранить файлы по умному а не хардкодом на сервере.
    - Нужно найти нормальный облачный сервис и просто через его API отправлять туда все файлы говна

## QoL, UI, микрофичи на потенциальную доработку:
- Drag and drop на загрузке файлов
- Сортировать таблицы на клиенте
- Update не через кнопку, а через ивенты, научиться делать окна с сообщением о том, что изменение внесено успешно
- Для pagination: выбирать количество записей на странице через dropdown?

