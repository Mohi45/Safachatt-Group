import fs from "fs";

const SHEET_ID = "1xIE-pmO73D-j2SdCx6EBlprBqvxOOizR8GR1XMECz2c";
const SHEET_NAME = "Sheet1";
const OUTPUT_FILE = "products.json";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

async function run() {
    try {
        const res = await fetch(URL);
        const data = await res.json();

        fs.writeFileSync(
            OUTPUT_FILE,
            JSON.stringify(data, null, 2),
            "utf8"
        );

        console.log(`✅ Saved to ${OUTPUT_FILE}`);
    } catch (err) {
        console.error("❌ Failed:", err);
    }
}

run();
