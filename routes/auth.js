const express = require("express")
const axios = require("axios")

const app = express()

app.get("/login", async (req, res) => {
  const { code } = req.query

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const { access_token, refresh_token } = response.data

    // Verify token
    const verifyResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    // Save user info to database
    // ...

    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send(
        JSON.stringify({ success: false, message: "Failed to authenticate" })
      )
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
