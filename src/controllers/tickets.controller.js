import Ticket from '../models/ticket.model.js';
import cartsModel from '../models/cart.model.js';
import productsRepository from '../repositories/productsRepository.js';

const ticketsController = {};

ticketsController.purchaseCart = async (cartId, purchaserEmail) => {
  try {
    const cart = await cartsModel.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Verificar si hay suficiente stock para los productos en el carrito
    for (const item of cart.products) {
      const product = await productsRepository.getProductById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`No hay suficiente stock para el producto: ${item.productId}`);
      }
    }

    // Crear el ticket de compra
    const totalAmount = cart.products.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const ticket = new Ticket({
      code: generateTicketCode(), // Aquí debes implementar la lógica para generar el código del ticket
      amount: totalAmount,
      purchaser: purchaserEmail,
    });

    await ticket.save();

    // Actualizar el stock de los productos
    for (const item of cart.products) {
      const product = await productsRepository.getProductById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Vaciar el carrito
    cart.products = [];
    await cart.save();

    return ticket;
  } catch (error) {
    throw new Error(`Error al procesar la compra del carrito: ${error}`);
  }
};

function generateTicketCode() {
  // Aquí puedes implementar la lógica para generar el código del ticket
  // Por ejemplo, podrías usar un paquete como 'shortid' para generar IDs únicos cortos
}

export default ticketsController;
