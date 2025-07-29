import Serviciu from '../models/Serviciu.js';

export const creareServiciu = async (req, res) => {
  const { nume, pret, detalii, imagine, categorie } = req.body;

  if (!nume || pret == null || pret < 0) {
    return res.status(400).json({ error: 'Numele È™i preÈ›ul serviciului sunt obligatorii È™i valide.' });
  }

  try {
    const serviciu = await Serviciu.create({ nume, pret, detalii, imagine , categorie });
    res.status(201).json({ message: 'Serviciu creat cu succes.', serviciu });
  } catch (error) {
    console.error('Eroare la crearea serviciului:', error);
    res.status(500).json({ error: 'Eroare internÄƒ.' });
  }
};

export const modificaServiciu = async (req, res) => {
  const { id } = req.params;
  const { nume, pret, detalii , imagine , categorie } = req.body;

  if (!nume && pret == null && !detalii && !imagine) {
    return res.status(400).json({ error: 'FurnizeazÄƒ cel puÈ›in un cÃ¢mp pentru actualizare.' });
  }

  try {
    const serviciu = await Serviciu.findByPk(id);
    if (!serviciu) {
      return res.status(404).json({ error: 'Serviciul nu a fost gÄƒsit.' });
    }

    if (nume) serviciu.nume = nume;
    if (pret != null) serviciu.pret = pret;
    if (detalii) serviciu.detalii = detalii;
    if (imagine) serviciu.imagine = imagine;
    if (categorie) serviciu.categorie = categorie;

    await serviciu.save();
    res.status(200).json({ message: 'Serviciu actualizat.', serviciu });
  } catch (error) {
    console.error('Eroare la modificare serviciu:', error);
    res.status(500).json({ error: 'Eroare internÄƒ.' });
  }
};

export const stergeServiciu = async (req, res) => {
  const { id } = req.params;

  try {
    const serviciu = await Serviciu.findByPk(id);
    if (!serviciu) {
      return res.status(404).json({ error: 'Serviciul nu a fost gÄƒsit.' });
    }

    await serviciu.destroy();
    res.status(200).json({ message: 'Serviciu È™ters cu succes.' });
  } catch (error) {
    console.error('Eroare la È™tergere serviciu:', error);
    res.status(500).json({ error: 'Eroare internÄƒ.' });
  }
};

export const getServicii = async (req, res) => {
  try {
    const servicii = await Serviciu.findAll();  // Preia toate serviciile din DB
    res.status(200).json(servicii);
  } catch (error) {
    console.error('Eroare la preluarea serviciilor:', error);
    res.status(500).json({ error: 'Eroare la obÈ›inerea serviciilor.' });
  }
};

export const getServiciuById = async (req, res) => {
  const { id } = req.params;

  try {
    const serviciu = await Serviciu.findByPk(id);

    if (!serviciu) {
      return res.status(404).json({ error: 'Serviciul nu a fost gÄƒsit.' });
    }

    res.status(200).json(serviciu);
  } catch (error) {
    console.error('Eroare la preluarea serviciului:', error);
    res.status(500).json({ error: 'Eroare la obÈ›inerea serviciului.' });
  }
};
