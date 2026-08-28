export type OrderType = "pickup" | "delivery";
export type PaymentMethod = "COD" | "EasyPaisa" | "JazzCash";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "Received" | "Preparing" | "Ready" | "Completed" | "Cancelled";

export type CartLine = {
  kind: "item" | "deal";
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  txnId?: string;
  orderStatus: OrderStatus;
  items: CartLine[];
  totalAmount: number;
  createdAt: string;
};
