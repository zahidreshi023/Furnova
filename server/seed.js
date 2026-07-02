require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { Category, Product, User, Cart, Order, Review, Setting } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async (shouldExit = true) => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB. Starting database seeding...');

    // Wipe collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    if (shouldExit) {
      await Setting.deleteMany({});
    }
    console.log('Collections wiped successfully.');

    // 0. Seed Admin Account
    const adminSalt = await bcrypt.genSalt(12);
    const adminHash = await bcrypt.hash('Admin123!', adminSalt);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@furnova.com',
      password: adminHash,
      role: 'admin',
      addresses: [],
    });
    await Cart.create({ userId: adminUser._id, items: [] });
    console.log('Default admin account seeded: admin@furnova.com / Admin123!');

    // 1. Seed Categories
    const beds = await Category.create({ name: 'Beds', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop' });
    const chairs = await Category.create({ name: 'Chairs', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop' });
    const sofas = await Category.create({ name: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop' });
    const tables = await Category.create({ name: 'Tables', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop' });
    const storage = await Category.create({ name: 'Storage', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop' });

    // Subcategories
    await Category.create({ name: 'King Size Beds', parentCategoryId: beds._id });
    await Category.create({ name: 'Office Chairs', parentCategoryId: chairs._id });
    await Category.create({ name: 'Dining Tables', parentCategoryId: tables._id });

    // 2. Seed Furniture Products
    const productsData = [
      // BEDS (6 Products)
      {
        name: 'Novara Velvet King Bed',
        category: 'Beds',
        description: 'Elevate your bedroom with the luxurious Novara Velvet King Bed. Features vertical channel tufting, deep velvet upholstery, and a robust solid oak slat system.',
        dimensions: 'Width: 210cm, Length: 225cm, Headboard Height: 120cm',
        material: 'Velvet & Solid Oak Wood',
        color: 'Royal Blue',
        price: 899.99,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop'
        ],
        ratings: 4.8
      },
      {
        name: 'Serene Oak Queen Bed',
        category: 'Beds',
        description: 'A minimalist bedroom centerpiece made from FSC-certified solid white oak. Features a natural oiled grain finish and tapered corner legs.',
        dimensions: 'Width: 165cm, Length: 215cm, Headboard Height: 105cm',
        material: 'Solid White Oak Wood',
        color: 'Natural White Oak',
        price: 699.99,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1505693395321-883724634266?w=600&auto=format&fit=crop'],
        ratings: 4.6
      },
      {
        name: 'Tuscan Walnut Platform Bed',
        category: 'Beds',
        description: 'Low-profile Italian platform bed frame crafted from dark American walnut. Designed with floating headboard shelves for a modern aesthetic.',
        dimensions: 'Width: 190cm, Length: 220cm, Headboard Height: 90cm',
        material: 'Solid American Walnut',
        color: 'Dark Walnut',
        price: 1099.99,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop'],
        ratings: 4.9
      },
      {
        name: 'Elysium Wingback Bed',
        category: 'Beds',
        description: 'Features a tall, cozy wingback tufted headboard in breathable linen fabric, creating a warm and protective sleep harbor.',
        dimensions: 'Width: 175cm, Length: 220cm, Headboard Height: 140cm',
        material: 'Textured Linen & Pine Frame',
        color: 'Oatmeal Beige',
        price: 799.99,
        stock: 6,
        images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop'],
        ratings: 4.7
      },
      {
        name: 'Monarch Oak Canopy Bed',
        category: 'Beds',
        description: 'Stunning four-poster canopy bed built from select white oak timber. Ideal for high ceiling bedrooms and grand interiors.',
        dimensions: 'Width: 215cm, Length: 230cm, Canopy Height: 220cm',
        material: 'Solid White Oak',
        color: 'Bleached Oak',
        price: 1299.99,
        stock: 4,
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop'],
        ratings: 4.8
      },
      {
        name: 'Urban Loft Metal Bed',
        category: 'Beds',
        description: 'Industrial-style steel frame bed combined with reclaimed timber accents on the headboard and footboard. High clearance underneath for extra storage.',
        dimensions: 'Width: 160cm, Length: 210cm, Headboard Height: 110cm',
        material: 'Powder-Coated Steel & Reclaimed Pine',
        color: 'Matte Black & Antique Brown',
        price: 449.99,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1505693395321-883724634266?w=600&auto=format&fit=crop'],
        ratings: 4.4
      },

      // CHAIRS (6 Products)
      {
        name: 'Elysian Ergonomic Desk Chair',
        category: 'Chairs',
        description: 'Features synchronized tilt mechanisms, dynamic lumbar contouring, and 3D memory foam armrests to ensure high comfort during long workspace sessions.',
        dimensions: 'Width: 68cm, Depth: 68cm, Height: 115-125cm',
        material: 'Premium Mesh & Nylon Base',
        color: 'Charcoal Black',
        price: 249.99,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop'
        ],
        ratings: 4.6
      },
      {
        name: 'Chesterfield Tufted Armchair',
        category: 'Chairs',
        description: 'Classic British design statement with deep button tufting, rolled arm contours, and solid walnut Bun-style legs.',
        dimensions: 'Width: 95cm, Depth: 85cm, Height: 78cm',
        material: 'Faux Leather & Beech Wood',
        color: 'Oxblood Red',
        price: 499.99,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop'],
        ratings: 4.4
      },
      {
        name: 'Oxford Tufted Desk Chair',
        category: 'Chairs',
        description: 'Retro executive office chair with high back tufted padding, a swivel tilt control, and mahogany base wraps.',
        dimensions: 'Width: 70cm, Depth: 72cm, Height: 120-130cm',
        material: 'Genuine Leather & Mahogany Wood',
        color: 'Chestnut Brown',
        price: 349.99,
        stock: 8,
        images: ['https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop'],
        ratings: 4.7
      },
      {
        name: 'Scandi Curved Accent Chair',
        category: 'Chairs',
        description: 'Organically curved wingback accent chair with high density foam cushioning and slender oak legs.',
        dimensions: 'Width: 80cm, Depth: 75cm, Height: 95cm',
        material: 'Textured Bouclé Fabric & Oak',
        color: 'Cream Bouclé',
        price: 299.99,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop'],
        ratings: 4.5
      },
      {
        name: 'Vienna Bentwood Dining Chair',
        category: 'Chairs',
        description: 'Classic cafe dining chair crafted using historic steam-bent wood processes. Extremely lightweight and durable.',
        dimensions: 'Width: 45cm, Depth: 48cm, Height: 85cm',
        material: 'Steam-Bent Beech Timber',
        color: 'Ebony Stain',
        price: 119.99,
        stock: 24,
        images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop'],
        ratings: 4.3
      },
      {
        name: 'Tribeca Velvet Lounge Chair',
        category: 'Chairs',
        description: 'Glamorous mid-century modern accent lounge chair featuring deep vertical tufts and brass-plated hairpin steel frames.',
        dimensions: 'Width: 85cm, Depth: 80cm, Height: 90cm',
        material: 'Velvet & Brass Steel',
        color: 'Emerald Green',
        price: 279.99,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop'],
        ratings: 4.6
      },

      // SOFAS (6 Products)
      {
        name: 'Hampton Leather Sofa',
        category: 'Sofas',
        description: 'Crafted with premium top-grain Italian pull-up leather designed to acquire a natural patina over time. Features deep down-filled seating.',
        dimensions: 'Width: 230cm, Depth: 95cm, Height: 85cm',
        material: 'Italian Top-Grain Leather & Walnut',
        color: 'Cognac Tan',
        price: 1499.99,
        stock: 5,
        images: [
          'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop'
        ],
        ratings: 4.9
      },
      {
        name: 'Nordic Plush Sectional Sofa',
        category: 'Sofas',
        description: 'A deep-seated, ultra-plush modular sectional sofa. Built using a moisture-resistant corner-blocked hardwood frame and soft, textured Belgian linen fabric.',
        dimensions: 'Width: 280cm, Depth: 160cm (Chaise), Height: 80cm',
        material: 'Belgian Linen & Pine Wood',
        color: 'Oatmeal Beige',
        price: 1799.99,
        stock: 4,
        images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop'],
        ratings: 4.8
      },
      {
        name: 'Milano Velvet Loveseat',
        category: 'Sofas',
        description: 'Chic, compact velvet couch featuring two large cushions and gold steel cylindrical legs. Ideal for modern apartments.',
        dimensions: 'Width: 160cm, Depth: 88cm, Height: 82cm',
        material: 'Velvet & Steel',
        color: 'Dusty Rose',
        price: 699.99,
        stock: 7,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop'],
        ratings: 4.6
      },
      {
        name: 'Pacific Modular Sofa Section',
        category: 'Sofas',
        description: 'Single modular middle armless section allowing you to build or expand your own custom modular couch system.',
        dimensions: 'Width: 90cm, Depth: 95cm, Height: 80cm',
        material: 'Textured Canvas & Solid Pine',
        color: 'Granite Grey',
        price: 349.99,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop'],
        ratings: 4.5
      },
      {
        name: 'Retro Bouclé Compact Sofa',
        category: 'Sofas',
        description: 'Stunning curved sofa wrapped in tactile cream-white bouclé. Soft organic shape adds visual warmth to any interior layout.',
        dimensions: 'Width: 190cm, Depth: 92cm, Height: 78cm',
        material: 'Luxe Bouclé & Walnut Feet',
        color: 'Ivory Bouclé',
        price: 899.99,
        stock: 6,
        images: ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop'],
        ratings: 4.7
      },
      {
        name: 'Bespoke Chesterfield Sofa',
        category: 'Sofas',
        description: 'Traditional tufted sofa upholstered in aged hand-rubbed leather with deep diamond folds and heavy-duty steel spring coils.',
        dimensions: 'Width: 220cm, Depth: 95cm, Height: 80cm',
        material: 'Aged Leather & Oak frame',
        color: 'Whiskey Brown',
        price: 1699.99,
        stock: 3,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop'],
        ratings: 4.9
      },

      // TABLES (6 Products)
      {
        name: 'Marrakesh Walnut Dining Table',
        category: 'Tables',
        description: 'Mid-century dining table featuring a solid American walnut frame with a chevron-patterned tabletop. Seats up to 6 people.',
        dimensions: 'Width: 180cm, Depth: 90cm, Height: 75cm',
        material: 'Solid American Walnut',
        color: 'Natural Walnut',
        price: 799.99,
        stock: 6,
        images: [
          'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&auto=format&fit=crop'
        ],
        ratings: 4.5
      },
      {
        name: 'Scandi Ash Coffee Table',
        category: 'Tables',
        description: 'Clean lines, tapered legs, and a bottom slatted storage shelf. Perfect for light-filled living spaces.',
        dimensions: 'Width: 110cm, Depth: 60cm, Height: 45cm',
        material: 'Solid Ash Wood',
        color: 'Light Ash',
        price: 199.99,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop'],
        ratings: 4.2
      },
      {
        name: 'Aurora Bedside Table',
        category: 'Tables',
        description: 'The Aurora nightstand features one soft-closing drawer, a bottom open shelf, and gold-finished steel hairpin legs.',
        dimensions: 'Width: 45cm, Depth: 40cm, Height: 55cm',
        material: 'Pine Wood & Gold Steel',
        color: 'Walnut & Brass',
        price: 149.99,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop'],
        ratings: 4.3
      },
      {
        name: 'Antwerp Ash Nesting Tables',
        category: 'Tables',
        description: 'Set of 3 interlocking nesting tables in solid ash wood. Space-saving configuration offering high surface versatility.',
        dimensions: 'Large: 55cm x 55cm, Med: 45cm x 45cm, Small: 35cm x 35cm',
        material: 'Solid Ash Timber',
        color: 'Ebony Stain',
        price: 179.99,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop'],
        ratings: 4.4
      },
      {
        name: 'Kyoto Live-Edge Coffee Table',
        category: 'Tables',
        description: 'Stunning organic live-edge walnut slab supported by architectural iron plate legs. Each piece has a unique organic grain pattern.',
        dimensions: 'Width: 120cm, Depth: 70cm, Height: 40cm',
        material: 'Walnut Slab & Cast Iron',
        color: 'Natural Walnut Grain',
        price: 389.99,
        stock: 8,
        images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop'],
        ratings: 4.8
      },
      {
        name: 'Metropolitan Console Table',
        category: 'Tables',
        description: 'Sleek entry hall console table featuring a tempered glass top and a brushed champagne gold steel frame.',
        dimensions: 'Width: 130cm, Depth: 35cm, Height: 78cm',
        material: 'Tempered Glass & Stainless Steel',
        color: 'Champagne Gold',
        price: 249.99,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&auto=format&fit=crop'],
        ratings: 4.5
      },

      // STORAGE (6 Products)
      {
        name: 'Aurelia Oak Wardrobe',
        category: 'Storage',
        description: 'Spacious white oak double wardrobe. Includes modular interior shelving, a clothing rod, and three soft-closing drawers.',
        dimensions: 'Width: 120cm, Depth: 60cm, Height: 200cm',
        material: 'White Oak Veneer & Brass Handles',
        color: 'Bleached Oak',
        price: 1199.99,
        stock: 3,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop'],
        ratings: 4.7
      },
      {
        name: 'Linear Sideboard Console',
        category: 'Storage',
        description: 'Modern geometric relief console. Includes three cabinet doors with touch-latch mechanisms and adjustable shelving.',
        dimensions: 'Width: 160cm, Depth: 45cm, Height: 75cm',
        material: 'MDF & Oak Veneer',
        color: 'Forest Green & Ash',
        price: 649.99,
        stock: 7,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop'],
        ratings: 4.7
      },
      {
        name: 'Verona Walnut Credenza',
        category: 'Storage',
        description: 'Premium media buffet sideboard with sliding slatted wooden doors, wire management channels, and height-adjustable inner shelves.',
        dimensions: 'Width: 180cm, Depth: 48cm, Height: 70cm',
        material: 'Solid Walnut & Ash',
        color: 'Amber Walnut',
        price: 849.99,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1601084881623-cef5a7de343a?w=600&auto=format&fit=crop'],
        ratings: 4.8
      },
      {
        name: 'Nordic Rattan Storage Chest',
        category: 'Storage',
        description: 'Natural woven rattan panel storage chest with solid wood frame. Perfect for blanket storage or hallway organization.',
        dimensions: 'Width: 100cm, Depth: 50cm, Height: 60cm',
        material: 'Natural Rattan & Ash wood',
        color: 'Natural Rattan Ash',
        price: 299.99,
        stock: 14,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop'],
        ratings: 4.5
      },
      {
        name: 'Aero Slatted Bookcase',
        category: 'Storage',
        description: 'Stately slatted shelving unit featuring five tier panels. Ideal for books, plants, and decorative art display.',
        dimensions: 'Width: 80cm, Depth: 32cm, Height: 180cm',
        material: 'Oak Veneer & Cast Iron Frame',
        color: 'Industrial Ash',
        price: 379.99,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop'],
        ratings: 4.6
      },
      {
        name: 'Elysia Floating Shelves',
        category: 'Storage',
        description: 'Set of 3 thick solid walnut floating shelves featuring keyhole bracket systems for flush, clean wall mounting.',
        dimensions: 'L: 90cm, M: 60cm, S: 40cm (Depth: 20cm)',
        material: 'Solid Walnut Wood',
        color: 'Oiled Walnut',
        price: 99.99,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1601084881623-cef5a7de343a?w=600&auto=format&fit=crop'],
        ratings: 4.3
      }
    ];

    for (const prod of productsData) {
      await Product.create(prod);
    }

    const existingBanners = await Setting.findOne({ key: 'banner_settings' });
    if (!existingBanners) {
      await Setting.create({
        key: 'banner_settings',
        value: [
          {
            image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
            headline: 'Elevate Your Living Space',
            subtitle: 'Discover hand-crafted furniture collection. Impeccable wood finishes, premium upholstery fabrics.',
            ctaText: 'Shop Collection',
            ctaLink: '/products',
          },
          {
            image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200&auto=format&fit=crop',
            headline: 'Crafted in Elegance',
            subtitle: 'Every piece undergoes a rigorous 14-stage dry-kiln curing process for decades of durability.',
            ctaText: 'Explore Tables',
            ctaLink: '/products?category=Tables',
          },
          {
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop',
            headline: 'Luxury Sofas Collection',
            subtitle: 'Sink into premium comfort with our hand-stitched velvet and leather sofas.',
            ctaText: 'View Sofas',
            ctaLink: '/products?category=Sofas',
          },
        ],
      });
    }

    console.log('Furniture database successfully seeded on MongoDB.');
    if (shouldExit) process.exit(0);
  } catch (err) {
    console.error('Seeding operation failed:', err.message);
    if (shouldExit) process.exit(1);
    throw err;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;

