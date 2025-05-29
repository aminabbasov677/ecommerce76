// Generate fake products
export const generateFakeProducts = (count = 10) => {
  const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  const productNames = {
    'electronics': ['Quantum Processor', 'Neural Interface', 'Holographic Display', 'Fusion Battery', 'Nano Drone'],
    'jewelery': ['Plasma Crystal Ring', 'Quantum Timepiece', 'Antigravity Pendant', 'Neutrino Bracelet', 'Phase-Shift Earrings'],
    "men's clothing": ['Thermo-Adaptive Jacket', 'Self-Repairing Pants', 'Neural-Link Helmet', 'Graviton Boots', 'Carbon-Mesh Shirt'],
    "women's clothing": ['Chromatic Shift Dress', 'Nano-Fiber Coat', 'Quantum-Weave Scarf', 'Reactive Armor Boots', 'Neural-Pattern Blouse']
  };
  
  const descriptions = [
    'Featuring cutting-edge nanotechnology for unprecedented performance.',
    'Crafted with rare materials sourced from asteroid mining operations.',
    'Incorporates proprietary quantum algorithms for maximum efficiency.',
    'Designed with neural feedback systems that adapt to your preferences.',
    'Built using molecular assembly techniques for perfect structural integrity.',
    'Utilizes zero-point energy fields for sustainable power generation.',
    'Enhanced with AI-driven optimization for ideal user experience.'
  ];
  
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const nameOptions = productNames[category];
    const name = nameOptions[Math.floor(Math.random() * nameOptions.length)] + ' ' + Math.floor(Math.random() * 9000 + 1000);
    
    products.push({
      id: i,
      title: name,
      price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      category: category,
      image: `https://picsum.photos/seed/${i}/800/800`,
      rating: {
        rate: parseFloat((Math.random() * 3 + 2).toFixed(1)),
        count: Math.floor(Math.random() * 200 + 50)
      },
      stock: Math.floor(Math.random() * 50 + 5)
    });
  }
  
  return products;
};

// Generate fake users
export const generateFakeUsers = (count = 5) => {
  const users = [];
  
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      address: {
        street: `${Math.floor(Math.random() * 9000 + 1000)} Tech Boulevard`,
        city: 'Neo City',
        zipcode: `${Math.floor(Math.random() * 90000 + 10000)}`,
        geo: {
          lat: parseFloat((Math.random() * 180 - 90).toFixed(6)),
          lng: parseFloat((Math.random() * 360 - 180).toFixed(6))
        }
      },
      phone: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      favorites: Array.from({ length: Math.floor(Math.random() * 5 + 1) }, () => Math.floor(Math.random() * 20 + 1))
    });
  }
  
  return users;
};

// Generate fake orders
export const generateFakeOrders = (count = 10, userId = null) => {
  const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['credit_card', 'paypal', 'crypto', 'bank_transfer'];
  
  const orders = [];
  
  for (let i = 1; i <= count; i++) {
    const itemCount = Math.floor(Math.random() * 4 + 1);
    const items = [];
    let total = 0;
    
    for (let j = 1; j <= itemCount; j++) {
      const price = parseFloat((Math.random() * 200 + 10).toFixed(2));
      const quantity = Math.floor(Math.random() * 3 + 1);
      const subtotal = price * quantity;
      
      items.push({
        id: Math.floor(Math.random() * 20 + 1),
        title: `Product ${Math.floor(Math.random() * 1000)}`,
        price: price,
        quantity: quantity,
        subtotal: subtotal
      });
      
      total += subtotal;
    }
    
    const shipping = parseFloat((total * 0.05).toFixed(2));
    const tax = parseFloat((total * 0.08).toFixed(2));
    const grandTotal = parseFloat((total + shipping + tax).toFixed(2));
    
    orders.push({
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      userId: userId || Math.floor(Math.random() * 5 + 1),
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: items,
      shipping: shipping,
      tax: tax,
      total: grandTotal,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: {
        name: `User ${Math.floor(Math.random() * 5 + 1)}`,
        street: `${Math.floor(Math.random() * 9000 + 1000)} Tech Boulevard`,
        city: 'Neo City',
        zipcode: `${Math.floor(Math.random() * 90000 + 10000)}`,
        country: ['US', 'GB', 'JP', 'DE', 'SG'][Math.floor(Math.random() * 5)]
      }
    });
  }
  
  return orders;
};

// Generate fake reviews
export const generateFakeReviews = (productId = null, count = 5) => {
  const reviews = [];
  
  for (let i = 1; i <= count; i++) {
    reviews.push({
      id: i,
      productId: productId || Math.floor(Math.random() * 20 + 1),
      userId: Math.floor(Math.random() * 5 + 1),
      userName: `User ${Math.floor(Math.random() * 5 + 1)}`,
      rating: Math.floor(Math.random() * 3 + 3),
      title: ['Amazing product!', 'Exactly what I needed', 'Good quality', 'Impressive technology', 'Worth every credit'][Math.floor(Math.random() * 5)],
      content: ['This product exceeded my expectations. The build quality is excellent and performance is off the charts.', 
                'I was skeptical at first, but after using it for a week, I can confidently say this is the best purchase I\'ve made this year.', 
                'The design is sleek and futuristic. Functionality is intuitive and the neural interface is seamless.', 
                'While not perfect, it offers great value for the price. The quantum processing is incredibly fast.', 
                'Shipping was lightning quick and the product arrived in perfect condition. Would buy again.'][Math.floor(Math.random() * 5)],
      date: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString()
    });
  }
  
  return reviews;
};