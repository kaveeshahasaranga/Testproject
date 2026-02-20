const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const bcrypt = require('bcryptjs');

dotenv.config();:

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // 1. Create Rooms
        const rooms = [
            {
                roomNumber: '101',
                type: 'Double',
                capacity: 2,
                pricePerSemester: 50000,
                facilities: ['Attached Bathroom', 'Ceiling Fan', 'Study Table']
            },
            {
                roomNumber: '102',
                type: 'Single',
                capacity: 1,
                pricePerSemester: 80000,
                facilities: ['AC', 'Attached Bathroom', 'Balcony', 'Mini Fridge']
            },
            {
                roomNumber: '103',
                type: 'Dorm',
                capacity: 4,
                pricePerSemester: 20000,
                facilities: ['Common Bathroom', 'Lockers']
            }
        ];

        // Upsert rooms to avoid duplicates if run multiple times
        const createdRooms = [];
        for (const room of rooms) {
            let r = await Room.findOne({ roomNumber: room.roomNumber });
            if (!r) {
                r = await Room.create(room);
                console.log(`Room ${room.roomNumber} created.`);
            } else {
                console.log(`Room ${room.roomNumber} already exists.`);
            }
            createdRooms.push(r);
        }

        // 2. Create Admin User
        const adminData = {
            name: 'System Admin',
            itNumber: 'ADMIN001',
            email: 'admin@hostel.com',
            password: 'password123',
            role: 'admin'
        };

        let admin = await User.findOne({ email: adminData.email });
        if (!admin) {
            // Password hashing is handled by pre-save hook in User model
            admin = await User.create(adminData);
            console.log('Admin User created: admin@hostel.com / password123');
        } else {
            console.log('Admin User already exists.');
        }

        // 3. Assign a User to Room 101 (if any user exists)
        // Find the most recently created student
        const student = await User.findOne({ role: 'student' }).sort({ createdAt: -1 });

        if (student) {
            console.log(`Found student: ${student.name} (${student.email})`);
            const roomToAssign = createdRooms[0]; // Room 101

            // Assign room to student
            student.room = roomToAssign._id;
            await student.save();

            // Add student to room occupants if not already there
            if (!roomToAssign.occupants.includes(student._id)) {
                roomToAssign.occupants.push(student._id);
                await roomToAssign.save();
            }

            console.log(`Assigned ${student.name} to Room ${roomToAssign.roomNumber}`);
        } else {
            console.log('No student users found to assign. Register a user first via the app!');
        }

        console.log('Seeding Completed!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
