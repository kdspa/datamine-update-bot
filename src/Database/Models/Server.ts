import { Document, Model, model, Schema } from 'mongoose';

interface IGuild extends Document {
    id: string;
    prefix: string;
    channel: string;
    roleId: string;
    lastSentComment: number
}

const ServerSchema = new Schema({
  _id:             { type: String, required: true  },
  prefix:          { type: String, default: 'd.'   },
  channel:         { type: String, required: true  },
  roleid:          { type: String, required: false },
  lastSentComment: { type: Number, required: false },
});

const Server: Model<IGuild> = model("Servers", ServerSchema);

export = Server