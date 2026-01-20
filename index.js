const express = require('express');
// CHANGE 1: We added '/max' to load the full, heavy-duty database
const { parsePhoneNumber } = require('libphonenumber-js/max');
const app = express();

app.use(express.json());

app.get('/validate', (req, res) => {
    let input_number = req.query.number;
    let default_country = req.query.country || 'PK'; 

    if (!input_number) {
        return res.json({ validity: "invalid", reason: "empty_input" });
    }

    try {
        const phoneNumber = parsePhoneNumber(input_number, default_country);

        if (phoneNumber && phoneNumber.isValid()) {
            return res.json({
                validity: "valid",
                country: phoneNumber.country,
                formatted: phoneNumber.formatInternational(),
                
                // CHANGE 2: Added defensive check. 
                // If it's undefined, it defaults to "UNKNOWN" so the key never vanishes.
                type: phoneNumber.getType() || "UNKNOWN", 
                
                national: phoneNumber.formatNational()
            });
        } else {
            return res.json({ validity: "invalid", reason: "format_error" });
        }

    } catch (error) {
        return res.json({ validity: "invalid", reason: "parsing_error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));