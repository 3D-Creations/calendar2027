const express = require('express');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (if you need CSS/JS in a public folder later)
app.use(express.static('public'));

// Data for the 12 months
const monthsData = [
    { id: 1, name: 'January', title: 'New Beginnings', content: 'Content for January goes here...' },
    { id: 2, name: 'February', title: 'Month of Love', content: 'Content for February goes here...' },
    { id: 3, name: 'March', title: 'Spring is Coming', content: 'Content for March goes here...' },
    { id: 4, name: 'April', title: 'April Showers', content: 'Content for April goes here...' },
    { id: 5, name: 'May', title: 'May Flowers', content: 'Content for May goes here...' },
    { id: 6, name: 'June', title: 'Summer Time', content: 'Content for June goes here...' },
    { id: 7, name: 'July', title: 'Midsummer', content: 'Content for July goes here...' },
    { id: 8, name: 'August', title: 'Late Summer', content: 'Content for August goes here...' },
    { id: 9, name: 'September', title: 'Autumn Begins', content: 'Content for September goes here...' },
    { id: 10, name: 'October', title: 'Spooky Season', content: 'Content for October goes here...' },
    { id: 11, name: 'November', title: 'Giving Thanks', content: 'Content for November goes here...' },
    { id: 12, name: 'December', title: 'Festive Season', content: 'Content for December goes here...' }
];

// Home route to display calendar with QR codes
app.get('/', async (req, res) => {
    try {
        // Yaha par aap apna permanent domain daal sakte hain (jaise: https://calendar.ipca.com)
        // Ek baar ye set ho jayega, to QR codes mein yahi permanent URL embed hogi.
        const baseUrl = process.env.BASE_URL || 'https://aapka-domain.com';
        
        // Generate QR codes for each month
        const calendarWithQRs = await Promise.all(monthsData.map(async (month) => {
            const urlToEncode = `${baseUrl}/month/${month.id}`;
            const qrCodeDataUrl = await qrcode.toDataURL(urlToEncode);
            return {
                ...month,
                qrCodeUrl: qrCodeDataUrl
            };
        }));
        
        res.render('index', { months: calendarWithQRs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating calendar.');
    }
});

// Route for specific month content
app.get('/month/:id', (req, res) => {
    const monthId = parseInt(req.params.id);
    const month = monthsData.find(m => m.id === monthId);
    
    if (month) {
        res.render('month', { month: month });
    } else {
        res.status(404).send('Month not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
