const { User, Transaction, GameSession } = require('../models');

async function gameRoutes(fastify, options) {
  
  // GET /games - Tüm oyunları listele
  fastify.get('/games', async (request, reply) => {
    const { limit = 10, provider, category } = request.query;
    
    // Mock oyun verisi
    const games = [
      { id: 1, name: 'Book of Ra', provider: 'HABANERO', category: 51, type: 'slot' },
      { id: 2, name: 'Starburst', provider: 'NETENT', category: 52, type: 'slot' },
      { id: 3, name: 'Blackjack', provider: 'HABANERO', category: 53, type: 'table' },
      { id: 4, name: 'Roulette', provider: 'NETENT', category: 53, type: 'table' },
      { id: 5, name: 'Poker', provider: 'HABANERO', category: 53, type: 'table' },
      { id: 6, name: 'Baccarat', provider: 'NETENT', category: 53, type: 'table' },
      { id: 7, name: 'Mega Moolah', provider: 'HABANERO', category: 51, type: 'slot' },
      { id: 8, name: 'Gonzo\'s Quest', provider: 'NETENT', category: 52, type: 'slot' },
      { id: 9, name: 'Dead or Alive', provider: 'HABANERO', category: 51, type: 'slot' },
      { id: 10, name: 'Immortal Romance', provider: 'NETENT', category: 52, type: 'slot' }
    ];
    
    let filteredGames = games;
    
    // Provider'a göre filtreleme
    if (provider) {
      filteredGames = filteredGames.filter(game => 
        game.provider.toLowerCase() === provider.toLowerCase()
      );
    }
    
    // Kategoriye göre filtreleme
    if (category) {
      filteredGames = filteredGames.filter(game => 
        game.category === parseInt(category)
      );
    }
    
    // Limit uygula
    const limitedGames = filteredGames.slice(0, parseInt(limit));
    
    return {
      success: true,
      data: limitedGames,
      total: filteredGames.length,
      limit: parseInt(limit),
      filters: { provider, category }
    };
  });
  
  // GET /games/:id - Belirli bir oyunu getir
  fastify.get('/games/:id', async (request, reply) => {
    const { id } = request.params;
    
    // Mock oyun verisi
    const games = [
      { id: 1, name: 'Book of Ra', provider: 'HABANERO', category: 51, type: 'slot', description: 'Ancient Egyptian themed slot game' },
      { id: 2, name: 'Starburst', provider: 'NETENT', category: 52, type: 'slot', description: 'Space-themed slot with expanding wilds' },
      { id: 3, name: 'Blackjack', provider: 'HABANERO', category: 53, type: 'table', description: 'Classic card game' },
      { id: 4, name: 'Roulette', provider: 'NETENT', category: 53, type: 'table', description: 'European roulette' },
      { id: 5, name: 'Poker', provider: 'HABANERO', category: 53, type: 'table', description: 'Texas Hold\'em poker' }
    ];
    
    const game = games.find(g => g.id === parseInt(id));
    
    if (!game) {
      return reply.code(404).send({
        success: false,
        error: 'Game not found',
        game_id: id
      });
    }
    
    return {
      success: true,
      data: game
    };
  });
  
  // GET /providers - Tüm provider'ları listele
  fastify.get('/providers', async (request, reply) => {
    const providers = [
      { id: 'HABANERO', name: 'Habanero', games_count: 5, categories: [51, 53] },
      { id: 'NETENT', name: 'NetEnt', games_count: 5, categories: [52, 53] },
      { id: 'MICROGAMING', name: 'Microgaming', games_count: 3, categories: [51, 52] },
      { id: 'PLAYTECH', name: 'Playtech', games_count: 2, categories: [53] }
    ];
    
    return {
      success: true,
      data: providers,
      total: providers.length
    };
  });
  
  // GET /categories - Tüm kategorileri listele
  fastify.get('/categories', async (request, reply) => {
    const categories = [
      { id: 51, name: 'Slots', description: 'Slot machine games' },
      { id: 52, name: 'Video Slots', description: 'Video slot games' },
      { id: 53, name: 'Table Games', description: 'Card and table games' },
      { id: 54, name: 'Live Casino', description: 'Live dealer games' }
    ];
    
    return {
      success: true,
      data: categories,
      total: categories.length
    };
  });
  
  // GET /users - Tüm kullanıcıları listele
  fastify.get('/users', async (request, reply) => {
    try {
      const { limit = 10, offset = 0 } = request.query;
      
      const users = await User.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
      
      const total = await User.count();
      
      return {
        success: true,
        data: users,
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });
  
  // GET /users/:id - Belirli bir kullanıcıyı getir
  fastify.get('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const user = await User.findByPk(parseInt(id));
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
          user_id: id
        });
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });
  
  // GET /users/username/:username - Kullanıcı adına göre kullanıcı getir
  fastify.get('/users/username/:username', async (request, reply) => {
    try {
      const { username } = request.params;
      
      const user = await User.findOne({
        where: { user_name: username }
      });
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
          username: username
        });
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });
  
  // GET /transactions - Tüm işlemleri listele
  fastify.get('/transactions', async (request, reply) => {
    try {
      const { limit = 10, offset = 0, player_id, type } = request.query;
      
      const whereClause = {};
      if (player_id) whereClause.user_id = parseInt(player_id);
      if (type) whereClause.status = type;
      
      const transactions = await Transaction.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'currency']
        }]
      });
      
      const total = await Transaction.count({ where: whereClause });
      
      return {
        success: true,
        data: transactions,
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        filters: { player_id, type }
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });
  
  // GET /health - Sistem durumu
  fastify.get('/health', async (request, reply) => {
    return {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    };
  });
  
  // GET /stats - İstatistikler
  fastify.get('/stats', async (request, reply) => {
    return {
      success: true,
      data: {
        total_users: 5,
        active_users: 4,
        total_games: 10,
        total_providers: 4,
        total_transactions: 4,
        total_balance: 3550,
        currencies: ['EUR', 'USD']
      }
    };
  });

  // GET /users/:id/balance - Kullanıcı bakiyesi
  fastify.get('/users/:id/balance', async (request, reply) => {
    const { id } = request.params;
    
    const users = [
      { id: 1, username: 'hasan', balance: 1000, currency: 'EUR' },
      { id: 2, username: 'ali', balance: 500, currency: 'USD' },
      { id: 3, username: 'mehmet', balance: 750, currency: 'EUR' }
    ];
    
    const user = users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return reply.code(404).send({
        success: false,
        error: 'User not found',
        user_id: id
      });
    }
    
    return {
      success: true,
      data: {
        user_id: user.id,
        username: user.username,
        balance: user.balance,
        currency: user.currency
      }
    };
  });

  // GET /play - Oyun başlatma
  fastify.get('/play', async (request, reply) => {
    const { game_id, user_id, currency = 'USD', language = 'en' } = request.query;
    
    if (!game_id || !user_id) {
      return reply.code(400).send({
        success: false,
        error: 'Missing required parameters: game_id and user_id are required'
      });
    }
    
    // Mock oyun verisi
    const games = [
      { id: 4601, name: 'Hot Hot Fruit', provider: 'HABANERO', category: 51 },
      { id: 1021, name: 'Book of Ra', provider: 'HABANERO', category: 51 }
    ];
    
    const game = games.find(g => g.id === parseInt(game_id));
    
    if (!game) {
      return reply.code(404).send({
        success: false,
        error: 'Game not found',
        game_id: game_id
      });
    }
    
    return {
      success: true,
      data: {
        game_id: parseInt(game_id),
        game_name: game.name,
        provider: game.provider,
        user_id: parseInt(user_id),
        currency: currency,
        language: language,
        game_url: `https://games.example.com/play/${game_id}?user=${user_id}&currency=${currency}&lang=${language}`,
        session_id: `session_${Date.now()}_${user_id}`,
        status: 'ready'
      }
    };
  });

  // GET /sessions/:id - Kullanıcı session'ları
  fastify.get('/sessions/:id', async (request, reply) => {
    const { id } = request.params;
    
    // Mock session verisi
    const sessions = [
      { id: 1, user_id: parseInt(id), game_id: 4601, session_id: 'session_001', status: 'active', created_at: '2024-01-01T10:00:00Z' },
      { id: 2, user_id: parseInt(id), game_id: 1021, session_id: 'session_002', status: 'completed', created_at: '2024-01-01T11:00:00Z' },
      { id: 3, user_id: parseInt(id), game_id: 4601, session_id: 'session_003', status: 'active', created_at: '2024-01-01T12:00:00Z' }
    ];
    
    return {
      success: true,
      data: sessions,
      total: sessions.length,
      user_id: parseInt(id)
    };
  });

  // GET /transactions/count - Transaction sayısı
  fastify.get('/transactions/count', async (request, reply) => {
    const { player_id, type, status } = request.query;
    
    const transactions = [
      { id: 1, player_id: 1, type: 'withdraw', status: 'completed' },
      { id: 2, player_id: 1, type: 'deposit', status: 'completed' },
      { id: 3, player_id: 2, type: 'withdraw', status: 'completed' },
      { id: 4, player_id: 1, type: 'rollback', status: 'completed' }
    ];
    
    let filteredTransactions = transactions;
    
    if (player_id) {
      filteredTransactions = filteredTransactions.filter(t => t.player_id === parseInt(player_id));
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }
    
    return {
      success: true,
      data: {
        count: filteredTransactions.length,
        filters: { player_id, type, status }
      }
    };
  });

  // GET /transactions/:id - ID'ye göre transaction
  fastify.get('/transactions/:id', async (request, reply) => {
    const { id } = request.params;
    
    const transactions = [
      { id: 1, player_id: 1, type: 'withdraw', amount: 5, balance_after: 995, status: 'completed', transaction_id: 'txn_001', created_at: '2024-01-01T10:00:00Z' },
      { id: 2, player_id: 1, type: 'deposit', amount: 10, balance_after: 1005, status: 'completed', transaction_id: 'txn_002', created_at: '2024-01-01T11:00:00Z' },
      { id: 3, player_id: 2, type: 'withdraw', amount: 3, balance_after: 497, status: 'completed', transaction_id: 'txn_003', created_at: '2024-01-01T12:00:00Z' }
    ];
    
    const transaction = transactions.find(t => t.id === parseInt(id));
    
    if (!transaction) {
      return reply.code(404).send({
        success: false,
        error: 'Transaction not found',
        transaction_id: id
      });
    }
    
    return {
      success: true,
      data: transaction
    };
  });

  // GET /transactions/transaction/:transaction_id - Transaction ID'ye göre
  fastify.get('/transactions/transaction/:transaction_id', async (request, reply) => {
    const { transaction_id } = request.params;
    
    const transactions = [
      { id: 1, player_id: 1, type: 'withdraw', amount: 5, balance_after: 995, status: 'completed', transaction_id: 'txn_001', created_at: '2024-01-01T10:00:00Z' },
      { id: 2, player_id: 1, type: 'deposit', amount: 10, balance_after: 1005, status: 'completed', transaction_id: 'txn_002', created_at: '2024-01-01T11:00:00Z' },
      { id: 3, player_id: 2, type: 'withdraw', amount: 3, balance_after: 497, status: 'completed', transaction_id: 'txn_003', created_at: '2024-01-01T12:00:00Z' }
    ];
    
    const transaction = transactions.find(t => t.transaction_id === transaction_id);
    
    if (!transaction) {
      return reply.code(404).send({
        success: false,
        error: 'Transaction not found',
        transaction_id: transaction_id
      });
    }
    
    return {
      success: true,
      data: transaction
    };
  });

  // GET /transactions/user/:id - Kullanıcıya göre transaction'lar
  fastify.get('/transactions/user/:id', async (request, reply) => {
    const { id } = request.params;
    const { limit = 10, offset = 0, type } = request.query;
    
    const transactions = [
      { id: 1, player_id: parseInt(id), type: 'withdraw', amount: 5, balance_after: 995, status: 'completed', transaction_id: 'txn_001', created_at: '2024-01-01T10:00:00Z' },
      { id: 2, player_id: parseInt(id), type: 'deposit', amount: 10, balance_after: 1005, status: 'completed', transaction_id: 'txn_002', created_at: '2024-01-01T11:00:00Z' },
      { id: 4, player_id: parseInt(id), type: 'rollback', amount: 5, balance_after: 1000, status: 'completed', transaction_id: 'txn_004', created_at: '2024-01-01T13:00:00Z' }
    ];
    
    let filteredTransactions = transactions;
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    const limitedTransactions = filteredTransactions.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    return {
      success: true,
      data: limitedTransactions,
      total: filteredTransactions.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      user_id: parseInt(id),
      filters: { type }
    };
  });

  // GET /transactions/user/:id/winnings - Kullanıcının toplam kazancı
  fastify.get('/transactions/user/:id/winnings', async (request, reply) => {
    const { id } = request.params;
    
    const transactions = [
      { player_id: parseInt(id), type: 'deposit', amount: 10, created_at: '2024-01-01T11:00:00Z' },
      { player_id: parseInt(id), type: 'deposit', amount: 25, created_at: '2024-01-01T12:00:00Z' },
      { player_id: parseInt(id), type: 'deposit', amount: 15, created_at: '2024-01-01T13:00:00Z' }
    ];
    
    const userTransactions = transactions.filter(t => t.player_id === parseInt(id) && t.type === 'deposit');
    const totalWinnings = userTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      success: true,
      data: {
        user_id: parseInt(id),
        total_winnings: totalWinnings,
        total_deposits: userTransactions.length,
        currency: 'USD',
        transactions: userTransactions
      }
    };
  });

  // POST /users - Yeni kullanıcı oluştur
  fastify.post('/users', async (request, reply) => {
    try {
      const { user_name, user_data, currency, language, exit_url } = request.body;
      
      if (!user_name || !user_data) {
        return reply.code(400).send({
          success: false,
          error: 'Missing required fields: user_name and user_data are required'
        });
      }
      
      // Kullanıcı adı benzersizlik kontrolü
      const existingUser = await User.findOne({
        where: { user_name: user_name }
      });
      
      if (existingUser) {
        return reply.code(409).send({
          success: false,
          error: 'User already exists',
          username: user_name
        });
      }
      
      const newUser = await User.create({
        user_name: user_name,
        user_data: user_data,
        currency: currency || 'USD',
        language: language || 'en',
        exit_url: exit_url || 'https://example.com/exit'
      });
      
      return {
        success: true,
        message: 'User created successfully',
        data: newUser
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });

  // POST /transactions - Yeni transaction oluştur
  fastify.post('/transactions', async (request, reply) => {
    try {
      const { transaction_id, round_id, user_id, currency, bet_info, win_amount, bet_amount, status } = request.body;
      
      if (!transaction_id || !user_id || !currency) {
        return reply.code(400).send({
          success: false,
          error: 'Missing required fields: transaction_id, user_id, and currency are required'
        });
      }
      
      // Kullanıcı var mı kontrol et
      const user = await User.findByPk(parseInt(user_id));
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
          user_id: user_id
        });
      }
      
      // Transaction ID benzersizlik kontrolü
      const existingTransaction = await Transaction.findOne({
        where: { transaction_id: transaction_id }
      });
      
      if (existingTransaction) {
        return reply.code(409).send({
          success: false,
          error: 'Transaction already exists',
          transaction_id: transaction_id
        });
      }
      
      const newTransaction = await Transaction.create({
        transaction_id: transaction_id,
        round_id: round_id || `round_${Date.now()}`,
        user_id: parseInt(user_id),
        currency: currency,
        bet_info: bet_info || {},
        win_amount: win_amount || 0,
        bet_amount: bet_amount || 0,
        status: status || 'completed'
      });
      
      return {
        success: true,
        message: 'Transaction created successfully',
        data: newTransaction
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Database error',
        message: error.message
      });
    }
  });
}

module.exports = gameRoutes;
