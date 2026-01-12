require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const SPOONACULAR_BASE = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Recipe Finder API is running" });
});

// ---------------- SEARCH ----------------
app.get("/recipes/search", async (req, res) => {
  try {
    const { query, number = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "query parameter is required" });
    }

    const response = await axios.get(
      `${SPOONACULAR_BASE}/recipes/complexSearch`,
      {
        params: { apiKey: API_KEY, query, number }
      }
    );

    const simplified = response.data.results.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image
    }));

    res.json(simplified);
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// ---------------- RECIPE BY ID ----------------
app.get("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `${SPOONACULAR_BASE}/recipes/${id}/information`,
      {
        params: { apiKey: API_KEY }
      }
    );

    const data = response.data;

    res.json({
      id: data.id,
      title: data.title,
      image: data.image,
      ingredients: data.extendedIngredients.map(i => i.original),
      instructions: data.instructions
    });
  } catch {
    res.status(404).json({ error: "Recipe not found" });
  }
});

// ---------------- RANDOM ----------------
app.get("/recipes/random", async (req, res) => {
  try {
    const { tags } = req.query;

    const response = await axios.get(
      `${SPOONACULAR_BASE}/recipes/random`,
      {
        params: { apiKey: API_KEY, tags, number: 1 }
      }
    );

    res.json(response.data.recipes[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch random recipe" });
  }
});

// ---------------- INGREDIENT SEARCH ----------------
app.get("/recipes/ingredients", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const response = await axios.get(
      `${SPOONACULAR_BASE}/food/ingredients/search`,
      {
        params: { apiKey: API_KEY, query, number: 10 }
      }
    );

    res.json(response.data.results);
  } catch {
    res.status(500).json({ error: "Ingredient search failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
