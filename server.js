const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true
})
const sequelize = require('./db');
const callbackRoutes = require('./routes/callbackRoutes');
const gameRoutes = require('./routes/gameRoutes');

// CORS ve Headers
fastify.register(require('@fastify/cors'), {
  origin: true,
  credentials: true
});

// Veritabanı senkronizasyonu
(async () => {
  await sequelize.sync(); // tablolar oluşur
})();

// Route'ları kaydet
fastify.register(callbackRoutes);
fastify.register(gameRoutes);

// server başlat
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log("Casino API Server çalışıyor: http://localhost:3000")
})