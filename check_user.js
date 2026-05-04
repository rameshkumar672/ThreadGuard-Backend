const mongoose = require('mongoose');
const { tgConnection } = require('./backend/config/db');
const Owner = require('./backend/models/threatguard/Owner');

async function checkRecord() {
    try {
        const email = 'rameshkk01324@gmail.com';
        const owner = await Owner.findOne({ email: email.toLowerCase().trim() });
        
        if (owner) {
            console.log('Record found:');
            console.log(JSON.stringify(owner, null, 2));
        } else {
            console.log('Record NOT found for email:', email);
        }
    } catch (err) {
        console.error('Error checking record:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
}

checkRecord();
