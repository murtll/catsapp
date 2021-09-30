<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="http://typeorm.com/" target="blank"><img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" width="320" alt="TypeORM Logo" /></a>
</p>

# Тестовое задание для RobotBull

## Описание решения

Решение создано с использованием NestJS, TypeORM, PostgreSQL и MinIO.

Основной сущностью являются котики, представляются в виде объектов JSON как

```json
{
  "id": 1,
  "name": "Kote",
  "color": "black",
  "breed": "siamese",
  "age": 2,
  "photo": "host:port/hash.jpg",
  "cost": 300.0,
  "booked": false
}
```

Таблица в БД выглядит следующим образом:
```
                           Table "public.cats"
Column |  Type   | Collation | Nullable |             Default              
-------+---------+-----------+----------+----------------------------------
id     | bigint  |           | not null | nextval('cats_id_seq'::regclass)
name   | text    |           | not null |
breed  | text    |           | not null |
color  | text    |           | not null |
age    | integer |           | not null |
cost   | numeric |           | not null |
booked | boolean |           | not null | false
photo  | text    |           |          |
```


### API Endpoints

* GET `/` - возвращает строку `Server is running`, если сервер запущен.


* GET `/cats` - возвращает массив всех котиков, принимаются опциональные параметры 
  * `id` - если был передан, будет возвращен только котик с таким id.
  Если котика с таким id не существует, будет возвращен HTTP 400 BadRequest.
  * `booked` - boolean, будут возвращены только котики, у которых поле booked соответствует значению параметра.
  * `take` - int, передается только в паре со `skip`, в нем указывается количество котиков, которых нужно вернуть.
  * `skip` - int, передается только в паре с `take`, в нем указывается начиная с какого котика сущности будут добавлены в ответ.


* POST `/cats` - принимает котика в формате JSON вида
  ```json
  {
    "name": "Kote",
    "color": "black",
    "breed": "siamese",
    "age": 2,
    "cost": 300.0
  }
  ```
  и сохраняет его в БД. Возвращает созданного котика и HTTP 201 Created. В случае если будет указан id, 
  вернется HTTP 400 BadRequest, так как id должен задаваться автоматически базой данных.


* DELETE `/cats` - принимает параметр `id`, удаляет котика с таким id из БД. Возвращает HTTP 200 OK и результат удаления.
Если котика с таким id не существует, вернется HTTP 400 BadRequest.


* POST `/cats/photo/:id` - принимает параметр `id` и файл формата PNG, JPG, или JPEG в multipart файле с именем `file`.
Возвращает HTTP 201 Created, или HTTP 400 BadRequest, если котика с таким id не существует.


* PATCH `/cats` - принимает обновленные данные для котика в формате JSON вида
  ```json
  {
    "id": 1,
    "name": "Louie",
    "color": "brown",
    "breed": "siamese",
    "age": 3,
    "cost": 300.0
  }
  ```
  Возвращает HTTP 200 OK и результат обновления, или HTTP 400 BadRequest, если котика с таким id не существует, или не был передан id,
или был передан параметр booked, так как для бронирования котиков следует
использовать отдельный маппинг.


* GET `/cats/book` - принимает параметр `id`, бронирует котика c таким id, возвращает HTTP 200 OK, или
  HTTP 400 BadRequest, если этот котик уже забронирован.


* GET `/cats/unbook` - принимает параметр `id`, разбронирует котика c таким id, возвращает HTTP 200 OK, или
  HTTP 400 BadRequest, если этот котик еще не забронирован.
  
## Запуск приложения

#### ! ! ! Перед запуском необходимо изменить данные для подключения к БД и MinIO на ваши ! ! !

Данные для подключения к БД находятся в файле [ormconfig.json](./ormconfig.json). Нужно изменить параметр `url`
на верный.

Данные для подключения к MinIO находятся в файле [src/minio-client/config.ts](./src/minio-client/config.ts). Нужно изменить 
все необходимые параметры на верные. Параметр baseBucket указывает на имя bucket, куда будут сохраняться фотографии.

Порт для запуска приложения можно изменить в файле [src/main.ts](./src/main.ts). По умолчанию запускается на порту 8080.
Также нужно будет изменить открываемый порт в файле [Dockerfile](./Dockerfile).

Для запуска достаточно запустить

```shell
$ npm install
$ npm run start
```

Для запуска через Docker нужно собрать образ и запустить его в контейнере.

```shell
$ docker build . -t  <container-tag>
$ docker run -p <DOCKER_PORT>:<APP_PORT> <container-tag>
```

Где APP_PORT и DOCKER_PORT нужно заменить на реальные значения порта приложения и порта, на котором будет запущен
контейнер, а container-tag на любой тэг контейнера.