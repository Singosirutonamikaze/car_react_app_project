import type { CreateOrderResponse, Order } from "../../types/order";
import { API_CONFIG, API_PATHS } from "../../utils/constants";

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  return data as T;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ORDERS.GET_ALL}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la recuperation des commandes");
    }

    const result = await parseJsonSafe<{ success?: boolean; data?: Order[] } | Order[]>(response);

    if (Array.isArray(result)) {
      return result;
    }

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  },

  async getOrderById(orderId: string): Promise<Order> {
    const orders = await this.getAllOrders();
    const match = orders.find((order) => order._id === orderId);
    if (!match) {
      throw new Error("Commande introuvable");
    }
    return match;
  },

  async createOrder(payload: Order): Promise<CreateOrderResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ORDERS.CREATE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la creation de la commande");
    }

    const result = await parseJsonSafe<CreateOrderResponse | Order>(response);

    if (result && typeof result === "object" && "data" in result) {
      return result;
    }

    return { data: result as Order };
  },

  async updateOrder(orderId: string, payload: Partial<Order>): Promise<Order> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ORDERS.UPDATE(orderId)}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la mise a jour de la commande");
    }

    const result = await parseJsonSafe<{ data?: Order } | Order>(response);
    return "data" in result && result.data ? result.data : (result as Order);
  },

  async deleteOrder(orderId: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ORDERS.DELETE(orderId)}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la suppression de la commande");
    }
  },
};

export default orderService;
