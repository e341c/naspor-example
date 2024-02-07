# Используйте официальный образ Node.js
FROM node:19.5.0

# Устанавливаем зависимости
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения, если необходимо
# ENV PORT=3003

# Открываем порт, на котором работает приложение
EXPOSE 3003

# Команда для запуска приложения
CMD npx knex migrate:latest && npm start