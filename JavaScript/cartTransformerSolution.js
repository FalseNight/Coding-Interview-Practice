function transformCart(cart, catalog) {
  // Initialize result structure
  const result = {
    items: [],
    groupedByCategory: {},
    totals: {
      subtotal: 0,
      tax: 0,
      total: 0
    }
  };

  // Process each cart item
  for (const cartItem of cart) {
    const { productId, quantity } = cartItem;
    const product = catalog[productId];
    
    let enrichedItem = {
      productId,
      quantity
    };

    // Case 1: Product not found in catalog
    if (!product) {
      enrichedItem = {
        ...enrichedItem,
        name: "Unavailable",
        price: 0,
        category: "Unknown",
        lineTotal: 0,
        warning: "Product not found"
      };
    } 
    // Case 2: Product found
    else {
      const lineTotal = product.price * quantity;
      
      enrichedItem = {
        ...enrichedItem,
        name: product.name,
        price: product.price,
        category: product.category,
        lineTotal
      };

      // Add warning if out of stock
      if (!product.inStock) {
        enrichedItem.warning = "Out of stock";
      }

      // Add to subtotal
      result.totals.subtotal += lineTotal;
    }

    // Add to items array
    result.items.push(enrichedItem);

    // Group by category
    const category = enrichedItem.category;
    if (!result.groupedByCategory[category]) {
      result.groupedByCategory[category] = [];
    }
    
    // Add simplified version to category group
    result.groupedByCategory[category].push({
      productId: enrichedItem.productId,
      name: enrichedItem.name,
      quantity: enrichedItem.quantity,
      lineTotal: enrichedItem.lineTotal,
      ...(enrichedItem.warning && { warning: enrichedItem.warning })
    });
  }

  // Calculate tax and total
  result.totals.tax = Math.round(result.totals.subtotal * 0.1 * 100) / 100; // 10% tax, rounded to 2 decimals
  result.totals.total = Math.round((result.totals.subtotal + result.totals.tax) * 100) / 100;
  result.totals.subtotal = Math.round(result.totals.subtotal * 100) / 100; // Round to 2 decimals

  return result;
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