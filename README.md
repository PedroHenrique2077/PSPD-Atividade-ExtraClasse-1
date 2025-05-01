# Sistema Distribuído de Produtos com gRPC

Este projeto implementa um sistema distribuído usando gRPC para comunicação entre diferentes serviços. O sistema é composto por três módulos:

1. **Módulo A (Python)**: Fornece informações de nome e descrição dos produtos
2. **Módulo B (Go)**: Fornece informações de preço e estoque dos produtos
3. **Módulo P (Node.js)**: API de gateway que agrega informações dos outros serviços

## Arquitetura do Sistema

```
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│   Interface    │         │  Módulo P      │         │   Módulo A     │
│   Web (HTML)   │ ───────▶│  (Node.js)     │ ───────▶│   (Python)     │
└────────────────┘         │                │         └────────────────┘
                           │  Gateway API   │
                           │                │         ┌────────────────┐
                           └────────────────┘ ───────▶│   Módulo B     │
                                                      │   (Go)         │
                                                      └────────────────┘
```

## Pré-requisitos

- Node.js v18 ou superior
- Python 3.8 ou superior
- Go 1.18 ou superior
    - Lembrar de colocar o elias no PATH do .bashrc   
- Protocol Buffers Compiler (protoc)

### Ferramentas de compilação Proto

- Go: `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`
- Go gRPC: `go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest`
- Python: `pip install grpcio-tools`
- Node.js: `npm install -g grpc-tools`
- Protobuff : `sudo apt install -y protobuf-compiler`

## Configuração do Projeto

### 1. Clone o repositório

### 2. Compilando arquivos Proto

#### Para o Módulo A (Python):

```bash
cd module-a-python
python -m grpc_tools.protoc     --python_out=.     --grpc_python_out=.     --proto_path=proto     proto/product.proto
```

#### Para o Módulo B (Go):

```bash
cd module-b-go
protoc --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       proto/product.proto
```

#### Para o Módulo P (Node.js):

```bash
cd module-p-nodejs
npm install
```

## Iniciando os Servidores

### 1. Inicie o Módulo A (Python):

```bash
cd module-a-python
# Opcional: Crie e ative um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows use: venv\Scripts\activate
pip install grpcio grpcio-tools

# Inicie o servidor
python server.py
```

### 2. Inicie o Módulo B (Go):

```bash
cd module-b-go
go mod tidy
go run main.go
```

### 3. Inicie o Módulo P (Node.js):

```bash
cd module-p-nodejs
npm install
node server.js
```

### 4. Acesse a interface web:

Abra o arquivo `index.html` no navegador.

## Testando o Sistema

1. Acesse a interface web (ou através da URL http://localhost:3000/products/{id})
2. Insira um ID de produto no formulário
3. O sistema consultará o Módulo A para obter nome e descrição
4. O sistema consultará o Módulo B para obter preço e estoque
5. O resultado combinado será exibido na interface

## Portas utilizadas

- Módulo A (Python): porta 50051
- Módulo B (Go): porta 50052
- Módulo P (Node.js/API Gateway): porta 3000

## Troubleshooting

### Erro de conexão recusada

Verifique se todos os servidores estão rodando nas portas corretas e se não há firewall bloqueando as conexões.

### Erro na compilação dos arquivos Proto

Certifique-se de que o compilador protoc está instalado e que as ferramentas específicas de cada linguagem também estão instaladas.
