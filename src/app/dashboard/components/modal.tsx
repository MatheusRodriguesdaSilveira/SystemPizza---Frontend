import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/components/hooks/use-toast";

import { OrderProps } from "@/lib/order.type";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Modal() {
  const router = useRouter();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getCookie("login");
        if (!token) return;

        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedOrders = response.data || [];

        // Verifica se existem pedidos após a página ser recarregada
        if (fetchedOrders.length > 0) {
          toast({
            title: "Sucesso!",
            description: "Página atualizada com os pedidos existentes.",
          });
        }

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Erro ao buscar pedidos", error);
      }
    };

    fetchOrders();
  }, [router, toast]); // Adiciona o toast como dependência

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const token = getCookie("login");
      if (!token) return;

      const response = await api.get(`/orders/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { order_id: orderId },
      });

      setOrderDetails(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido", error);
    }
  };

  const fetchFinishOrder = async (orderId: string) => {
    const data = {
      order_id: orderId,
    };

    try {
      const token = getCookie("login");
      if (!token) return;

      await api.put(`/orders/finish`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Pedido Finalizado",
        description: `O pedido da mesa ${selectedOrder?.table} foi finalizado com sucesso.`,
      });

      // Atualiza o estado localmente com o pedido finalizado
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: true } : order
        )
      );

      // Chamada à API para buscar pedidos atualizados
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data || []); // Atualiza o estado com a lista de pedidos
    } catch (error) {
      console.error("Erro ao finalizar pedido", error);
    }
  };

  const handleOrderClick = (order: OrderProps): void => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setIsDialogOpen(true);
  };

  const calculateOrderTotal = (orderItems: any[]) => {
    if (!orderItems || orderItems.length === 0) {
      return 0; // Retorna 0 se não houver pedidos
    }

    return orderItems.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div>
        {orders.map((order) => (
          <DialogTrigger asChild key={order.id}>
            <button
              className="flex mb-5 items-center border-0 rounded-2xl text-lg text-white bg-zinc-900 mx-3 w-full"
              onClick={() => handleOrderClick(order)}
            >
              <div className="w-4 h-16 bg-blue-800 rounded-l-xl" />
              <span className="mx-5">Mesa {order.table}</span>
            </button>
          </DialogTrigger>
        ))}
      </div>
      <DialogContent className="sm:max-w-[425px] text-white">
        <DialogHeader>
          <DialogTitle>Detalhes do pedido:</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex-col flex text-zinc-300">
          <span className="text-xl">Nome: {selectedOrder?.name}</span>
          <span className="text-xl underline underline-offset-4">
            {selectedOrder ? `Mesa: ${selectedOrder.table}` : ""}
          </span>
        </DialogDescription>
        {orderDetails && (
          <div className="flex flex-col gap-2 m-3">
            {orderDetails.items.map((item: any, index: number) => (
              <div key={item.id} className="flex flex-col ">
                <img
                  src={item.product.banner}
                  width={120}
                  height={120}
                  alt={item.product.name}
                />
                <span className="decoration-blue-600 underline underline-offset-4">
                  {item.product.name} - {index + 1}
                </span>
                <div className="flex flex-col py-1 text-sm">
                  <span className=""> {item.product.description}</span>
                  <span className=""> Quantidade: {item.amount}</span>
                  <span className=""> Preço: R$ {item.product.price}</span>
                </div>
              </div>
            ))}
            <span className="m-2 text-green-400 decoration-green-600 underline underline-offset-4">
              Total: R${calculateOrderTotal(orderDetails.items || [])}
            </span>
          </div>
        )}
        <DialogFooter>
          <Button
            className="text-white bg-blue-600 hover:bg-blue-900"
            type="button"
            onClick={async () => {
              if (selectedOrder?.id) {
                await fetchFinishOrder(selectedOrder.id);
                setIsDialogOpen(false);
              } else {
                console.error("Nenhum pedido selecionado");
              }
            }}
          >
            Finalizar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
