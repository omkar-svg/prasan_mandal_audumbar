const { Expense } = require('../models');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { description, amount, date } = req.body;
    const newExpense = await Expense.create({ 
      description, 
      amount, 
      date: date || new Date() 
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;
    await Expense.update({ description, amount, date }, { where: { id } });
    const updatedExpense = await Expense.findByPk(id);
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id } });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
