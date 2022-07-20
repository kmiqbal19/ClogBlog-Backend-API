# Project Title

CLOGBLOG (Blog App) API

# `npm start` to run this backend

## Demo

![App Screenshot](https://i.ibb.co/51GjXDH/clogblog-gif.gif)

## Authors

- [@kmiqbal19](https://github.com/kmiqbal19)

![Logo](https://i.ibb.co/ZHFdJhW/city.png)

## API Reference

#### User signup

```http
   POST /api/v1/users/signup
```

| Parameter         | Type     | Description                              |
| :---------------- | :------- | :--------------------------------------- |
| `username`        | `string` | **Required**. Your user name             |
| `email`           | `string` | **Required**. Your email address         |
| `password`        | `string` | **Required**. Your given password        |
| `passwordConfirm` | `string` | **Required**. Your password confirmation |

#### User login

```http
   POST /api/v1/users/login
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `email`    | `string` | **Required**. Your email address  |
| `password` | `string` | **Required**. Your given password |

#### User Update Data

```http
   PATCH /api/v1/users/updateMe
```

| Parameter       | Type     | Description                           |
| :-------------- | :------- | :------------------------------------ |
| `username`      | `string` | **Required**. Your user name          |
| `fullname`      | `string` | **Required**. Your full name          |
| `email`         | `string` | **Required**. Your email address      |
| `id`            | `string` | **Required**. Your user id            |
| `photo`         | `file`   | **Not Required**. Your image          |
| `cloudinary_id` | `string` | **Not Required**. photo cloudinary id |

#### Change Password

```http
  PATCH /api/v1/users/updateMyPassword
```

| Parameter         | Type     | Description                               |
| :---------------- | :------- | :---------------------------------------- |
| `currentPassword` | `string` | **Required** Users current password       |
| `password`        | `string` | **Required**. Users password              |
| `passwordConfirm` | `string` | **Required**. Users password Confirmation |

#### Get all Posts

```http
  GET /api/v1/post
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `jwt`     | `string` | **Required**. Your jwt token |

#### Get Single Post

```http
  GET /api/v1/post/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of post to fetch |
| `jwt`     | `string` | **Required**. Your jwt token      |

#### Create Post

```http
  POST /api/v1/posts
```

| Parameter     | Type     | Description                            |
| :------------ | :------- | :------------------------------------- |
| `jwt`         | `string` | **Required**. Your jwt token           |
| `title`       | `string` | **Required**. Your post title          |
| `description` | `string` | **Required**. Your post description    |
| `categories`  | `Array`  | **Not Required**. Your post categories |
| `photo`       | `file`   | **Not Required**. Your post photo      |

#### Update Post

```http
  PATCH /api/v1/post/${id}
```

| Parameter     | Type     | Description                            |
| :------------ | :------- | :------------------------------------- |
| `id`          | `string` | **Required**. Id of post to update     |
| `jwt`         | `string` | **Required**. Your jwt token           |
| `title`       | `string` | **Required**. Your post title          |
| `description` | `string` | **Required**. Your post description    |
| `categories`  | `Array`  | **Not Required**. Your post categories |
| `photo`       | `file`   | **Not Required**. Your post photo      |

#### Delete Post

```http
  DELETE /api/v1/posts/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of post to delete |
| `jwt`     | `string` | **Required**. Your jwt token       |

## Documentation

[Documentation](https://documenter.getpostman.com/view/20397790/UzR1JMTV)
