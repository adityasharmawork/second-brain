import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ContentModel, LinkModel, UserModel } from './db';
import dotenv from "dotenv";
import { userMiddleware } from './middleware';
import cors from "cors";

import { JWT_PASSWORD } from './config'; 
import { random } from './utils';

// const JWT_PASSWORD = process.env.JWT_PASSWORD;

const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation, hash the password
    const { username, password } = req.body;

    try {
        const newUser = await UserModel.create({
            username,
            password,
        });
    
        res.status(200).json({
            message: "User signed up!"
        });
    } catch (err) {
        res.status(411).json({
            message: "User already exists!"
        });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({
        username,
        password,
    });

    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id,
        }, JWT_PASSWORD as string);

        res.json({
            token,
        });
    } else {
        res.status(403).json({
            message: "Incorrect Credentials",
        });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { link, type, title } = req.body;
    await ContentModel.create({
        link,
        type,
        title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });

    res.json({
        message: "Content added",
    });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId,
    }).populate("userId", "username");

    if(content) {
        res.json({
            content,
        });
    } else {
        res.status(404).json({
            message: "Content not found for this user!",
        });
    }

});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const { contentId } = req.body;
    const deletedContent = await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId,
    });

    if(deletedContent) { 
        res.json({
            message: "Content deleted",
        });
    } else {
        res.status(404).json({
            message: "No content to delete!",
        });
    }
});




app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const { share } = req.body;
    if(share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId,
        });

        if(existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = random(10);
        const link = await LinkModel.create({
            userId: req.userId,
            hash: hash,
        });

        res.json({
            hash: link.hash,
        });

    } else {
        await LinkModel.deleteOne({
            userId: req.userId,
        });

        res.json({
            message: "Removed link!",
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash,
    });

    if(!link) {
        res.status(411).json({
            message: "Sorry, Incorrect URL!",
        });
        return;
    }    
     
    const content = await ContentModel.find({
        userId: link.userId,
    });
    
    const user = await UserModel.findOne({
        _id: link.userId,
    });

    if(!user) {
        res.status(411).json({
            message: "User not found! This error should have ideally not occurred.",
        });
        return;
    }

    res.json({
        username: user.username,
        content,
    });
});

app.listen(8080, () => {
    console.log("Server is listening on port: 8080");
});