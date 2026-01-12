const SPOONACULAR_BASE = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;


require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Recipe Finder API is running" });
});

app.get("/recipes/search", async (req, res) => {
  try {
    const { query, number = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "query parameter is required" });
    }

    const response = await axios.get(
      `${SPOONACULAR_BASE}/recipes/complexSearch`,
      {
        params: {
          apiKey: API_KEY,
          query,
          number
        }
      }
    );

    const simplified = response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image
    }));

    res.json(simplified);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
