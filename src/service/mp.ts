import { Request, Response } from "express";

export const MercadoPagoWebhook = async (req: Request, res: Response) => {
  try {
    const { action, type, data } = req.body;

    console.log("📩 Webhook recebido do Mercado Pago:");
    console.log("Action:", action);
    console.log("Type:", type);
    console.log("Data:", data);

    // Exemplo: Se o tipo for pagamento aprovado
    if (type === "payment") {
      const paymentId = data.id;

      // Aqui você pode consultar o pagamento e ativar o plano do cliente
      // await processPayment(paymentId);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Erro no Webhook:", error);
    res.status(500).send("Erro interno");
  }
};
