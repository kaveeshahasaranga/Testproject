const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const recreateAdmin = async () => {
    try {
        console.log('Connecting to DB:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'admin@hostel.com';
        const password = 'password123';

        // 1. Delete existing admin
        const deleted = await User.deleteOne({ email });
        console.log(`Deleted existing admin: ${deleted.deletedCount}`);

        // 2. Create new admin
        const admin = await User.create({
            name: 'System Admin',
            itNumber: 'ADMIN002', // Changed to ensure uniqueness if ADMIN001 is stuck
            email: email,
            password: password,
            role: 'admin'
        });

        console.log('Admin user recreated successfully.');
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);
        console.log('Password Hash:', admin.password); // Should look like a bcrypt hash

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

recreateAdmin();
