import grpc
from concurrent import futures
import time
import product_pb2
import product_pb2_grpc

class ProductService(product_pb2_grpc.ProductServiceServicer):

    def GetProduct(self, request, context):
        return product_pb2.ProductResponse(
            id=request.id, 
            name="Produto " + request.id,
            description="Descrição detalhada do produto " + request.id
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    product_pb2_grpc.add_ProductServiceServicer_to_server(ProductService(), server)
    print("Servidor gRPC rodando na porta 50051...")
    server.add_insecure_port('[::]:50051')
    server.start()
    
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
