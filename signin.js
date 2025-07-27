const express = require("express")
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret_key";
const app = express();
app.use(express.json())
const users = []
//in a real signup/signin in the system sends a token that is used to remember the user

// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e',
//         'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
//         'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
//         'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C',
//         'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
//         'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
//         'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
//         '0', '1', '2', '3', '4', '5', '6',
//         '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

//replace the token by jsonwebtoken
//JWT = secure token that carries useful info (and can verify itself).
//Random token = just a random key — server has to do all the work match everytime with data base.

app.get("/", (req, res) => {//localhost:3000 this is done so that front /back end are hosted by the same host 
    res.sendFile(__dirname + "/signin.html")
})//dirname- contains ip



function logger(req, res, next) {
    console.log(req.method + "request came");
    next();
}


app.post("/signup", logger, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "you have signed up"
    })
})


app.post("/signin", logger, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //during sign in check if the user name and password are matching or not in the users list
    let founduser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            founduser = users[i];
        }
    }
    if (founduser) {
        const token = jwt.sign({//.sign creates a token
            username: username//the data you want to store in the token encrypt username in token.
        }, JWT_SECRET);//This is your secret key used to digitally sign the token so no one can fake it.
        //no need to save this token alog side username and pass as this token has all the information
        res.json({
            token: token
        })
    }
    else {
        res.status(403).send({
            message: "Invalid username or password"

        })
    }
})
//seperate middle ware for verification
function auth(req, res, next) {
    const token = req.headers.token//keeps token seperate from main body
    const decodedData = jwt.verify(token, JWT_SECRET)//decode using .verify
    if (decodedData.username) {
        //create new key at req object req={headers,status..username}
        req.username = decodedData.username;
        next()
    }
    else {
        res.json({
            message: "You are not logged in"
        })
    }
}


app.get("/me", auth, (req, res) => {

    const currentUser = req.username
    let founduser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == currentUser) {
            founduser = users[i]
        }
    }
    if (founduser) {
        res.json({
            username: founduser.username,
            password: founduser.password
        })
    }
    else {
        res.json({
            message: "invalid token "
        })
    }


})

app.listen(3000)