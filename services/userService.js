const User = require('../models/User');

class UserService {
  // Kullanıcı ID'sine göre getir
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı adına göre getir
  async getUserByUsername(username) {
    try {
      const user = await User.findOne({
        where: { user_name: username }
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Tüm kullanıcıları getir
  async getAllUsers() {
    try {
      return await User.findAll({
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      throw error;
    }
  }

  // Yeni kullanıcı oluştur
  async createUser(userData) {
    try {
      const newUser = await User.create({
        user_name: userData.user_name,
        user_data: {
          balance: userData.balance || 1000,
          ...userData.user_data
        },
        player_token: userData.player_token,
        currency: userData.currency || 'USD',
        exit_url: userData.exit_url || 'https://your-casino.com/exit',
        language: userData.language || 'en'
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı bakiyesini güncelle
  async updateUserBalance(userId, newBalance) {
    try {
      const user = await this.getUserById(userId);
      
      user.user_data = {
        ...user.user_data,
        balance: newBalance
      };
      
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı bilgilerini güncelle
  async updateUser(userId, updateData) {
    try {
      const user = await this.getUserById(userId);
      
      if (updateData.user_name) user.user_name = updateData.user_name;
      if (updateData.player_token) user.player_token = updateData.player_token;
      if (updateData.currency) user.currency = updateData.currency;
      if (updateData.exit_url) user.exit_url = updateData.exit_url;
      if (updateData.language) user.language = updateData.language;
      
      if (updateData.user_data) {
        user.user_data = {
          ...user.user_data,
          ...updateData.user_data
        };
      }
      
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı sil
  async deleteUser(userId) {
    try {
      const user = await this.getUserById(userId);
      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı bakiyesi getir
  async getUserBalance(userId) {
    try {
      const user = await this.getUserById(userId);
      return {
        user_id: userId,
        user_name: user.user_name,
        balance: user.user_data.balance || 0,
        currency: user.currency
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();


