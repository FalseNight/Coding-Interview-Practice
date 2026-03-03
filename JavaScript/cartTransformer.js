/**
 * cartTransformer - Transform shopping cart with product catalog
 * 
 * Implement a function that takes a shopping cart array and a product catalog,
 * and returns a transformed cart with full product details and line totals.
 * 
 * Requirements:
 * 1. Shopping cart contains items with productId and quantity
 * 2. Product catalog contains product details (id, name, price, category, inStock)
 * 3. For each cart item, add: name, price, category, lineTotal (price * quantity)
 * 4. Calculate cart totals: subtotal, tax (10% of subtotal), total
 * 5. Handle missing products - if productId not found in catalog, mark as "Unavailable"
 * 6. Handle out of stock products - add warning flag
 * 7. Group items by category in the result
 * 
 * @param {Array} cart - Array of cart items [{ productId: string, quantity: number }]
 * @param {Object} catalog - Product catalog object keyed by productId
 * @returns {Object} - Transformed cart with details and totals
 */

function transformCart(cart, catalog) {
  // TODO: Implement cart transformation
  
  // Steps to consider:
  // 1. Initialize result structure
  // 2. Loop through cart items
  // 3. Look up each product in catalog
  // 4. Calculate line totals
  // 5. Track running totals
  // 6. Group by category
  // 7. Handle edge cases (missing products, out of stock)
  
  throw new Error('Not implemented');
}

// Test with sample data
function test() {
  const sampleCatalog = {
    "p1": { id: "p1", name: "Laptop", price: 999.99, category: "Electronics", inStock: true },
    "p2": { id: "p2", name: "Headphones", price: 89.99, category: "Electronics", inStock: true },
    "p3": { id: "p3", name: "Coffee Mug", price: 12.99, category: "Kitchen", inStock: true },
    "p4": { id: "p4", name: "Notebook", price: 4.99, category: "Office", inStock: false }
  };

  const sampleCart = [
    { productId: "p1", quantity: 1 },
    { productId: "p2", quantity: 2 },
    { productId: "p3", quantity: 3 },
    { productId: "p4", quantity: 5 },
    { productId: "p999", quantity: 1 }
  ];

  const result = transformCart(sampleCart, sampleCatalog);
  console.log(JSON.stringify(result, null, 2));
}

test();
// Expected output:
// {
//   items: [
//     { productId: "p1", quantity: 1, name: "Laptop", price: 999.99, category: "Electronics", lineTotal: 999.99 },
//     { productId: "p2", quantity: 2, name: "Headphones", price: 89.99, category: "Electronics", lineTotal: 179.98 },
//     { productId: "p3", quantity: 3, name: "Coffee Mug", price: 12.99, category: "Kitchen", lineTotal: 38.97 },
//     { productId: "p4", quantity: 5, name: "Notebook", price: 4.99, category: "Office", lineTotal: 24.95, warning: "Out of stock" },
//     { productId: "p999", quantity: 1, name: "Unavailable", price: 0, category: "Unknown", lineTotal: 0, warning: "Product not found" }
//   ],
//   groupedByCategory: {
//     Electronics: [
//       { productId: "p1", name: "Laptop", quantity: 1, lineTotal: 999.99 },
//       { productId: "p2", name: "Headphones", quantity: 2, lineTotal: 179.98 }
//     ],
//     Kitchen: [
//       { productId: "p3", name: "Coffee Mug", quantity: 3, lineTotal: 38.97 }
//     ],
//     Office: [
//       { productId: "p4", name: "Notebook", quantity: 5, lineTotal: 24.95, warning: "Out of stock" }
//     ],
//     Unknown: [
//       { productId: "p999", name: "Unavailable", quantity: 1, lineTotal: 0, warning: "Product not found" }
//     ]
//   },
//   totals: {
//     subtotal: 1243.89,
//     tax: 124.39,
//     total: 1368.28
//   }
// }