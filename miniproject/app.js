const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const articles = [
    {
        id: 1,
        title: "Introduction to REST API",
        content: "REST APIs allow applications to communicate over HTTP."
    },
    {
        id: 2,
        title: "Getting Started with Express.js",
        content: "Express.js is a lightweight framework for building web applications and APIs."
    }
];

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.post("/articles", (req, res) => {
    const { title, content } = req.body;

    const newArticle = {
        id: articles.length + 1,
        title,
        content
    };

    articles.push(newArticle);

    res.status(201).json(newArticle);
});