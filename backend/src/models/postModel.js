import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    catagory: [
      {
        type: String,
        default: "all",
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved"],
      // default: "pending",
      default: "approved",
    },
    content: {
      type: String,
      required: true,
    },
    contentTable: [
      {
        type: String,
      },
    ],
    image: {
      type: String, // cloudinary url
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "userName",
  });
  next();
});

postSchema.plugin(mongooseAggregatePaginate);

export const Post = model("Post", postSchema);
