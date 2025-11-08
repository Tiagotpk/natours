const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('useFindAndModify', false);
mongoose.set('autoIndex', true);
mongoose.set('strictQuery', false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('DB connection error:', err);
  });

//LENDO O ARQUIVO JSON

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//ADICIONANDO AO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log('Error loading data:', err);
  }
  process.exit();
};

//DELETANDO TODOS OS DADOS DO DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log('Error deleting data:', err);
  }
  process.exit();
};

//EXECUTANDO FUNÇÕES PELA LINHA DE COMANDO
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
