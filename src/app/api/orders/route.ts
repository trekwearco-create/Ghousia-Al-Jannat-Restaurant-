import { NextResponse } from "next/server";
import { createOrder, type CartLine, type OrderType, type PaymentMethod } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();
    const orderType = body.orderType as OrderType;
    const paymentMethod = body.paymentMethod as PaymentMethod;
    const items = body.items as CartLine[];

    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }
    if (!/^03\d{9}$/.test(customerPhone.replace(/[-\s]/g, "").replace(/^(\+92)/, "0"))) {
      const digits = customerPhone.replace(/\D/g, "");
      const pk = digits.startsWith("92") ? "0" + digits.slice(2) : digits;
      if (!/^03\d{9}$/.test(pk)) {
        return NextResponse.json({ error: "Enter a valid Pakistani mobile number." }, { status: 400 });
      }
    }
    if (orderType !== "pickup" && orderType !== "delivery") {
      return NextResponse.json({ error: "Choose pickup or delivery." }, { status: 400 });
    }
    if (orderType === "delivery" && !String(body.customerAddress || "").trim()) {
      return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
    }
    if (!["COD", "EasyPaisa", "JazzCash"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const phone = customerPhone.replace(/\D/g, "");
    const formatted = phone.startsWith("92") ? "0" + phone.slice(2) : phone;

    const order = await createOrder({
      customerName,
      customerPhone: formatted,
      customerAddress: String(body.customerAddress || "").trim(),
      orderType,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
      txnId: body.txnId ? String(body.txnId) : undefined,
      items,
      totalAmount,
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Could not place order." }, { status: 500 });
  }
}
