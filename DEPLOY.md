# Публикация Marketing System

## Что нужно на хостинге

- Runtime: Node.js 18+
- Start command: `node server.js`
- Public HTTP port: из переменной `PORT`

## Переменные

```text
HOST=0.0.0.0
PORT=4174
DATA_DIR=/data
EDITOR_BASE_URL=http://192.168.29.163:4174
PUBLIC_VIEW_BASE_URL=https://ваша-публичная-ссылка
EDITOR_PASSWORD=ваш_пароль_редактора
AUTH_SECRET=длинная_случайная_строка
```

`EDITOR_PASSWORD` защищает редактор. Ссылка руководителя `/view/...` остается без пароля.

`DATA_DIR` лучше указывать на постоянный диск/volume, чтобы данные не пропадали при перезапуске или обновлении сервера.

`EDITOR_BASE_URL` нужен для вас: кнопка `Ссылка редактора` будет копировать локальный Wi-Fi адрес редактора.

`PUBLIC_VIEW_BASE_URL` нужен для руководителя: кнопка `Ссылка руководителю` будет копировать публичную HTTPS-ссылку просмотра.

## Docker

```powershell
docker build -t marketing-system .
docker run -d --name marketing-system -p 4174:4174 -v marketing_system_data:/data -e EDITOR_BASE_URL="http://192.168.29.163:4174" -e PUBLIC_VIEW_BASE_URL="https://ваша-публичная-ссылка" -e EDITOR_PASSWORD="ваш_пароль" -e AUTH_SECRET="длинная_строка" marketing-system
```

После публикации откройте редактор по домену, нажмите `Ссылка руководителю`, и приложение скопирует публичный адрес вида:

```text
https://ваш-домен/view/...
```
