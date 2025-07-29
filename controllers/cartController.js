import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

// Asocierile necesare
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

CartItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });


export const createCart = async (req, res) => {
  console.log('Body received:', req.body);
  const { user_id } = req.body; // ID-ul utilizatorului care cere crearea co?ului
  if (!user_id) {
    return res.status(400).json({ error: 'Trebuie sa furnizezi un user_id.' });
  }

  try {
    // Verificam daca utilizatorul are deja un co?
    const existingCart = await Cart.findOne({ where: { user_id } });

    if (existingCart) {
      return res.status(200).json({ message: 'Co?ul a fost gasit.', cart: existingCart });
    }

    // Daca nu exista, cream unul nou
    const newCart = await Cart.create({ user_id });

    res.status(201).json({
      message: 'Co?ul de cumparaturi a fost creat cu succes!',
      cart: newCart,
    });
  } catch (error) {
    console.error('Eroare la crearea co?ului:', error);
    res.status(500).json({ error: 'A aparut o eroare la crearea co?ului.' });
  }
};

export const addProductToCart = async (req, res) => {
  const { user_id, product_id, cantitate } = req.body;

  if (!user_id || !product_id || !cantitate || cantitate <= 0) {
    return res.status(400).json({ error: 'Date invalide. Asigura-te ca ai trimis user_id, product_id ?i cantitatea corecta.' });
  }

  try {
    // Verificam daca utilizatorul are un co?
    const cart = await Cart.findOne({
    where: { user_id },
    include: {
      model: CartItem,
      include: [Product],  // Verifica daca includerea se face corect
    },
  })

    if (!cart) {
      return res.status(404).json({ error: 'Co?ul nu a fost gasit.' });
    }

    // Verificam daca produsul exista deja în co?
    const existingItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id } });

    if (existingItem) {
      // Daca produsul exista, actualizam cantitatea
      existingItem.cantitate += cantitate;
      await existingItem.save();
      return res.status(200).json({ message: 'Cantitatea produsului a fost actualizata.', item: existingItem });
    }

    // Daca produsul nu exista în co?, îl adaugam
    const newItem = await CartItem.create({
      cart_id: cart.id,
      product_id,
      cantitate,
    });

    res.status(201).json({
      message: 'Produsul a fost adaugat în co? cu succes!',
      item: newItem,
    });
  } catch (error) {
    console.error('Eroare la adaugarea produsului în co?:', error);
    res.status(500).json({ error: 'A aparut o eroare la adaugarea produsului în co?.' });
  }
};

export const getCart = async (req, res) => {
  const { user_id } = req.query;  // Citim din query în loc de body pentru GET

  if (!user_id) {
    return res.status(400).json({ error: 'user_id este obligatoriu.' });
  }

  try {
    // Cautam co?ul utilizatorului cu toate informa?iile necesare
    let cart = await Cart.findOne({
      where: { user_id },
      include: [{
        model: CartItem,
        include: [{
          model: Product,
          attributes: ['id', 'nume', 'pret', 'detalii', 'imagine', 'cantitate']
        }]
      }]
    });

    // Daca co?ul nu exista, îl cream
    if (!cart) {
      console.log('Co?ul nu exista, îl cream...');
      cart = await Cart.create({ user_id });
      
      return res.status(200).json({
        message: 'Co?ul a fost creat.',
        cart: {
          id: cart.id,
          user_id: cart.user_id,
          CartItems: [],
          totalPrice: 0
        }
      });
    }

    // Calculam pre?ul total al co?ului
    let totalPrice = 0;
    if (cart.CartItems && Array.isArray(cart.CartItems)) {
      cart.CartItems.forEach(item => {
        if (item.Product) {
          totalPrice += item.cantitate * parseFloat(item.Product.pret);
        }
      });
    }

    // Formatam raspunsul pentru a include toate informa?iile necesare
    const formattedCart = {
      id: cart.id,
      user_id: cart.user_id,
      CartItems: cart.CartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        cantitate: item.cantitate,
        Product: item.Product ? {
          id: item.Product.id,
          nume: item.Product.nume,
          pret: item.Product.pret,
          detalii: item.Product.detalii,
          imagine: item.Product.imagine,
          cantitate: item.Product.cantitate
        } : null
      })),
      totalPrice
    };

    res.status(200).json({
      message: 'Co?ul a fost gasit.',
      cart: formattedCart
    });
  } catch (error) {
    console.error('Eroare la vizualizarea co?ului:', error);
    res.status(500).json({ error: 'A aparut o eroare la vizualizarea co?ului.' });
  }
};

export const finalizeOrder = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Cautam co?ul utilizatorului
    const cart = await Cart.findOne({
      where: { user_id },
      include: {
        model: CartItem,
        include: [Product],
      },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Co?ul nu a fost gasit.' });
    }

    // Calculam pre?ul total al comenzii
    let totalPrice = 0;
    cart.CartItems.forEach(item => {
      totalPrice += item.cantitate * item.Product.dataValues.pret;
    });

    // Cream comanda (Order)
    const order = await Order.create({
      user_id,
      pret_total: totalPrice,
    });

    // Transferam produsele din co? în comanda
    for (const item of cart.CartItems) {
      // Cream OrderItem pentru fiecare produs din co?
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        cantitate: item.cantitate,
        pret: item.Product.dataValues.pret * item.cantitate,
      });

      // Actualizam cantitatea produsului din tabelul store
      await Product.update(
        {
          cantitate: item.Product.dataValues.cantitate - item.cantitate,  // Scadem cantitatea din stoc
        },
        {
          where: { id: item.product_id },
        }
      );
    }

    // Golem co?ul utilizatorului
    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.status(200).json({ message: 'Comanda a fost plasata cu succes!', order });
  } catch (error) {
    console.error('Eroare la finalizarea comenzii:', error);
    res.status(500).json({ error: 'A aparut o eroare la finalizarea comenzii.' });
  }
};

export const scoateProdusDinCos = async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'Trebuie sa furnizezi user_id ?i product_id.' });
  }

  try {
    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) {
      return res.status(404).json({ error: 'Co?ul nu a fost gasit.' });
    }

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Produsul nu a fost gasit în co?.' });
    }

    await item.destroy();

    res.status(200).json({ message: 'Produsul a fost eliminat din co?.' });
  } catch (error) {
    console.error('Eroare la eliminarea produsului din co?:', error);
    res.status(500).json({ error: 'A aparut o eroare la eliminarea produsului din co?.' });
  }
};

export const modificaCantitateProdusInCos = async (req, res) => {
  const { user_id, product_id, cantitate } = req.body;

  if (!user_id || !product_id || cantitate === undefined || cantitate < 1) {
    return res.status(400).json({ error: 'Date invalide. Trebuie sa furnizezi user_id, product_id ?i o cantitate valida (> 0).' });
  }

  try {
    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) {
      return res.status(404).json({ error: 'Co?ul nu a fost gasit.' });
    }

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Produsul nu a fost gasit în co?.' });
    }

    item.cantitate = cantitate;
    await item.save();

    res.status(200).json({ message: 'Cantitatea a fost actualizata.', item });
  } catch (error) {
    console.error('Eroare la actualizarea cantita?ii produsului:', error);
    res.status(500).json({ error: 'A aparut o eroare la actualizarea cantita?ii.' });
  }
};

