# Radio Bot

### Требования
- Node.js (*latest*)
- Python (*latest*)
- FFmpeg (*обязательно версия 6.1.1*)
***Windows: Устанавливать обязательно из архива в репозитории***

### Установка
Установите все зависимости
```bash
npm install
```

Установите переменные окружения в файле `.env`
```md
BOT_TOKEN=ТОКЕН_БОТА
WAYFORPAY_MERCHANT_ACCOUNT=ПЛАТЁЖКА
WAYFORPAY_MERCHANT_SECRET=ПЛАТЁЖКА
WAYFORPAY_MERCHANT_DOMAIN=ПЛАТЁЖКА
WAYFORPAY_API_URL=https://api.wayforpay.com/api
WAYFORPAY_LANGUAGE=ua
DATABASE_URL=URL_БАЗЫ_ДАННЫХ
```

### Запуск бота
```bash
node bot.js
```