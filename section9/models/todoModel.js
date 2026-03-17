
import mongoose from "mongoose";

const Todo =
  mongoose.models.Todo ||
  mongoose.model("Todo", {
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
  });

export default Todo;
