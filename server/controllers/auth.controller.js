import express from "express";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  
  const { username, email, password } = req.body;

  try {

    //hash the password
    const hpassword = await bcrypt.hash(password, 10);

    //create new user in the database
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hpassword,
        },
    });
    res.status(201).json({ message: "User Created Successfuly" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  
    const { username, password } = req.body;
    try {

        //check if user exists
        const user = await prisma.user.findUnique({where: { username }});
        if (!user) {res.status(401).json({message: "invalid credentials !"});}

        //check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) { return res.status(401).json({message: "invalid credentials !"});}

        //generate cookie token and send to user
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign({id: user.id, isAdmin: false,}, process.env.JWT_SECRET_KEY, {expiresIn: age});
        const { password: userPassword, ...userInfo } = user;

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
            //secure: true,
        }).status(200).json(userInfo);


    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }

};

export const logout = (req, res) => {

  //remove the cookie
  res.clearCookie("token").status(200).json({message: "logout done successfuly"});
};
