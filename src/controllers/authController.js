import * as authRepository from '../repositories/authRepository.js';

// Register user
export const register = async (req, res) => {
    const context = { req, res };
    try {
        const data = await authRepository.register(context);
        return data;
    } catch (err) {
        console.log(err)
        return "";
    }
};

// Login user
export const login = async (req, res) => {
    const context = { req, res };
    try {
        const data = await authRepository.login(context);
        return data;
    } catch (err) {
        console.log(err)
        return "";
    }
};
