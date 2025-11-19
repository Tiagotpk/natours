const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Um tour deve ter um nome'],
      unique: true,
      trim: true,
      maxlength: [40, 'Um tour deve ter 40 ou menos caracteres'],
      minlength: [10, 'Um tour deve ter 10 ou mais caracteres'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'pt-BR', { ignore: ' ' });
        },
        message: 'O nome do tour deve conter apenas letras',
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Um tour deve ter uma duração'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Um tour deve ter um tamanho máximo de grupo'],
    },
    difficulty: {
      type: String,
      required: [true, 'Um tour deve ter uma dificuldade'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Dificuldade: fácil, média ou difícil',
      },
    },
    price: {
      type: Number,
      required: [true, 'Um tour deve ter um preço'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A classificação média deve ser acima de 1.0'],
      max: [5, 'A classificação média deve ser abaixo de 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'O preço com desconto ({VALUE}) deve ser menor que o preço normal',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Um tour deve ter um resumo'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Um tour deve ter uma imagem de capa'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    autoIndex: false,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Consulta realizada em ${Date.now() - this.start} millisegundos!`
  );
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
