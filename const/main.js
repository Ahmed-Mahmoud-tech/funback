const FRONT_URL =
  process.env.ENV_STATUS == "stage" ? "http://localhost:8081" : "funapp:/"

// const fs = require("fs")
// const path = require("path")
// const fileName = "example.txt"
// const filePath = path.join(__dirname, fileName)
// fs.writeFile(
//   filePath,
//   process.env.ENV_STATUS +
//     "      " +
//     (process.env.ENV_STATUS == "production").toString(),
//   (err) => {
//     if (err) {
//       console.error("Error writing file:", err)
//     } else {
//       console.log(
//         `File "${fileName}" has been created successfully in the same directory.`
//       )
//     }
//   }
// )

const BACKEND_URL =
  process.env.ENV_STATUS == "stage"
    ? "http://localhost:5000"
    : "https://virtualscene.tech"

module.exports = { FRONT_URL, BACKEND_URL }
