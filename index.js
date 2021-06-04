var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var mongoose = require("mongoose");
const {url} = require("./config.json");

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true 
})
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number,
  published: String
})
const bookModel = mongoose.model("books", bookSchema);
/*
const example = bookModel({
  title: "Hello world",
  description: "Hello world",
  rating: 10,
  published: "test"
})
example.save()
*/
var schema = buildSchema(`
type Book {
  title: String,
  description: String,
  rating: Int,
  published: String
}
type Query {
  rollDice(numDice: Int!, numSides: Int): Int,
  findBook(title: String!): Book,
  enterBook(title: String!, description: String!, rating: Int!, published: String): Boolean
}

`);
 var root = {
  rollDice: ({numDice, numSides}) => {
    return 10 + numDice + numSides;
  },
  findBook: async ({title}) => {
   var book = await bookModel.findOne({
     title: title
   }).lean()
   var res = {
     title: book.title,
     description: book.title,
     published: book.published,
     rating: book.rating
   }
   return res
  },
  enterBook: ({title, description, rating, published}) => {
var book = new bookModel({
  title: title,
  description: description, 
  rating: rating,
  published: published
})
book.save().then(() => {
return true
}).catch(err => {
  return false;
})


  }
};
 
var app = express();
app.get("/", (req, res) => {
  res.send("/graphql for explorer")
})
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');