import express from "express"

const app = express();

app.get("/",(req,res)=>{
    res.send("Home page bhaiii")
})

app.get("/books",(req,res)=>{
    const book=[
        {
            "id": "1",
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "publicationYear": 1925,
            "genre": "Classic",
            "rating": 4.2,
            "description": "A story of wealth, love, and tragedy in the Jazz Age.",
            "metadata": {
              "pages": 180,
              "stockLeft": 23,
              "price": 12.99,
              "discount": 0,
              "edition": 3
            }
          },
          {
            "id": "2",
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "publicationYear": 1960,
            "genre": "Fiction",
            "rating": 4.5,
            "description": "A novel about racial inequality and moral growth in the American South.",
            "metadata": {
              "pages": 336,
              "stockLeft": 45,
              "price": 14.95,
              "discount": 10,
              "edition": 5
            }
          },
          {
            "id": "3",
            "title": "1984",
            "author": "George Orwell",
            "publicationYear": 1949,
            "genre": "Dystopian",
            "rating": 4.3,
            "description": "A chilling portrayal of a totalitarian regime and the power of state surveillance.",
            "metadata": {
              "pages": 328,
              "stockLeft": 37,
              "price": 11.99,
              "discount": 5,
              "edition": 7
            }
          },
          
    ]

    res.send(book)
})

export default app
