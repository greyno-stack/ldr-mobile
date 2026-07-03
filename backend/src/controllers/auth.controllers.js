import prisma from "../config/prisma.js";  

export async function signup(req,res) {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

export async function login(req,res) {

};

export const logout = (req, res) => {};

export const checkAuth = (req, res) => {};

//delete user