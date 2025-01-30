import mongoose, { connect, Schema } from 'mongoose';

const connectDb = () => {
    mongoose.connect("mongodb://localhost:27017/brainly")
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Error connecting to MongoDB"));
}

connectDb();

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export const UserModel = mongoose.model("User", userSchema);

const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
});

export const TagModel = mongoose.model("Tag", tagSchema);

// const contentTypes = ['image', 'video', 'article', 'audio'];

const contentSchema = new Schema({
    link: {
        type: String,
        required: true,
    },
    // type: {
    //     type: String,
    //     enum: contentTypes,
    //     required: true,
    // },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

export const ContentModel = mongoose.model('Content', contentSchema);

const linkSchema = new Schema({
    hash: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
})

export const LinkModel = mongoose.model('Link', linkSchema);

