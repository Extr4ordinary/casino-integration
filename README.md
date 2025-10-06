# Casino Integration API

Casino API entegrasyonu için geliştirilmiş Node.js/Fastify backend servisi.


## 📁 Proje Yapısı

```
casino-integration/
├── config/
│   └── casino.js             # Casino API konfigürasyonu
├── controllers/
│   └── callbackController.js # Callback işlemleri
├── middleware/
│   └── casinoResponse.js     # Response middleware
├── models/
│   ├── User.js              # User modeli
│   ├── Transaction.js       # Transaction modeli
│   ├── GameSession.js       # GameSession modeli
│   └── index.js             # Model index
├── routes/
│   ├── callbackRoutes.js    # Callback routes
│   └── gameRoutes.js        # Game routes
├── services/
│   ├── userService.js       # User servisleri
│   └── transactionService.js # Transaction servisleri
├── utils/
│   └── crypto.js            # Şifreleme yardımcıları
├── server.js                # Ana server dosyası
├── package.json             # NPM dependencies
├── ecosystem.config.js      # PM2 konfigürasyonu
└── README.md               
```