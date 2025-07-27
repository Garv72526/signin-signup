const mongoose = require("mongoose")
const Schema = mongoose.Schema//schema-what will be the structure of the data which reaches the database
const ObjectId = mongoose.ObjectId

const user = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String
})


const todo = new Schema({
    title: String,
    done: Boolean,
    userId: ObjectId
})

const UserModel = mongoose.model("user_collection", user)//In which collection should data be stored along with schema
const TodoModel = mongoose.model("todos_collection", todo)//In which collection should data be stored along with schema

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
}//exporting the model so we can use it in another place