import config from "./config";
import app from "./types/express/app";

const port = config.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});