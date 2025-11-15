#!/bin/bash

echo "🗺️  Генерация sitemap.xml перед билдом..."

# Запускаем генератор sitemap
node scripts/generate-sitemap.js

if [ $? -eq 0 ]; then
  echo "✅ Sitemap успешно обновлён!"
else
  echo "❌ Ошибка при генерации sitemap"
  exit 1
fi
