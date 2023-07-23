// Backend code (using Express.js and passport-oauth2)

// Install required packages:
// npm install express passport passport-oauth2 axios

import express from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import axios from "axios";

// Initialize Express app and passport
const app = express();
app.use(passport.initialize());

// Configuration for the Authorization Server (IFS Cloud application)

const authorizationURL =
  "https://topo-d05.build.ifsdemoworld.com/auth/realms/topod051/protocol/openid-connect/auth?scope=openid%20microprofile-jwt&client_id=IFS_aurena&state=f1df781bec31b19924bb858fd4288f32&redirect_uri=https%3A%2F%2Ftopo-d05.build.ifsdemoworld.com%2Fredirect&response_type=code&nonce=624460f85c3e2556b84d283d3a5bc945";
const tokenURL = "https://ifs-cloud-app.com/token";
const clientID = "MAKODE"; // ConnectedFactoryClient
const clientSecret = "9m6hGw4sHbCF5hlPq8FSLSWkZ5bjub"; // TGLPJBEZFW9eEPxbgue7PvfqxHCtCaMn
const callbackURL = "http://localhost:3000"; // Replace with your actual callback URL

// OAuth 2.0 strategy
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL,
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, params, profile, done) => {
      // Save the accessToken in your database or in memory
      // You can also save the refreshToken for token refresh, if needed
      // In this example, we'll simply store the access token in a variable
      const storedAccessToken = accessToken;
      return done(null, { accessToken: storedAccessToken });
    }
  )
);

// Login route to initiate OAuth 2.0 flow
app.get("/auth/login", passport.authenticate("oauth2"));

// Callback route after successful login
app.get(
  "/auth/callback",
  passport.authenticate("oauth2", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect the user to the main page or the currency conversion page
    res.redirect("/");
  }
);

// Sample route to access corporate currency rates using the stored access token
app.get("/api/currency-rates", async (req, res) => {
  // Fetch the access token from your storage or database
  const accessToken = req.user.accessToken;

  try {
    // Make an authenticated API request to the corporate currency rate API
    const response = await axios.get(
      "https://ifs-cloud-app.com/currency-rates",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Process the response and send back the data to the frontend
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching currency rates" });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
