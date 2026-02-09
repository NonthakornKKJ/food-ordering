import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Menu from './models/Menu.js';
import Table from './models/Table.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Menu.deleteMany({});
        await Table.deleteMany({});
        console.log('Cleared existing data');

        // Create Admin user
        const admin = await User.create({
            username: 'admin',
            password: '123456',
            role: 'admin'
        });
        console.log('Created admin user:', admin.username);

        // Create Kitchen user
        const kitchen = await User.create({
            username: 'kitchen',
            password: '123456',
            role: 'kitchen'
        });
        console.log('Created kitchen user:', kitchen.username);

        // Create Customer user
        const customer = await User.create({
            username: 'customer',
            password: '123456',
            role: 'customer'
        });
        console.log('Created customer user:', customer.username);

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'ข้าว', description: 'เมนูข้าวหลากหลาย' },
            { name: 'เมนูเส้น', description: 'ก๋วยเตี๋ยว ผัดไทย และอื่นๆ' },
            { name: 'เครื่องดื่ม', description: 'น้ำดื่ม ชา กาแฟ' },
            { name: 'ของหวาน', description: 'ขนมหวานและของหวาน' }
        ]);
        console.log('Created categories:', categories.map(c => c.name).join(', '));

        // Create Menus
        const menus = await Menu.insertMany([
            // ข้าว
            { name: 'ข้าวผัดหมู', description: 'ข้าวผัดหมูใส่ไข่ พร้อมผักสด', price: 60, category: categories[0]._id },
            { name: 'ข้าวกระเพราหมูสับ', description: 'ข้าวกระเพราหมูสับไข่ดาว', price: 55, category: categories[0]._id },
            { name: 'ข้าวหมูกรอบ', description: 'ข้าวหมูกรอบราดซอส', price: 65, category: categories[0]._id },
            { name: 'ข้าวไข่เจียว', description: 'ข้าวไข่เจียวหมูสับ', price: 50, category: categories[0]._id },
            // เมนูเส้น
            { name: 'ผัดไทยกุ้งสด', description: 'ผัดไทยกุ้งสด ใส่ถั่วงอก กุ้ยช่าย', price: 80, category: categories[1]._id },
            { name: 'ก๋วยเตี๋ยวต้มยำ', description: 'ก๋วยเตี๋ยวต้มยำหมูสับ', price: 55, category: categories[1]._id },
            { name: 'บะหมี่แห้งหมูแดง', description: 'บะหมี่แห้งหมูแดง ลูกชิ้นปลา', price: 50, category: categories[1]._id },
            // เครื่องดื่ม
            { name: 'ชาเย็น', description: 'ชาเย็นหวานหอม', price: 25, category: categories[2]._id },
            { name: 'กาแฟเย็น', description: 'กาแฟเย็นสูตรพิเศษ', price: 35, category: categories[2]._id },
            { name: 'น้ำส้มคั้น', description: 'น้ำส้มคั้นสด 100%', price: 40, category: categories[2]._id },
            // ของหวาน
            { name: 'ไอศกรีมกะทิ', description: 'ไอศกรีมกะทิหอมมัน', price: 30, category: categories[3]._id },
            { name: 'ลอดช่องสิงคโปร์', description: 'ลอดช่องหวานเย็น', price: 35, category: categories[3]._id }
        ]);
        console.log('Created menus:', menus.length, 'items');

        // Create Tables with QR codes
        const tables = await Table.insertMany([
            { tableNumber: 1, qrCode: 'TABLE_QR_001' },
            { tableNumber: 2, qrCode: 'TABLE_QR_002' },
            { tableNumber: 3, qrCode: 'TABLE_QR_003' },
            { tableNumber: 4, qrCode: 'TABLE_QR_004' },
            { tableNumber: 5, qrCode: 'TABLE_QR_005' },
            { tableNumber: 6, qrCode: 'TABLE_QR_006' },
            { tableNumber: 7, qrCode: 'TABLE_QR_007' },
            { tableNumber: 8, qrCode: 'TABLE_QR_008' },
            { tableNumber: 9, qrCode: 'TABLE_QR_009' },
            { tableNumber: 10, qrCode: 'TABLE_QR_010' }
        ]);
        console.log('Created tables:', tables.length);

        console.log('\n========== SEED COMPLETED ==========');
        console.log('Admin Login: username="admin", password="123456"');
        console.log('Kitchen Login: username="kitchen", password="123456"');
        console.log('Customer Login: username="customer", password="123456"');
        console.log('QR Login: Use qrCode="TABLE_QR_001" through "TABLE_QR_010"');
        console.log('=====================================\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
