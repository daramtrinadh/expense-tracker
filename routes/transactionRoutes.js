const express=require('express')
const router=express.Router()
const Transaction=require('../models/transaction')

// Posting Transaction
router.post('/transactions',async(req,res)=>{
    try{
        const {type,category,amount,date,description}=req.body
        const newTransaction=new Transaction({type,category,amount,date,description});
        await newTransaction.save()
        res.status(201).json(newTransaction);
    }catch(errror){
        res.status(400).json({error:`${error}`})
    }
})

// Retrieving all transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
});

// Retrieving a single transaction by ID
router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch transaction' });
  }
});

// Updating a transaction by ID
router.put('/transactions/:id', async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount, date, description },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data or transaction ID' });
  }
});

// Deleting a transaction by ID
router.delete('/transactions/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete transaction' });
  }
});

// Summary of transactions
router.get('/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate summary' });
  }
});

module.exports = router;