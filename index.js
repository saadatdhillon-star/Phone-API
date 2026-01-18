const express = require('express');
const { parsePhoneNumber } = require('libphonenumber-js');
const app = express();

app.use(express.json());

app.get('/validate', (req, res) => {
    // 1. Get number from Voiceflow
    let input_number = req.query.number;
    
    // 2. Default to 'PK' if the user forgets the + sign (Common in Pakistan)
    // You can change 'PK' to 'US' or any other code if needed.
    let default_country = req.query.country || 'PK'; 

    if (!input_number) {
        return res.json({ validity: "invalid", reason: "empty_input" });
    }

    try {
        // 3. Parse the number
        const phoneNumber = parsePhoneNumber(input_number, default_country);

        // 4. Validate and Identify
        if (phoneNumber && phoneNumber.isValid()) {
            return res.json({
                validity: "valid",
                
                // === COUNTRY IDENTIFICATION ===
                // Returns "PK", "US", "AE", "SA", etc.
                country: phoneNumber.country, 
                
                // === FORMATTING ===
                // Returns standard international format: "+92 300 1234567"
                formatted: phoneNumber.formatInternational(),
                
                // === LINE TYPE IDENTIFICATION ===
                // Returns "MOBILE", "FIXED_LINE", "VOIP", etc.
                type: phoneNumber.getType() 
            });
        } else {
            return res.json({ validity: "invalid", reason: "format_error" });
        }

    } catch (error) {
        return res.json({ validity: "invalid", reason: "parsing_error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Phone Validator running on port ${PORT}`));