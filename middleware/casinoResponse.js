// Casino API response helper fonksiyonları

function sendCasinoResponse(reply, data) {
  const responseJson = JSON.stringify(data);
  
  reply.raw.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseJson),
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'close',
    'Server': 'Casino-API/1.0',
    'User-Agent': 'Casino-API-Server',
    'X-Casino-API': 'MatGaming'
  });
  
  reply.raw.write(responseJson);
  reply.raw.end();
}

function sendCasinoError(reply, errorCode, errorMessage, statusCode = 400) {
  const errorResponse = {
    result: false,
    err_code: errorCode,
    err_desc: errorMessage
  };
  
  const responseJson = JSON.stringify(errorResponse);
  
  reply.raw.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseJson),
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'close',
    'Server': 'Casino-API/1.0',
    'User-Agent': 'Casino-API-Server',
    'X-Casino-API': 'MatGaming'
  });
  
  reply.raw.write(responseJson);
  reply.raw.end();
}

module.exports = {
  sendCasinoResponse,
  sendCasinoError
};

