const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'admin@hostel.com';
        const password = 'password123';

        let admin = await User.findOne({ email });

        if (admin) {
            admin.password = password; // Will be hashed by pre-save hook
            await admin.save();
            console.log(`Admin password reset to: ${password}`);
        } else {
            console.log('Admin user not found, creating...');
            await User.create({
                name: 'System Admin',
                itNumber: 'ADMIN001',
                email: email,
                password: password,
                role: 'admin'
            });
            console.log(`Admin user created with password: ${password}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
