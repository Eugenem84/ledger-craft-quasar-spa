#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(
  'platforms',
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
);

// Проверяем, существует ли файл манифеста
if (fs.existsSync(MANIFEST_PATH)) {
  // Читаем содержимое манифеста
  let manifest = fs.readFileSync(MANIFEST_PATH, 'utf8');

  // Удаляем пустой тег <uses-permission />
  manifest = manifest.replace(/<uses-permission\s*\/>/g, '');

  // Перезаписываем манифест
  fs.writeFileSync(MANIFEST_PATH, manifest, 'utf8');
  console.log('Пустой тег <uses-permission /> удалён из AndroidManifest.xml');
} else {
  console.error('Файл AndroidManifest.xml не найден');
}
