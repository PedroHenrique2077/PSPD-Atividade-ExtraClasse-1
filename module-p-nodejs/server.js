const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const cors = require('cors');
const app = express();

function loadClient(protoPath, packageName, serviceName, address) {
  const packageDef = protoLoader.loadSync(protoPath);
  const grpcObject = grpc.loadPackageDefinition(packageDef);
  const service = grpcObject[packageName][serviceName];
  return new service(address, grpc.credentials.createInsecure());
}

// Cria cliente para o servidor A (Python) - fornece nome e descrição
const clientA = loadClient(
  './proto/product_a.proto',
  'product', // Nome do pacote no .proto
  'ProductService',
  'localhost:50051'
);

// Cria cliente para o servidor B (Go) - fornece preço e estoque
const clientB = loadClient(
  './proto/product_b.proto',
  'product', // Nome do pacote no .proto
  'ProductService',
  'localhost:50052'
);

app.use(cors());
app.use(express.json());

app.get('/products/:id', (req, res) => {
  const id = req.params.id;

  clientA.GetProduct({ id }, (errA, responseA) => {
    if (errA) return res.status(500).json({ error: 'Erro no servidor A', detail: errA.message });

    clientB.GetProduct({ id }, (errB, responseB) => {
      if (errB) return res.status(500).json({ error: 'Erro no servidor B', detail: errB.message });

      const composedResponse = {
        id: id,
        name: responseA.name,
        description: responseA.description,
        price: responseB.price,
        stock: responseB.stock
      };

      res.json(composedResponse);
    });
  });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API de Produtos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>API de Produtos</h1>
        <p>Use o endpoint <code>/products/{id}</code> para consultar informações de produtos.</p>
        <p>Exemplo: <a href="/products/123">/products/123</a></p>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Servidor HTTP rodando em http://localhost:3000');
});
