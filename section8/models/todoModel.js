
import mongoose from "mongoose";

const Todo = mongoose.models.Todo || mongoose.model("Todo", {//agr todo model already exist karta hai toh usko use karo warna naya model banao. Ye isliye kiya gaya hai kyunki Next.js mein hot reloading hota hai, aur har baar code change hone par models ko redefine karne ki koshish karta hai, jo ki error throw karta hai. Is condition se hum ensure karte hain ki model sirf ek baar define ho.
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
});
//id mongodb automatically create a unique _id field for each document, so we don't need to define it in the schema. We can use this _id field as the unique identifier for our todos when we perform CRUD operations.

export default Todo;
