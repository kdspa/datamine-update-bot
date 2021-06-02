import { Document, Model, model, Schema } from 'mongoose';

interface ICommit extends Document {
    id:         number;
    buildNumber: string;
    title:       string;
    description: string;
    url:         string;
    images:      Array<string>;
    user: {
        username:    string
        id:          number;
        avatarURL:   string;
        url:         string;
    }
    comments:    Array<string>
    timestamp:   string;
};

const CommitSchema = new Schema({
    _id:         { type: Number, required: true },
    buildNumber: { type: String, required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    url:         { type: String, required: true },
    images:      { type: Array, required: false },
    user:        { 
        username:    { type: String, required: true }, 
        id:          { type: Number, required: true },
        avatarURL:   { type: String, required: true },
        url:         { type: String, required: true } 
    },
    comments:    { type: Array },
    timestamp:   { type: String, required: true },
});

const Commit: Model<ICommit> = model("Commits", CommitSchema);

export = Commit