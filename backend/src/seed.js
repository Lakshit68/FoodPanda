
require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const connectDB = require('./db');

const restaurants = [
  { 
    name: 'The Italian Bistro', 
    cuisine: ['Italian','Pasta','Pizza'], 
    rating: 4.5, 
    deliveryTimeMins: 35, 
    priceLevel: 3, 
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1470',
    address: '123 Pasta Lane, Foodville',
    about: 'Authentic Italian cuisine made with love. We use only the freshest ingredients to bring the taste of Italy to your plate.',
    contact: { phone: '555-123-4567', email: 'contact@italianbistro.com' },
    offer: 20
  },
  { 
    name: 'Burger Haven', 
    cuisine: ['American','Burgers','Fast Food'], 
    rating: 4.2, 
    deliveryTimeMins: 25, 
    priceLevel: 2, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1470',
    address: '456 Burger Blvd, Foodville',
    about: 'The best burgers in town! We pride ourselves on our juicy, handcrafted burgers and crispy fries.',
    contact: { phone: '555-987-6543', email: 'info@burgerhaven.com' },
    offer: 10
  },
  { 
    name: 'Sushi Delights', 
    cuisine: ['Japanese','Sushi','Asian'], 
    rating: 4.8, 
    deliveryTimeMins: 45, 
    priceLevel: 4, 
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1470',
    address: '789 Sushi St, Foodville',
    about: 'Exquisite sushi and Japanese dishes, prepared by our master chefs. A true delight for your senses.',
    contact: { phone: '555-111-2222', email: 'sushi@delights.com' },
    offer: 30
  },
  { 
    name: 'Spice Route', 
    cuisine: ['Indian','North Indian'], 
    rating: 4.3, 
    deliveryTimeMins: 40, 
    priceLevel: 3, 
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1374',
    address: '101 Curry Rd, Foodville',
    about: 'A journey through the flavors of India. Our dishes are rich, aromatic, and full of spice.',
    contact: { phone: '555-333-4444', email: 'support@spiceroute.com' },
    offer: 15
  },
  { 
    name: 'Green Bowl', 
    cuisine: ['Healthy','Salads'], 
    rating: 4.1, 
    deliveryTimeMins: 22, 
    priceLevel: 2, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470',
    address: '222 Wellness Way, Foodville',
    about: 'Eat clean, live well. We offer a variety of fresh salads, bowls, and healthy meals.',
    contact: { phone: '555-555-6666', email: 'healthy@greenbowl.com' },
    offer: 25
  },
  { 
    name: 'Dragon Wok', 
    cuisine: ['Chinese'], 
    rating: 4.4, 
    deliveryTimeMins: 30, 
    priceLevel: 2, 
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1592',
    address: '333 Dragon Ave, Foodville',
    about: 'Savor the taste of authentic Chinese cuisine. From classic dishes to modern interpretations.',
    contact: { phone: '555-777-8888', email: 'wok@dragon.com' },
    offer: 10
  },
  { 
    name: 'Taco Town', 
    cuisine: ['Mexican','Tacos'], 
    rating: 4.6, 
    deliveryTimeMins: 28, 
    priceLevel: 2, 
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1471',
    address: '456 Taco Terrace, Foodville',
    about: 'The best tacos in town, made with fresh tortillas and authentic fillings.',
    contact: { phone: '555-822-6869', email: 'hola@tacotown.com' },
    offer: 20
  },
  { 
    name: 'The Noodle House', 
    cuisine: ['Asian','Noodles'], 
    rating: 4.4, 
    deliveryTimeMins: 38, 
    priceLevel: 3, 
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=1470',
    address: '789 Ramen Road, Foodville',
    about: 'A wide variety of noodle dishes from across Asia, from ramen to pad thai.',
    contact: { phone: '555-666-3535', email: 'noodles@house.com' },
    offer: 15
  },
  { 
    name: 'BBQ Central', 
    cuisine: ['BBQ','American'], 
    rating: 4.7, 
    deliveryTimeMins: 48, 
    priceLevel: 4, 
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1335',
    address: '123 Ribs Road, Foodville',
    about: 'Slow-smoked BBQ, cooked to perfection. Get your hands dirty!',
    contact: { phone: '555-227-2328', email: 'contact@bbqcentral.com' },
    offer: 10
  },
  { 
    name: 'The Breakfast Club', 
    cuisine: ['Breakfast','Cafe'], 
    rating: 4.5, 
    deliveryTimeMins: 20, 
    priceLevel: 2, 
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1470',
    address: '456 Morning Glory, Foodville',
    about: 'All your breakfast favorites, served all day long. The perfect start to any day.',
    contact: { phone: '555-273-2532', email: 'hello@breakfastclub.com' },
    offer: 5
  },
  { 
    name: 'Pizzeria Roma', 
    cuisine: ['Pizza','Italian'], 
    rating: 4.6, 
    deliveryTimeMins: 32, 
    priceLevel: 3, 
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?q=80&w=1470',
    address: '789 Pizza Plaza, Foodville',
    about: 'Classic Roman-style pizza with a thin, crispy crust and the freshest toppings.',
    contact: { phone: '555-749-9276', email: 'ciao@pizzeriaroma.com' },
    offer: 10
  }
];

