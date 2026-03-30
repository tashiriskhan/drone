import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const products = [
    // Frames
    {
        name: 'Phantom X1 Carbon',
        description: 'Professional grade carbon fiber frame with excellent rigidity and lightweight design. Perfect for aerial photography and videography.',
        price: 499,
        category: 'frames',
        subcategory: 'Carbon Fiber',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 25,
        featured: true,
        ratings: 4.8,
        numReviews: 24,
        specifications: { weight: '145g', wheelbase: '450mm', material: 'Carbon Fiber', arms: '4' }
    },
    {
        name: 'Racing Frame Pro',
        description: 'Ultra-lightweight racing frame with aerodynamic design. CNC machined aluminum components.',
        price: 179,
        category: 'frames',
        subcategory: 'Racing',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 30,
        featured: false,
        ratings: 4.5,
        numReviews: 23,
        specifications: { weight: '89g', wheelbase: '220mm', material: 'Aluminum', arms: '4' }
    },
    {
        name: 'Stealth FPV Frame',
        description: 'Stealth design with low profile body. Integrated LED mount and battery mount.',
        price: 229,
        category: 'frames',
        subcategory: 'FPV',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 18,
        featured: true,
        ratings: 4.7,
        numReviews: 15,
        specifications: { weight: '112g', wheelbase: '280mm', material: 'Carbon Fiber', arms: '4' }
    },
    {
        name: 'Mini Whoop Frame',
        description: 'Indoor micro frame for Tiny Whoop builds. Durable ducted design for safety.',
        price: 59,
        category: 'frames',
        subcategory: 'Micro',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 50,
        featured: false,
        ratings: 4.3,
        numReviews: 28,
        specifications: { weight: '32g', wheelbase: '75mm', material: 'PC Plastic', arms: '4' }
    },
    {
        name: 'Heavy Lift X8',
        description: 'Octocopter frame designed for heavy payload lifting. Supports cameras up to 5kg.',
        price: 899,
        category: 'frames',
        subcategory: 'Heavy Lift',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 12,
        featured: true,
        ratings: 4.9,
        numReviews: 8,
        specifications: { weight: '580g', wheelbase: '750mm', material: 'Carbon Fiber', arms: '8' }
    },
    // Components - Propellers
    {
        name: 'AeroGrip 5000',
        description: 'Heavy lift propellers designed for maximum thrust and efficiency. Compatible with most standard motor mounts.',
        price: 129,
        category: 'components',
        subcategory: 'Propellers',
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600',
        stock: 100,
        featured: true,
        ratings: 4.6,
        numReviews: 18,
        specifications: { size: '5 inch', pitch: '3', blades: '2', material: 'Carbon Fiber' }
    },
    {
        name: 'Silent Boost Props',
        description: 'Low noise propellers with wave-shaped blades. 30% quieter than standard props.',
        price: 89,
        category: 'components',
        subcategory: 'Propellers',
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600',
        stock: 85,
        featured: false,
        ratings: 4.5,
        numReviews: 22,
        specifications: { size: '6 inch', pitch: '4.5', blades: '3', material: 'Nylon' }
    },
    {
        name: 'RaceBlade Elite',
        description: 'High-speed racing propellers with aggressive pitch. Maximum efficiency at high RPM.',
        price: 99,
        category: 'components',
        subcategory: 'Propellers',
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600',
        stock: 120,
        featured: false,
        ratings: 4.7,
        numReviews: 35,
        specifications: { size: '5 inch', pitch: '4.5', blades: '2', material: 'Carbon Fiber' }
    },
    // Components - Gimbals
    {
        name: 'Stabilizer Pro',
        description: '3-axis gimbal system for smooth, professional-quality footage. Integrated brushless motors with advanced stabilization algorithms.',
        price: 899,
        category: 'components',
        subcategory: 'Gimbals',
        image: 'https://images.unsplash.com/photo-1559067515-bf7d799b6d4d?w=600',
        stock: 15,
        featured: true,
        ratings: 4.9,
        numReviews: 31,
        specifications: { axes: '3', payload: '450g', voltage: '12V', control: 'SBUS' }
    },
    {
        name: 'Mini Gimbal 2S',
        description: 'Compact 2-axis gimbal perfect for action cameras. Lightweight design under 80g.',
        price: 299,
        category: 'components',
        subcategory: 'Gimbals',
        image: 'https://images.unsplash.com/photo-1559067515-bf7d799b6d4d?w=600',
        stock: 28,
        featured: false,
        ratings: 4.6,
        numReviews: 19,
        specifications: { axes: '2', payload: '150g', voltage: '7.4V', control: 'PWM' }
    },
    // Components - Flight Controllers
    {
        name: 'Flight Controller V4',
        description: 'Advanced autopilot system with GPS integration, obstacle avoidance, and programmable flight modes.',
        price: 249,
        category: 'components',
        subcategory: 'Flight Controllers',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600',
        stock: 40,
        featured: true,
        ratings: 4.7,
        numReviews: 42,
        specifications: { processor: 'STM32F7', gyro: 'BMI270', barometer: 'BMP280', uarts: '5' }
    },
    {
        name: 'Racing FC Mini',
        description: 'Lightweight flight controller optimized for FPV racing. Low latency response.',
        price: 149,
        category: 'components',
        subcategory: 'Flight Controllers',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600',
        stock: 55,
        featured: false,
        ratings: 4.8,
        numReviews: 67,
        specifications: { processor: 'STM32F405', gyro: 'MPU6000', barometer: 'None', uarts: '4' }
    },
    {
        name: 'Integration Board AIO',
        description: 'All-in-one flight controller with integrated ESC. Simplifies wiring.',
        price: 189,
        category: 'components',
        subcategory: 'Flight Controllers',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600',
        stock: 35,
        featured: false,
        ratings: 4.5,
        numReviews: 29,
        specifications: { processor: 'STM32F411', gyro: 'BMI088', integratedESC: '4x20A', uarts: '3' }
    },
    // Components - Motors
    {
        name: 'Brushless Motor X2207',
        description: 'High-efficiency brushless motor with 2207 size and 1800KV rating. Perfect for racing and freestyle drones.',
        price: 89,
        category: 'components',
        subcategory: 'Motors',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 80,
        featured: false,
        ratings: 4.6,
        numReviews: 52,
        specifications: { size: '2207', kv: '1800', poles: '12', voltage: '4S' }
    },
    {
        name: 'Mini Motor 1103',
        description: 'Ultra-micro brushless motor for indoor micro drones. Whisper quiet operation.',
        price: 35,
        category: 'components',
        subcategory: 'Motors',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 150,
        featured: false,
        ratings: 4.4,
        numReviews: 41,
        specifications: { size: '1103', kv: '8000', poles: '9', voltage: '1S' }
    },
    {
        name: 'High Torque 2806',
        description: 'Heavy-lift motor designed for cinematic drones. Smooth power delivery.',
        price: 159,
        category: 'components',
        subcategory: 'Motors',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 45,
        featured: true,
        ratings: 4.8,
        numReviews: 23,
        specifications: { size: '2806', kv: '800', poles: '12', voltage: '6S' }
    },
    {
        name: 'Racing Motor 2306',
        description: 'Balanced racing motor with excellent power-to-weight ratio.',
        price: 79,
        category: 'components',
        subcategory: 'Motors',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 95,
        featured: false,
        ratings: 4.7,
        numReviews: 58,
        specifications: { size: '2306', kv: '1700', poles: '12', voltage: '4S' }
    },
    // Components - Cameras
    {
        name: 'Night Vision Cam',
        description: '4K low-light sensor camera with thermal imaging capability. Ideal for search and rescue operations.',
        price: 349,
        category: 'components',
        subcategory: 'Cameras',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 20,
        featured: true,
        ratings: 4.8,
        numReviews: 19,
        specifications: { resolution: '4K', sensor: 'Sony IMX477', fov: '120°', weight: '85g' }
    },
    {
        name: 'FPV Camera Mini',
        description: 'Lightweight FPV camera with wide dynamic range. Perfect for fpv racing.',
        price: 59,
        category: 'components',
        subcategory: 'Cameras',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 120,
        featured: false,
        ratings: 4.5,
        numReviews: 73,
        specifications: { resolution: '1200TVL', sensor: 'CMOS', fov: '160°', weight: '5g' }
    },
    {
        name: 'Action Cam 4K Pro',
        description: 'Compact action camera with 4K/60fps recording. Built-in image stabilization.',
        price: 199,
        category: 'components',
        subcategory: 'Cameras',
        image: 'https://images.unsplash.com/photo-1507581134177-2b85a9886043?w=600',
        stock: 40,
        featured: true,
        ratings: 4.6,
        numReviews: 34,
        specifications: { resolution: '4K/60fps', sensor: 'IMX317', fov: '155°', weight: '56g' }
    },
    // Components - GPS
    {
        name: 'GPS Module Advanced',
        description: 'Multi-constellation GPS module with compass integration. Supports GPS, GLONASS, and Galileo.',
        price: 149,
        category: 'components',
        subcategory: 'GPS',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600',
        stock: 45,
        featured: false,
        ratings: 4.3,
        numReviews: 17,
        specifications: { constellations: 'GPS+GLO+GAL', accuracy: '2.5m', compass: 'AK8963', voltage: '5V' }
    },
    {
        name: 'RTK GPS Module',
        description: 'High-precision RTK GPS for centimeter-level accuracy. Professional surveying grade.',
        price: 499,
        category: 'components',
        subcategory: 'GPS',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600',
        stock: 10,
        featured: false,
        ratings: 4.9,
        numReviews: 6,
        specifications: { accuracy: '2cm', updateRate: '20Hz', compass: 'Integrated', voltage: '12V' }
    },
    // Components - Batteries
    {
        name: 'Smart Battery Charger',
        description: 'Intelligent multi-bay charger with fast charging capability. Supports LiPo, Li-Ion, and LiFe batteries.',
        price: 199,
        category: 'components',
        subcategory: 'Batteries',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 35,
        featured: false,
        ratings: 4.4,
        numReviews: 28,
        specifications: { channels: '4', chargeRate: '3A', supportedTypes: 'LiPo/LiIon/LiFe', display: 'LCD' }
    },
    {
        name: 'LiPo Battery 5000mAh',
        description: 'High-capacity LiPo battery with 5000mAh and 4S configuration. Extended flight time.',
        price: 79,
        category: 'components',
        subcategory: 'Batteries',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 70,
        featured: false,
        ratings: 4.5,
        numReviews: 34,
        specifications: { capacity: '5000mAh', cells: '4S', discharge: '50C', weight: '450g' }
    },
    {
        name: 'LiPo Battery 2200mAh',
        description: 'Compact 3S battery ideal for light builds. Great balance of weight and capacity.',
        price: 45,
        category: 'components',
        subcategory: 'Batteries',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 95,
        featured: false,
        ratings: 4.6,
        numReviews: 47,
        specifications: { capacity: '2200mAh', cells: '3S', discharge: '45C', weight: '185g' }
    },
    {
        name: 'Graphene Battery 6000mAh',
        description: 'Advanced graphene battery with higher discharge rates and longer lifespan.',
        price: 129,
        category: 'components',
        subcategory: 'Batteries',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 50,
        featured: true,
        ratings: 4.8,
        numReviews: 26,
        specifications: { capacity: '6000mAh', cells: '4S', discharge: '65C', weight: '520g' }
    },
    // Components - ESC
    {
        name: 'BLHeli_32 ESC 45A',
        description: '32-bit ESC with Bluetooth programming. Silent operation and smooth throttle response.',
        price: 69,
        category: 'components',
        subcategory: 'ESC',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 60,
        featured: false,
        ratings: 4.6,
        numReviews: 38,
        specifications: { current: '45A', protocol: 'DShot600', firmware: 'BLHeli_32', voltage: '2-6S' }
    },
    {
        name: 'AIO ESC 4-in-1',
        description: 'Integrated 4x ESC board for clean builds. Plug-and-play with most flight controllers.',
        price: 119,
        category: 'components',
        subcategory: 'ESC',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 40,
        featured: false,
        ratings: 4.5,
        numReviews: 29,
        specifications: { current: '4x30A', protocol: 'DShot300', firmware: 'BLHeli_S', voltage: '2-4S' }
    },
    // Components - VTX
    {
        name: 'VTX 5.8Ghz 1W',
        description: 'High-power video transmitter with adjustable power output. Long range capability.',
        price: 79,
        category: 'components',
        subcategory: 'VTX',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 55,
        featured: false,
        ratings: 4.4,
        numReviews: 31,
        specifications: { power: '1W', frequency: '5.8GHz', channels: '48', protocol: 'Smart Audio' }
    },
    {
        name: 'Mini VTX 25mW',
        description: 'Ultra-lightweight VTX for racing. Clean setup with pit mode.',
        price: 29,
        category: 'components',
        subcategory: 'VTX',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 100,
        featured: false,
        ratings: 4.3,
        numReviews: 44,
        specifications: { power: '25mW/100mW', frequency: '5.8GHz', channels: '40', protocol: 'IRC Tramp' }
    },
    // Components - Receivers
    {
        name: 'ELRS Receiver',
        description: 'ExpressLRS long-range receiver with low latency. Up to 20km range.',
        price: 49,
        category: 'components',
        subcategory: 'Receivers',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 75,
        featured: true,
        ratings: 4.8,
        numReviews: 52,
        specifications: { protocol: 'ELRS', channels: '8', range: '20km', latency: '12ms' }
    },
    {
        name: 'FlySky Receiver',
        description: 'Reliable FlySky AFHDS receiver. Great compatibility with FlySky transmitters.',
        price: 25,
        category: 'components',
        subcategory: 'Receivers',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        stock: 90,
        featured: false,
        ratings: 4.5,
        numReviews: 63,
        specifications: { protocol: 'AFHDS', channels: '6', range: '1.5km', sensitivity: '-108dBm' }
    },
    // Tools
    {
        name: 'Precision Tool Kit',
        description: 'Complete toolkit for drone assembly and maintenance. Includes hex keys, screwdrivers, pliers, and carrying case.',
        price: 89,
        category: 'tools',
        subcategory: 'Tool Kits',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 60,
        featured: false,
        ratings: 4.5,
        numReviews: 15,
        specifications: { pieces: '32', material: 'Chrome Vanadium', case: 'Included', warranty: '1 Year' }
    },
    {
        name: 'Soldering Station Pro',
        description: 'Digital temperature controlled soldering station with fast heat-up time. Essential for electronic assembly.',
        price: 129,
        category: 'tools',
        subcategory: 'Soldering',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 25,
        featured: false,
        ratings: 4.7,
        numReviews: 11,
        specifications: { power: '60W', tempRange: '200-480°C', tip: 'B2', display: 'Digital' }
    },
    {
        name: 'Battery Safety Bag',
        description: 'Flame retardant LiPo charging bag. Prevents fire accidents during charging.',
        price: 25,
        category: 'tools',
        subcategory: 'Safety',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 80,
        featured: false,
        ratings: 4.6,
        numReviews: 24,
        specifications: { size: '200x150mm', material: 'Fiberglass', fireRating: 'UL94', closure: 'Velcro' }
    },
    {
        name: 'Digital Calipers',
        description: 'Precision digital calipers for accurate measurements. Essential for custom builds.',
        price: 45,
        category: 'tools',
        subcategory: 'Measuring',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 50,
        featured: false,
        ratings: 4.7,
        numReviews: 18,
        specifications: { range: '150mm', accuracy: '0.01mm', display: 'LCD', battery: 'SR44' }
    },
    {
        name: 'Prop Balancer',
        description: 'Dynamic propeller balancer for smooth motor operation. Reduces vibration.',
        price: 35,
        category: 'tools',
        subcategory: 'Balancing',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 40,
        featured: false,
        ratings: 4.4,
        numReviews: 12,
        specifications: { type: 'Dynamic', accuracy: '0.01g', maxWeight: '500g', display: 'Digital' }
    },
    {
        name: 'Heat Shrink Kit',
        description: 'Assorted heat shrink tubing in multiple colors. For professional wiring.',
        price: 19,
        category: 'tools',
        subcategory: 'Wiring',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 120,
        featured: false,
        ratings: 4.5,
        numReviews: 32,
        specifications: { sizes: '5', colors: '8', length: '1m each', material: 'Polyolefin' }
    },
    {
        name: 'Drone Carry Case',
        description: 'Hard shell carrying case with custom foam insert. Fits quadcopter up to 450mm.',
        price: 89,
        category: 'tools',
        subcategory: 'Storage',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 30,
        featured: true,
        ratings: 4.6,
        numReviews: 14,
        specifications: { size: '500x400x150mm', material: 'ABS', foam: 'Custom', lock: 'TSA' }
    },
    {
        name: 'Solder Wire 0.8mm',
        description: 'Premium lead-free solder wire with rosin core. Excellent flow characteristics.',
        price: 15,
        category: 'tools',
        subcategory: 'Soldering',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 100,
        featured: false,
        ratings: 4.8,
        numReviews: 22,
        specifications: { diameter: '0.8mm', composition: 'Sn99.3/Cu0.7', weight: '100g', flux: '2%' }
    },
    {
        name: 'Motor Testing Stand',
        description: 'Dedicated motor spin testing stand. Check for vibrations before flight.',
        price: 55,
        category: 'tools',
        subcategory: 'Testing',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600',
        stock: 35,
        featured: false,
        ratings: 4.3,
        numReviews: 9,
        specifications: { type: 'Fixed', powerSource: '2S-6S', display: 'RPM', material: 'Aluminum' }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('Inserted sample products');

        await User.deleteMany({ email: 'admin@ingraviton.com' });
        await User.create({
            name: 'Admin User',
            email: 'admin@ingraviton.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Created admin user (admin@ingraviton.com / admin123)');

        await User.deleteMany({ email: 'test@user.com' });
        await User.create({
            name: 'Test User',
            email: 'test@user.com',
            password: 'user123',
            role: 'user'
        });
        console.log('Created test user (test@user.com / user123)');

        console.log('\nSeed completed successfully!');
        console.log('You can now start the server with: npm start');

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedDatabase();
