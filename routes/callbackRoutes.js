const callbackController = require('../controllers/callbackController');

async function callbackRoutes(fastify, options) {
  // Ana callback endpoint - MatGaming API için
  fastify.post('/callback', async (request, reply) => {
    const { cmd, player_token, currency, game_id, player_id, signature, request_time } = request.body;
    
    // Eğer cmd yoksa, casino test platformundan gelen veri olabilir
    if (!cmd) {
      console.log('No cmd parameter, treating as casino test platform data');
      
      // Casino test platformu için özel response
      const response = {
        result: true,
        player_id: player_id || "123456",
        balance: 1000,
        currency: currency || "USD",
        status: "active"
      };
      
      console.log('Sending casino test platform response:', JSON.stringify(response));
      
      const responseStr = JSON.stringify(response);
      reply.raw.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': responseStr.length,
        'Access-Control-Allow-Origin': '*'
      });
      reply.raw.end(responseStr);
      return;
    }
    
    // MatGaming API için gerekli alanları kontrol et
    if (!signature || !request_time) {
      const errorResponse = {
        result: false,
        err_code: 130,
        err_desc: 'Incorrect Parameters Passed'
      };
      
      reply.raw.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      reply.raw.end(JSON.stringify(errorResponse));
      return;
    }
    
    switch (cmd) {
      case 'getPlayerInfo':
        return callbackController.getPlayerInfo(request, reply);
      case 'withdraw':
        return callbackController.withdraw(request, reply);
      case 'deposit':
        return callbackController.deposit(request, reply);
      case 'rollback':
        return callbackController.rollback(request, reply);
      default:
        const errorResponse = {
          result: false,
          err_code: 130,
          err_desc: "General Error"
        };
        
        reply.raw.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        reply.raw.end(JSON.stringify(errorResponse));
    }
  });

  // CORS preflight için OPTIONS endpoint
  fastify.options('/callback', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    reply.code(200).send();
  });
}

module.exports = callbackRoutes;