const menuItems = {
  'The Italian Bistro': [
    { name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza', price: 12, image: 'https://images.unsplash.com/photo-1598021680942-84f936e0f559?q=80&w=1374', category: 'Pizza', isSpecial: true },
    { name: 'Pasta Carbonara', description: 'Creamy pasta with bacon', price: 15, image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=1374', category: 'Pasta' },
  ],
  'Burger Haven': [
    { name: 'Classic Cheeseburger', description: 'Beef patty with cheese, lettuce, and tomato', price: 10, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1530', category: 'Burgers', isSpecial: true },
    { name: 'Veggie Burger', description: 'A delicious vegetarian burger', price: 9, image: 'https://images.unsplash.com/photo-1551615613-245a533f6033?q=80&w=1374', category: 'Burgers' },
  ],
  'Sushi Delights': [
    { name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 8, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1470', category: 'Sushi' },
    { name: 'Spicy Tuna Roll', description: 'Tuna with a spicy kick', price: 10, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470', category: 'Sushi', isSpecial: true },
  ],
  'Spice Route': [
      { name: 'Chicken Tikka Masala', description: 'Creamy chicken curry', price: 14, image: 'https://images.unsplash.com/photo-1626082896498-4625833445ac?q=80&w=1374', category: 'Main Course', isSpecial: true },
      { name: 'Naan Bread', description: 'Soft and fluffy Indian bread', price: 4, image: 'https://images.unsplash.com/photo-1628543569823-9584a33a516b?q=80&w=1470', category: 'Breads' },
  ],
  'Green Bowl': [
      { name: 'Quinoa Salad', description: 'Healthy salad with quinoa and vegetables', price: 11, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470', category: 'Salads', isSpecial: true },
      { name: 'Avocado Toast', description: 'Toast with fresh avocado', price: 8, image: 'https://images.unsplash.com/photo-1587339144367-f634055ca49a?q=80&w=1374', category: 'Breakfast' },
  ],
  'Dragon Wok': [
      { name: 'Sweet and Sour Chicken', description: 'Classic Chinese dish', price: 13, image: 'https://images.unsplash.com/photo-1608231387042-66d2073c713c?q=80&w=1374', category: 'Main Course' },
      { name: 'Fried Rice', description: 'Stir-fried rice with vegetables', price: 9, image: 'https://images.unsplash.com/photo-1596560544139-e42645983c87?q=80&w=1470', category: 'Sides', isSpecial: true },
  ],
  'Taco Town': [
    { name: 'Carne Asada Tacos', description: 'Grilled steak tacos', price: 12, image: 'https://images.unsplash.com/photo-1565299589934-3c04139a585a?q=80&w=1470', category: 'Tacos', isSpecial: true },
    { name: 'Al Pastor Tacos', description: 'Marinated pork tacos', price: 11, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1471', category: 'Tacos' },
  ],
  'The Noodle House': [
    { name: 'Tonkotsu Ramen', description: 'Rich and creamy pork broth ramen', price: 16, image: 'https://images.unsplash.com/photo-1555126634-78d6283779b3?q=80&w=1374', category: 'Ramen', isSpecial: true },
    { name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp and peanuts', price: 14, image: 'https://images.unsplash.com/photo-1563379926-8938ddef9763?q=80&w=1470', category: 'Noodles' },
  ],
  'BBQ Central': [
    { name: 'Pulled Pork Sandwich', description: 'Slow-smoked pulled pork on a brioche bun', price: 13, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1335', category: 'Sandwiches', isSpecial: true },
    { name: 'BBQ Ribs', description: 'Fall-off-the-bone BBQ ribs', price: 22, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1470', category: 'Platters' },
  ],
  'The Breakfast Club': [
    { name: 'Pancakes', description: 'Fluffy pancakes with maple syrup and berries', price: 10, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1470', category: 'Breakfast', isSpecial: true },
    { name: 'Eggs Benedict', description: 'Classic eggs benedict with hollandaise sauce', price: 12, image: 'https://images.unsplash.com/photo-1604297022313-f8a71b414e1c?q=80&w=1374', category: 'Breakfast' },
  ],
  'Pizzeria Roma': [
    { name: 'Quattro Formaggi', description: 'Four cheese pizza', price: 14, image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?q=80&w=1470', category: 'Pizza', isSpecial: true },
    { name: 'Prosciutto e Funghi', description: 'Pizza with prosciutto and mushrooms', price: 16, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1470', category: 'Pizza' },
  ]
};

async function seed() {
  try {
    await connectDB();
    console.log('MongoDB connected for seeding');

    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    for (const restaurantData of restaurants) {
      const restaurant = new Restaurant(restaurantData);
      const savedRestaurant = await restaurant.save();
      console.log(`Saved restaurant: ${savedRestaurant.name}`);

      if (menuItems[savedRestaurant.name]) {
        const items = menuItems[savedRestaurant.name].map(item => ({
          ...item,
          restaurant: savedRestaurant._id
        }));
        await MenuItem.insertMany(items);
        console.log(`- Seeded ${items.length} menu items for ${savedRestaurant.name}`);
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

seed();
