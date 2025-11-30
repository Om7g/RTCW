import mongoose from "mongoose";
const canvasSchema = new mongoose.Schema({
    name:{type:mongoose.Schema.Types.String,required:true,unique:true},
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    elements: [{ type: mongoose.Schema.Types.Mixed }],
    createdAt: { type: Date, default: Date.now }
})
const Canvas = mongoose.model("Canvas", canvasSchema);
export default Canvas;


