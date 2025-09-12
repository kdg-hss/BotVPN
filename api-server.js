const express = require("express");
const app = express();
const port = 5000;

app.get("/createvmess", (req, res) => {
    res.json({
        status: "success",
        message: "Akun VMess berhasil dibuat (dummy response)"
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`API server running at http://0.0.0.0:${port}`);
});
