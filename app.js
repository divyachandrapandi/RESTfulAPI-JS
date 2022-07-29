const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose =require('mongoose');

// ---------------------EXPRESS SETUP ----------------------------//

const app = express();

// ---------------------EJS SETUP ----------------------------//

app.set('view engine', 'ejs');

// ----------------------BODY PARSER SETUP ----------------------------//

app.use(bodyParser.urlencoded({extended:true}));

// ----------------------STATIC SETUP ----------------------------//

app.use(express.static("public"));


// ----------------------CONNECT TO DB ----------------------------//

mongoose.connect("mongodb://localhost:27017/wikiDB");

// ----------------------CREATE A SCHEMA ----------------------------//

const articleSchema = mongoose.Schema({
    title : String,
    content : String
})

// ----------------------CREATE A MODEL ----------------------------//
const Article = mongoose.model('Article', articleSchema);

// app.route("/articles").get().post().delete()

// ----------------------CHAINED ROUTE /articles ----------------------------//

app.route("/articles")
// ----------------------GET ALL ARTICLES----------------------------//
    .get(function(req , res){

        Article.find(function(err, foundArticles){
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    // ----------------------POST AN ARTICLE----------------------------//
    .post(function(req, res){
        console.log(req.body.title)
        console.log(req.body.content)

        const newArticle = new Article ({
            title :req.body.title,
            content : req.body.content
        });

        newArticle.save(function(err){
            if(!err){
                res.send("Succesfully added a posted articles");
            } else {
                res.send(err);
            }
        });
    })
    // ----------------------DELETE ALL ARTICLE----------------------------//
    .delete(function(req,res){

        Article.deleteMany(function(err){
            if (!err){
                res.send("deleted all articles successfully");
            } else {
                res.send(err);
            }
        });
})


// ----------------------CHAINED ROUTE A ARTICLE /:articleTitle----------------------------//

app.route("/articles/:articleTitle")
    
    // ----------------------GET A ARTICLE ----------------------------//
    .get( function(req,res){
        
        
        
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            
            res.send(foundArticle);
        } else {
            res.send("No Found Articles check the spelling");
        }
    });
})

// ----------------------PUT A ARTICLE ----------------------------//

.put(function(req ,res){
    
    Article.updateOne(
            {title: req.params.articleTitle},  // condition

            {title : req.body.title,  content : req.body.content},       // update 

            function(err){
                if (!err){
                    res.send("Successfully updates article");
                } else {
                    res.send(err);
                }
        });
    })

    // ----------------------PATCH A ARTICLE ----------------------------//
    
    .patch(function(req,res){
        
        Article.updateOne(
            
            {title: req.params.articleTitle},

            {$set : req.body},
            function(err){
                if(!err){
                    res.send("Succesfully excuted patch update an article")
                } else {
                    res.send(err);
                }
            })
        })

    // ----------------------DELETE A ARTICLE ----------------------------//

    .delete(function(req,res){

        Article.deleteOne(
            
            {title : req.params.articleTitle},   

            function(err){
                if (!err){
                    res.send("Successfully deleted the article");
                } else {
                    res.send(err);
                }
        });
    });


// ----------------------SERVER LISTENING----------------------------//


app.listen(5000, function(){
    console.log("server running on port 5000")
});


//
