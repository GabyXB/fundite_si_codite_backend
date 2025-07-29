import Review from '../models/Review.js';
import User from '../models/User.js';

// Creeaza recenzie
export const creeazaRecenzie = async (req, res) => {
  try {
    const { user_id, topic, text_link, stele } = req.body;
    if (!user_id || !topic || !text_link || !stele) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }
    // Validare had_appointment
    const user = await User.findByPk(user_id);
    if (!user || user.had_appointment !== 1) {
      return res.status(403).json({ error: 'Doar utilizatorii cu programare finalizată pot lăsa recenzie.' });
    }
    const review = await Review.create({ user_id, topic, text_link, stele });
    res.status(201).json({ message: 'Recenzie creată cu succes.', review });
  } catch (error) {
    console.error('Eroare la crearea recenziei:', error);
    res.status(500).json({ error: 'Eroare la crearea recenziei.' });
  }
};

// Sterge recenzie
export const stergeRecenzie = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Recenzia nu a fost gasita.' });
    }
    await review.destroy();
    res.status(200).json({ message: 'Recenzie ștearsă cu succes.' });
  } catch (error) {
    console.error('Eroare la ștergerea recenziei:', error);
    res.status(500).json({ error: 'Eroare la ștergerea recenziei.' });
  }
};

// Modifica recenzie
export const modificaRecenzie = async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, text_link, stele } = req.body;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Recenzia nu a fost gasita.' });
    }
    if (topic) review.topic = topic;
    if (text_link) review.text_link = text_link;
    if (stele) review.stele = stele;
    await review.save();
    res.status(200).json({ message: 'Recenzie modificată cu succes.', review });
  } catch (error) {
    console.error('Eroare la modificarea recenziei:', error);
    res.status(500).json({ error: 'Eroare la modificarea recenziei.' });
  }
};

// Get recenzii by user
export const getRecenzieByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const recenzii = await Review.findAll({ where: { user_id } });
    res.status(200).json(recenzii);
  } catch (error) {
    console.error('Eroare la obtinerea recenziilor:', error);
    res.status(500).json({ error: 'Eroare la obtinerea recenziilor.' });
  }
};

// Get toate recenziile
export const getRecenzii = async (req, res) => {
  try {
    const recenzii = await Review.findAll({ include: [{ model: User, as: 'user', attributes: ['name'] }] });
    res.status(200).json(recenzii);
  } catch (error) {
    console.error('Eroare la obtinerea recenziilor:', error);
    res.status(500).json({ error: 'Eroare la obtinerea recenziilor.' });
  }
}; 