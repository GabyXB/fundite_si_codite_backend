import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';


/**
 * Funcția pentru adăugarea unui produs într-o comandă existentă
 */
export const adaugaProdus = async (req, res) => {
    const { id } = req.params;  // ID-ul comenzii
    const { produs_id, cantitate } = req.body;  // Detalii produs adăugat

    if (!produs_id || cantitate <= 0) {
        return res.status(400).json({ error: 'Produsul și cantitatea trebuie să fie valide.' });
    }

    try {
        // Căutăm produsul
        const produs = await Product.findByPk(produs_id);
        if (!produs) {
            return res.status(404).json({ error: `Produsul cu ID ${produs_id} nu a fost găsit.` });
        }

        // Căutăm comanda
        const comanda = await Order.findByPk(id);
        if (!comanda) {
            return res.status(404).json({ error: `Comanda cu ID ${id} nu a fost găsită.` });
        }

        // Verificăm dacă produsul deja există în comandă
        const produsInComanda = await OrderItem.findOne({ where: { order_id: id, product_id: produs_id } });
        if (produsInComanda) {
            return res.status(400).json({ error: `Produsul cu ID ${produs_id} este deja în comandă.` });
        }

        // Adăugăm produsul în comandă
        const produsAdaugat = await OrderItem.create({
            order_id: id,
            product_id: produs_id,
            cantitate: cantitate,
            pret: produs.pret * cantitate,
        });

        // Răspuns de succes
        res.status(201).json({ message: 'Produsul a fost adăugat în comandă.', produsAdaugat });
    } catch (error) {
        console.error('Eroare la adăugarea produsului:', error);
        res.status(500).json({ error: 'A apărut o eroare la adăugarea produsului.' });
    }
};

/**
 * Funcția pentru modificarea cantității unui produs într-o comandă existentă
 */
export const modificaCantitateProdus = async (req, res) => {
  const { id, produs_id } = req.params;  // id = ID-ul comenzii, produs_id = ID-ul produsului
  const { cantitate } = req.body;         // noua cantitate

  if (cantitate <= 0) {
    return res.status(400).json({ error: 'Cantitatea trebuie să fie mai mare decât 0.' });
  }

  try {
    // Găsim produsul în comandă
    const produsInComanda = await OrderItem.findOne({ where: { order_id: id, product_id: produs_id } });
    if (!produsInComanda) {
      return res.status(404).json({ error: `Produsul cu ID ${produs_id} nu este în comandă.` });
    }

    // Găsim produsul din tabelul de produse
    const produs = await Product.findByPk(produs_id);
    if (!produs) {
      return res.status(404).json({ error: `Produsul cu ID ${produs_id} nu a fost găsit.` });
    }

    // Calculăm diferența de cantitate
    const oldCantitate = produsInComanda.cantitate;
    const newCantitate = cantitate;
    const difference = newCantitate - oldCantitate; // dacă este pozitiv, creștem cantitatea în comandă și scădem din stoc

    // Dacă diferența este pozitivă, asigură-te că stocul este suficient
    if (difference > 0 && produs.cantitate < difference) {
      return res.status(400).json({ error: 'Stoc insuficient pentru a crește cantitatea.' });
    }

    // Actualizează stocul: scade sau adaugă diferența (dacă diferența este negativă, scăderea va adăuga efectiv la stoc)
    await Product.update(
      { cantitate: produs.cantitate - difference },
      { where: { id: produs_id } }
    );

    // Calculăm noul preț pentru produsul din comandă
    const pretFinal = produs.pret * newCantitate;

    // Actualizăm OrderItem cu noua cantitate și preț
    await produsInComanda.update({
      cantitate: newCantitate,
      pret: pretFinal,
    });

    res.status(200).json({
      message: 'Cantitatea produsului a fost modificată.',
      produsInComanda,
    });
  } catch (error) {
    console.error('Eroare la modificarea cantității produsului:', error);
    res.status(500).json({ error: 'A apărut o eroare la modificarea cantității.' });
  }
};


/**
 * Funcția pentru ștergerea unui produs dintr-o comandă
 */
export const stergeProdus = async (req, res) => {
  const { id, produs_id } = req.params;  // id = ID-ul comenzii, produs_id = ID-ul produsului

  try {
    // Găsim produsul din comandă
    const produsInComanda = await OrderItem.findOne({ where: { order_id: id, product_id: produs_id } });
    if (!produsInComanda) {
      return res.status(404).json({ error: `Produsul cu ID ${produs_id} nu este în comandă.` });
    }

    // Găsim produsul din tabelul de produse
    const produs = await Product.findByPk(produs_id);
    if (!produs) {
      return res.status(404).json({ error: `Produsul cu ID ${produs_id} nu a fost găsit.` });
    }

    // Restabilim stocul: adăugăm cantitatea produsului șters înapoi la stoc
    await Product.update(
      { cantitate: produs.cantitate + produsInComanda.cantitate },
      { where: { id: produs_id } }
    );

    // Ștergem produsul din comandă
    await produsInComanda.destroy();

    res.status(200).json({ message: 'Produsul a fost șters din comandă.' });
  } catch (error) {
    console.error('Eroare la ștergerea produsului din comandă:', error);
    res.status(500).json({ error: 'A apărut o eroare la ștergerea produsului.' });
  }
};


/**
 * Funcția pentru ștergerea unei comenzi
 */
export const stergeComanda = async (req, res) => {
  const { id } = req.params;  // ID-ul comenzii

  try {
    // Găsim toate produsele din comandă
    const produseComanda = await OrderItem.findAll({ where: { order_id: id } });

    // Restabilim stocul fiecărui produs din comandă
    for (const produsComanda of produseComanda) {
      const produs = await Product.findByPk(produsComanda.product_id);
      if (produs) {
        await Product.update(
          { cantitate: produs.cantitate + produsComanda.cantitate },
          { where: { id: produsComanda.product_id } }
        );
      }
    }

    // Ștergem toate înregistrările din OrderItem pentru această comandă
    await OrderItem.destroy({ where: { order_id: id } });

    // Ștergem comanda
    const comandaStearsa = await Order.destroy({ where: { id } });
    if (!comandaStearsa) {
      return res.status(404).json({ message: 'Comanda nu a fost găsită.' });
    }

    res.status(200).json({ message: 'Comanda și produsele au fost șterse cu succes.' });
  } catch (error) {
    console.error('Eroare la ștergerea comenzii:', error);
    res.status(500).json({ message: 'A apărut o eroare la ștergerea comenzii.' });
  }
};