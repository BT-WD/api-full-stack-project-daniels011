import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("."));

const apiKey = "X55XimZWIaSPHPnBSSsv77KrJYFYjFIz24I5m0QC";

const models = [
  "camry", "civic", "mustang", "accord", "corolla",
  "altima", "charger", "fusion", "sentra", "impala",
  "prius", "rav4", "highlander", "pilot", "cr-v",
  "wrx", "outback", "forester", "legacy", "impreza",
  "f-150", "silverado", "ram", "explorer", "escape",
  "focus", "taurus", "edge", "expedition", "transit",
  "malibu", "cruze", "equinox", "traverse", "suburban",
  "cherokee", "grand cherokee", "wrangler", "compass", "renegade",
  "challenger", "durango", "journey", "pacifica", "caravan",
  "elantra", "sonata", "tucson", "santa fe", "kona",
  "optima", "sorento", "sportage", "telluride", "rio",
  "3 series", "5 series", "x3", "x5", "m3",
  "c-class", "e-class", "gla", "glc", "gle",
  "a4", "a6", "q5", "q7", "tt",
  "911", "cayenne", "macan", "panamera", "boxster",
  "model 3", "model s", "model x", "model y", "cybertruck",
  "mx-5", "cx-5", "cx-9", "mazda3", "mazda6",
  "golf", "jetta", "tiguan", "atlas", "passat",
  "camaro", "corvette", "colorado", "trailblazer", "equinox"
];

app.get("/car", async (req, res) => {
  const randomModel = models[Math.floor(Math.random() * models.length)];
  const url = `https://api.api-ninjas.com/v1/cars?model=${randomModel}`;

  try {
    console.log("Fetching from API:", url);
    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey }
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!data || data.length === 0) {
      console.log("No data found");
      return res.json({ error: "No cars found" });
    }

    // Transform transmission values for better readability
    const transformedData = data.map(car => ({
      ...car,
      transmission: car.transmission === 'a' ? 'automatic' :
                   car.transmission === 'm' ? 'manual' : car.transmission
    }));

    console.log("Sending to client:", transformedData);
    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "API request failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
