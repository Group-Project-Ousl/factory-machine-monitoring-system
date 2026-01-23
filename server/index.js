const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'machines.json');

async function readData() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    await fs.mkdir(DATA_DIR, { recursive: true }).catch(()=>{});
    await fs.writeFile(DATA_FILE, '[]').catch(()=>{});
    return [];
  }
}
async function writeData(list) {
  await fs.mkdir(DATA_DIR, { recursive: true }).catch(()=>{});
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

app.get('/api/machines', async (req, res) => {
  const list = await readData();
  res.json(list);
});

app.post('/api/machines', async (req, res) => {
  try {
    const { name, type, status, temp, target } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'name and type required' });
    const list = await readData();
    const id = Date.now().toString(); // simple id
    const item = { id, name, type, status: status || 'Idle', temp: Number(temp || 0), target: Number(target || 0), createdAt: new Date().toISOString() };
    list.push(item);
    await writeData(list);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
