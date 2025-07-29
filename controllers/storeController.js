import Store from '../models/Product.js';

export const addProduct = async (req, res) => {
  const { nume, pret, detalii, imagine, cantitate } = req.body;

  try {
    // Crearea unui nou produs în tabelul store
    const product = await Store.create({
      nume,
      pret,
      detalii,
      imagine,
      cantitate,
    });

    return res.status(201).json({
      message: 'Produs adăugat cu succes!',
      product,
    });
  } catch (error) {
    console.error('Eroare la adăugarea produsului:', error);
    return res.status(500).json({ error: 'Eroare la adăugarea produsului.' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nume, pret, detalii, imagine, cantitate } = req.body;

  try {
    // Găsește produsul
    const product = await Store.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produsul nu a fost găsit.' });
    }

    // Actualizează doar câmpurile care sunt prezente în request
    if (nume) product.nume = nume;
    if (pret != null) product.pret = pret;
    if (detalii) product.detalii = detalii;
    if (imagine) product.imagine = imagine;
    if (cantitate != null) product.cantitate = cantitate;

    await product.save();

    res.status(200).json({
      message: 'Produs actualizat cu succes.',
      product,
    });
  } catch (error) {
    console.error('Eroare la actualizarea produsului:', error);
    res.status(500).json({ error: 'Eroare internă la actualizarea produsului.' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Găsește produsul
    const product = await Store.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produsul nu a fost găsit.' });
    }

    // Șterge produsul
    await product.destroy();

    res.status(200).json({ message: 'Produsul a fost șters cu succes.' });
  } catch (error) {
    console.error('Eroare la ștergerea produsului:', error);
    res.status(500).json({ error: 'Eroare internă la ștergerea produsului.' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const produse = await Store.findAll();
    res.status(200).json(produse);
  } catch (error) {
    console.error('Eroare la preluarea produselor:', error);
    res.status(500).json({ error: 'Eroare la obținerea produselor.' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const produs = await Store.findByPk(id);
    if (!produs) return res.status(404).json({ error: 'Produsul nu a fost găsit.' });
    res.status(200).json(produs);
  } catch (error) {
    console.error('Eroare la preluarea produsului:', error);
    res.status(500).json({ error: 'Eroare internă.' });
  }
};

