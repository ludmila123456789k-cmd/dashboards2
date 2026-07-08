# konglomerat

Готовая папка для GitHub и Render.

## Что загружать в GitHub

Загрузите в репозиторий все файлы из этой папки:

- `public`
- `server.js`
- `package.json`
- `render.yaml`
- `Dockerfile`
- `.dockerignore`
- `.env.example`
- `.gitignore`

Папки `data` здесь специально нет: Render создаст базу данных сам на сервере.

## Render

На Render можно выбрать этот GitHub-репозиторий и создать сервис через `render.yaml`.

Переменная `EDITOR_PASSWORD` задается в Render вручную. Это пароль для редактирования.
