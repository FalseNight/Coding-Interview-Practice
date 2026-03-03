/*
 * CartTransformer - Transform shopping cart with product catalog
 * 
 * Implement a function that takes a shopping cart array and a product catalog,
 * and returns a transformed cart with full product details and line totals.
 * 
 * Requirements:
 * 1. Shopping cart contains items with ProductId and Quantity
 * 2. Product catalog contains product details (Id, Name, Price, Category, InStock)
 * 3. For each cart item, add: Name, Price, Category, LineTotal (Price * Quantity)
 * 4. Calculate cart totals: Subtotal, Tax (10% of subtotal), Total
 * 5. Handle missing products - if ProductId not found in catalog, mark as "Unavailable"
 * 6. Handle out of stock products - add warning flag
 * 7. Group items by category in the result
 */

using System;
using System.Collections.Generic;
using System.Linq;

public class CartItem
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
}

public class Product
{
    public string Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public bool InStock { get; set; }
}

public class EnrichedCartItem
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public decimal LineTotal { get; set; }
    public string Warning { get; set; }
}

public class CategoryGroupItem
{
    public string ProductId { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
    public string Warning { get; set; }
}

public class CartTotals
{
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
}

public class TransformedCart
{
    public List<EnrichedCartItem> Items { get; set; } = new List<EnrichedCartItem>();
    public Dictionary<string, List<CategoryGroupItem>> GroupedByCategory { get; set; } = new Dictionary<string, List<CategoryGroupItem>>();
    public CartTotals Totals { get; set; } = new CartTotals();
}

public class CartTransformer
{
    public static TransformedCart TransformCart(List<CartItem> cart, Dictionary<string, Product> catalog)
    {
        // TODO: Implement cart transformation
        
        // Steps to consider:
        // 1. Initialize result structure
        // 2. Loop through cart items
        // 3. Look up each product in catalog
        // 4. Calculate line totals
        // 5. Track running totals
        // 6. Group by category
        // 7. Handle edge cases (missing products, out of stock)
        
        throw new NotImplementedException();
    }
    
    // Test with sample data
    public static void Test()
    {
        var sampleCatalog = new Dictionary<string, Product>
        {
            ["p1"] = new Product { Id = "p1", Name = "Laptop", Price = 999.99m, Category = "Electronics", InStock = true },
            ["p2"] = new Product { Id = "p2", Name = "Headphones", Price = 89.99m, Category = "Electronics", InStock = true },
            ["p3"] = new Product { Id = "p3", Name = "Coffee Mug", Price = 12.99m, Category = "Kitchen", InStock = true },
            ["p4"] = new Product { Id = "p4", Name = "Notebook", Price = 4.99m, Category = "Office", InStock = false }
        };
        
        var sampleCart = new List<CartItem>
        {
            new CartItem { ProductId = "p1", Quantity = 1 },
            new CartItem { ProductId = "p2", Quantity = 2 },
            new CartItem { ProductId = "p3", Quantity = 3 },
            new CartItem { ProductId = "p4", Quantity = 5 },
            new CartItem { ProductId = "p999", Quantity = 1 }
        };
        
        var result = TransformCart(sampleCart, sampleCatalog);
        
        // Simple console output (in real interview, they might use Newtonsoft.Json or System.Text.Json)
        Console.WriteLine("Items:");
        foreach (var item in result.Items)
        {
            Console.WriteLine($"  {item.ProductId}: {item.Name}, Qty: {item.Quantity}, LineTotal: {item.LineTotal:C} {(!string.IsNullOrEmpty(item.Warning) ? $"WARNING: {item.Warning}" : "")}");
        }
        
        Console.WriteLine("\nGrouped By Category:");
        foreach (var category in result.GroupedByCategory)
        {
            Console.WriteLine($"  {category.Key}:");
            foreach (var item in category.Value)
            {
                Console.WriteLine($"    {item.Name} (x{item.Quantity}) - {item.LineTotal:C} {(!string.IsNullOrEmpty(item.Warning) ? $"WARNING: {item.Warning}" : "")}");
            }
        }
        
        Console.WriteLine($"\nTotals:");
        Console.WriteLine($"  Subtotal: {result.Totals.Subtotal:C}");
        Console.WriteLine($"  Tax (10%): {result.Totals.Tax:C}");
        Console.WriteLine($"  Total: {result.Totals.Total:C}");
    }
}

// Expected output (conceptual):
// Items:
//   p1: Laptop, Qty: 1, LineTotal: $999.99
//   p2: Headphones, Qty: 2, LineTotal: $179.98
//   p3: Coffee Mug, Qty: 3, LineTotal: $38.97
//   p4: Notebook, Qty: 5, LineTotal: $24.95 WARNING: Out of stock
//   p999: Unavailable, Qty: 1, LineTotal: $0.00 WARNING: Product not found
//
// Grouped By Category:
//   Electronics:
//     Laptop (x1) - $999.99
//     Headphones (x2) - $179.98
//   Kitchen:
//     Coffee Mug (x3) - $38.97
//   Office:
//     Notebook (x5) - $24.95 WARNING: Out of stock
//   Unknown:
//     Unavailable (x1) - $0.00 WARNING: Product not found
//
// Totals:
//   Subtotal: $1,243.89
//   Tax (10%): $124.39
//   Total: $1,368.28