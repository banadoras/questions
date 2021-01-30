require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const multer = require("multer")
const upload = multer({
    dest: "./public/uploads"
})

const createQdoc = require("./doc")

const fs = require("fs")
const createCsvWriter = require("csv-writer").createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: './public/files/Qbank.csv',
    header: [{
            id: 'id',
            title: 'ID'
        },
        {
            id: 'stem',
            title: 'Name'
        },
        {
            id: 'option1',
            title: 'Option 1'
        },
        {
            id: 'option2',
            title: 'Option 2'
        },
        {
            id: 'option3',
            title: 'Option 3'
        },
        {
            id: 'option4',
            title: 'Option 4'
        },
        {
            id: 'correct',
            title: 'Correct Answer'
        },
        {
            id: 'explanation',
            title: 'Explanation'
        },
        {
            id: 'author',
            title: 'Author'
        },
    ]
})

const uri = "mongodb+srv://banadoras:" + process.env.PASSWORD + "@cluster0.bocrh.mongodb.net/" + "ppp" + "?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    error ? console.log(error) : console.log("Connected to database")
})
const questionSchema = mongoose.Schema({
    stem: String,
    options: Array,
    correct: Number,
    explanation: String,
    media: Object,
    author: String
})
questionSchema.plugin(mongoosePaginate)
const Question = mongoose.model("Question", questionSchema)

app.use(express.static("public"))
app.set("view engine", "ejs")

app.get("/",(req,res)=>{
    res.render("intro")
})

app.get("/home", (req, res) => {
    res.render("home", {
        result: "",link:"",state:"none"
    })
})

app.post("/question", upload.single("media"), (req, res) => {
    const newQuestion = new Question({
        stem: req.body.stem,
        options: [req.body.option1, req.body.option2, req.body.option3, req.body.option4],
        correct: Number.parseInt(req.body.correct),
        explanation: req.body.explanation,
        media: req.file,
        author: req.body.author
    })
    
    newQuestion.save(error => {
        if (!error) {
            const filePath = createQdoc(newQuestion)
            res.render("home", {
                result: "Question submitted",
                link:filePath,
                state:"block"
            })
        } else {
            res.render("home", {
                result: "Invalid form",
                link:"",
                state:"none"
            })
        }
    })
})

app.get("/qbank", (req, res) => {
     Question.paginate({},{page:1,limit:5}, (error, result) => {
        if (!error) {
            res.render("qbank", {
                questions: result,
                searching:"all"
            })
        } else {
            res.render("home", {
                result: "Cannot populate Q-Bank"
            })
        }
    })
})


app.get("/qbank/:page_number", (req, res) => {
    Question.paginate({},{page:req.params.page_number,limit:5}, (error, result) => {
        if (!error) {
            res.render("qbank", {
                questions: result,
                searching:"all"
            })
        } else {
            res.render("home", {
                result: "Cannot populate Q-Bank"
            })
        }
    })
})

app.get("/:author/:page_number", (req, res) => {
    Question.paginate({author:req.params.author},{page:req.params.page_number,limit:5}, (error, result) => {
        if (!error) {
            res.render("qbank", {
                questions: result,
                searching:"author"
            })
        } else {
            res.render("home", {
                result: "Cannot populate Q-Bank"
            })
        }
    })
})




app.post("/export", (req, res) => {
    const list = Question.find({}, (error, questions) => {
        if (!error) {
            var finalList = []
            questions.forEach(question => {
                const q = {
                    id: question._id,
                    stem: question.stem,
                    option1: question.options[0],
                    option2: question.options[1],
                    option3: question.options[2],
                    option4: question.options[3],
                    correct: question.correct,
                    explanation: question.explanation,
                    author: question.author
                }
                finalList.push(q)
                csvWriter
                    .writeRecords(finalList)
                    .then(() => {
                        res.download("./public/files/Qbank.csv", (error) => {
                            if (!error) {
                                console.log("file downloaded")
                            } else {
                                console.log("Error during download")
                            }
                        })
                    });
            })

        } else {
            res.redirect("/qbank")
        }
    })
})



app.post("/doc",upload.none(),(req,res)=>{
    console.log(req.body.link)
    res.download(req.body.link,error=>{
        if(!error){
            console.log("Doc downloaded")
        }else{
            console.log("Could not download")
        }
    })
})

app.post("/filterAuthor",upload.none(),(req,res)=>{
   


    Question.paginate({author:req.body.author},{page:1,limit:5}, (error, result) => {
        if (!error) {
            res.render("qbank", {
                questions: result,
                searching:"author"
            })
        } else {
            res.render("home", {
                result: "Cannot populate Q-Bank"
            })
        }
    })


})


app.listen(process.env.PORT || 3000, () => {
    console.log("Listening to PORT 3000")
})