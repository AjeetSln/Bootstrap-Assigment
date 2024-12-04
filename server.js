const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const credentials = require('./credentials.json'); // Ensure your credentials file is here
const spreadsheetId = '1kvrO0Www99S_Gc9GiseQ_CIcW_IfsW5j-rKZWR4WsYM'; // Your Google Sheets ID

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/submit', async (req, res) => {
    const { name, email, age } = req.body;
    console.log('Received data:', { name, email, age });

    try {
        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:C', // Ensure this matches the range in your Google Sheet
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[name, email, age]],
            },
        });

        console.log('Data added to Google Sheets:', response);  // Log response from API
        res.status(200).send({ message: 'Data submitted successfully' });
    } catch (error) {
        console.error('Error submitting data:', error);  // Log error details
        res.status(500).send({ error: 'Error submitting data' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
