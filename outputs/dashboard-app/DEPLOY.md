# Публикация Dashboard Studio

## Что нужно на хостинге

- Runtime: Node.js 18+
- Start command: `node server.js`
- Public HTTP port: из переменной `PORT`

## Переменные

```text
HOST=0.0.0.0
PORT=4173
DATA_DIR=/data
EDITOR_BASE_URL=http://192.168.29.163:4173
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
docker build -t dashboard-studio .
docker run -d --name dashboard-studio -p 4173:4173 -v dashboard_data:/data -e EDITOR_BASE_URL="http://192.168.29.163:4173" -e PUBLIC_VIEW_BASE_URL="https://ваша-публичная-ссылка" -e EDITOR_PASSWORD="ваш_пароль" -e AUTH_SECRET="длинная_строка" dashboard-studio
```

После публикации откройте редактор по домену, нажмите `Ссылка руководителю`, и приложение скопирует публичный адрес вида:

```text
https://ваш-домен/view/...
```
