package main

import (
    "context"
    "fmt"
    "log"
    "net"
    "strconv"

    "google.golang.org/grpc"
    "google.golang.org/grpc/reflection"
    pb "module-b-go/proto"
)

type server struct {
    pb.UnimplementedProductServiceServer
}

func (s *server) GetProduct(ctx context.Context, req *pb.ProductRequest) (*pb.ProductResponse, error) {
    idNum, err := strconv.Atoi(req.GetId())
    if err != nil {
        idNum = 1
    }
    
    return &pb.ProductResponse{
        Id:    req.GetId(),
        Price: float64(idNum * 10),
        Stock: int32(idNum * 2),
    }, nil
}

func main() {
    listen, err := net.Listen("tcp", ":50052")
    if err != nil {
        log.Fatalf("Falha ao escutar: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterProductServiceServer(s, &server{})
    reflection.Register(s)

    fmt.Println("Servidor gRPC rodando na porta 50052...")
    if err := s.Serve(listen); err != nil {
        log.Fatalf("Falha ao servir: %v", err)
    }
}