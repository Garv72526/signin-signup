const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "secret"
const { z } = require("zod")//library that is used for checking input validation
const { UserModel, TodoModel } = require("./db")//this line is same as below
const { default: mongoose } = require("mongoose")
// const db = require("./db");
// const UserModel = db.UserModel;
// const TodoModel = db.TodoModel;

//now we can use these models    to directly insert into database
mongoose.connect("mongodb+srv://perfectbros46:garv72526@cluster0.ntagipr.mongodb.net/todo-garv")
const app = express()
app.use(express.json())
app.post("/signup", async function (req, res) {

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        name: z.string().min(3).max(20)
    })//we define how the request body should look like with the types other than this throw an error
    //now parse and check for error
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);//safe parse tells true or false

    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return
    }


    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    let errorThrown = false
    try {
        const hashedPassword = await bcrypt.hash(password, 5)
        console.log(hashedPassword)

        await UserModel.create({ //as we are using external so it will return a promise
            email: email,
            password: password,
            name: name
        })
    }
    catch (e) {
        res.json({
            message: "user already exists"
        })
        errorThrown = true;
    }
    if (!errorThrown) {
        res.json({
            message: "you are in"
        })
    }
})
app.post("/signin", async function (req, res) {
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email: email,
    })

    if (!user) {
        res.json({
            mesage: "user does not exist"
        })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)//compare original with hashed password

    if (user && passwordMatch) {
        console.log(user._id.toString())
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET)
        res.json({
            token: token
        })
    }
    else {
        res.json({
            message: "Incorrect"
        })
    }

})
app.post("/todo", auth, function (req, res) {
    const userId = req.userId
    const title = req.body.title
    TodoModel.create({
        title,
        userId
    })

    res.json({
        userId: userId
    })
})
app.get("/todos", auth, async function (req, res) {
    const userId = req.userId
    const users = await TodoModel.find({
        userId: userId
    })
    res.json({
        userId: userId
    })

})


function auth(req, res, next) {
    const token = req.headers.token
    const decodedData = jwt.verify(token, JWT_SECRET)

    if (decodedData) {
        req.userId = decodedData.id
        next()
    }
    else {
        res.json({
            message: "Incorrect creds"
        })
    }
}

app.listen(3000)