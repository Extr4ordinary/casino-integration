const { User, Transaction } = require('../models');
const sequelize = require('../db');

class TransactionService {
  // Tüm transaction'ları getir
  async getAllTransactions() {
    try {
      const transactions = await Transaction.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'currency']
        }],
        order: [['id', 'ASC']]
      });
      return transactions;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // ID'ye göre transaction getir
  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'currency']
        }]
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Transaction ID'ye göre getir (duplicate kontrolü için)
  async getTransactionByTransactionId(transactionId) {
    try {
      const transaction = await Transaction.findOne({
        where: { transaction_id: transactionId }
      });
      return transaction; // null dönebilir, hata fırlatmaz
    } catch (error) {
      console.log('Transaction lookup error:', error.message);
      return null;
    }
  }

  // Kullanıcıya göre transaction'ları getir
  async getTransactionsByUserId(userId) {
    try {
      const transactions = await Transaction.findAll({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'currency']
        }],
        order: [['id', 'ASC']]
      });
      return transactions;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Yeni transaction oluştur
  async createTransaction(transactionData) {
    try {
      const transaction = await Transaction.create(transactionData);
      return transaction;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Transaction durumunu güncelle
  async updateTransactionStatus(transactionId, status) {
    try {
      const transaction = await Transaction.findOne({
        where: { transaction_id: transactionId }
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      await transaction.update({ status });
      return transaction;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Transaction'ı güncelle
  async updateTransaction(transactionId, updateData) {
    try {
      const transaction = await Transaction.findOne({
        where: { transaction_id: transactionId }
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      await transaction.update(updateData);
      return transaction;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Transaction sayısını getir
  async getTransactionCount() {
    try {
      const count = await Transaction.count();
      return count;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Round ID'ye göre transaction getir (tip belirtilebilir)
  async getTransactionByRoundId(roundId, type = null) {
    try {
      const whereClause = { round_id: roundId };
      if (type) {
        whereClause.type = type;
      }
      
      const transaction = await Transaction.findOne({ 
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['user_name']
        }]
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }

  // Kullanıcının toplam kazancını getir
  async getUserTotalWinnings(userId) {
    try {
      const result = await Transaction.findOne({
        where: { 
          user_id: userId,
          status: 'completed'
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('win_amount')), 'total_winnings'],
          [sequelize.fn('SUM', sequelize.col('bet_amount')), 'total_bets']
        ],
        raw: true
      });
      
      return {
        total_winnings: parseFloat(result.total_winnings) || 0,
        total_bets: parseFloat(result.total_bets) || 0,
        net_profit: (parseFloat(result.total_winnings) || 0) - (parseFloat(result.total_bets) || 0)
      };
    } catch (error) {
      throw new Error(`Transaction service error: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();
