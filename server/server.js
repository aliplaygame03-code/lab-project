const express = require('express');
const cors = require('cors');
const initialItems = require('./data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

let products = [...initialItems];

// Проверка статуса сервера
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Тестовый маршрут
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello' });
});

// Получить все элементы или найти по ?search=...
app.get('/api/products', (req, res) => {
  const { search } = req.query;
  if (search) {
    const query = search.toLowerCase();
    const filtered = products.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    return res.json(filtered);
  }
  res.json(products);
});

// Получить один элемент по ID
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = products.find((p) => p.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// Добавить новый элемент
app.post('/api/products', (req, res) => {
  const { title, category, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newItem = {
    id: Date.now(),
    title: title.trim(),
    category: category && category.trim() ? category.trim() : 'General',
    description: description && description.trim() ? description.trim() : 'No description',
  };

  products.unshift(newItem);
  res.status(201).json(newItem);
});

// Удалить элемент
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some((p) => p.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'Item not found' });
  }

  products = products.filter((p) => p.id !== id);
  res.json({ message: 'Deleted successfully', id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});