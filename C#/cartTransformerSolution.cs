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
        // Initialize result structure
        var result = new TransformedCart();
        
        // Process each cart item
        foreach (var cartItem in cart)
        {
            var productId = cartItem.ProductId;
            var quantity = cartItem.Quantity;
            
            // Try to find product in catalog
            catalog.TryGetValue(productId, out Product product);
            
            var enrichedItem = new EnrichedCartItem
            {
                ProductId = productId,
                Quantity = quantity
            };
            
            // Case 1: Product not found in catalog
            if (product == null)
            {
                enrichedItem.Name = "Unavailable";
                enrichedItem.Price = 0;
                enrichedItem.Category = "Unknown";
                enrichedItem.LineTotal = 0;
                enrichedItem.Warning = "Product not found";
            }
            // Case 2: Product found
            else
            {
                var lineTotal = product.Price * quantity;
                
                enrichedItem.Name = product.Name;
                enrichedItem.Price = product.Price;
                enrichedItem.Category = product.Category;
                enrichedItem.LineTotal = lineTotal;
                
                // Add warning if out of stock
                if (!product.InStock)
                {
                    enrichedItem.Warning = "Out of stock";
                }
                
                // Add to subtotal
                result.Totals.Subtotal += lineTotal;
            }
            
            // Add to items array
            result.Items.Add(enrichedItem);
            
            // Group by category
            var category = enrichedItem.Category;
            if (!result.GroupedByCategory.ContainsKey(category))
            {
                result.GroupedByCategory[category] = new List<CategoryGroupItem>();
            }
            
            // Add simplified version to category group
            var categoryItem = new CategoryGroupItem
            {
                ProductId = enrichedItem.ProductId,
                Name = enrichedItem.Name,
                Quantity = enrichedItem.Quantity,
                LineTotal = enrichedItem.LineTotal
            };
            
            // Only add warning if it exists
            if (!string.IsNullOrEmpty(enrichedItem.Warning))
            {
                categoryItem.Warning = enrichedItem.Warning;
            }
            
            result.GroupedByCategory[category].Add(categoryItem);
        }
        
        // Calculate tax and total with proper rounding
        result.Totals.Tax = Math.Round(result.Totals.Subtotal * 0.10m, 2); // 10% tax, rounded to 2 decimals
        result.Totals.Total = Math.Round(result.Totals.Subtotal + result.Totals.Tax, 2);
        result.Totals.Subtotal = Math.Round(result.Totals.Subtotal, 2); // Round to 2 decimals
        
        return result;
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
        
        // Pretty print the result
        Console.WriteLine("{\n  \"items\": [");
        for (int i = 0; i < result.Items.Count; i++)
        {
            var item = result.Items[i];
            Console.Write($"    {{ \"productId\": \"{item.ProductId}\", \"quantity\": {item.Quantity}, \"name\": \"{item.Name}\", \"price\": {item.Price}, \"category\": \"{item.Category}\", \"lineTotal\": {item.LineTotal:F2}");
            
            if (!string.IsNullOrEmpty(item.Warning))
            {
                Console.Write($", \"warning\": \"{item.Warning}\"");
            }
            
            Console.Write(" }");
            if (i < result.Items.Count - 1) Console.WriteLine(",");
            else Console.WriteLine();
        }
        Console.WriteLine("  ],");
        
        Console.WriteLine("  \"groupedByCategory\": {");
        var categories = result.GroupedByCategory.Keys.ToList();
        for (int c = 0; c < categories.Count; c++)
        {
            var category = categories[c];
            var items = result.GroupedByCategory[category];
            
            Console.WriteLine($"    \"{category}\": [");
            for (int i = 0; i < items.Count; i++)
            {
                var item = items[i];
                Console.Write($"      {{ \"productId\": \"{item.ProductId}\", \"name\": \"{item.Name}\", \"quantity\": {item.Quantity}, \"lineTotal\": {item.LineTotal:F2}");
                
                if (!string.IsNullOrEmpty(item.Warning))
                {
                    Console.Write($", \"warning\": \"{item.Warning}\"");
                }
                
                Console.Write(" }");
                if (i < items.Count - 1) Console.WriteLine(",");
                else Console.WriteLine();
            }
            
            Console.Write("    ]");
            if (c < categories.Count - 1) Console.WriteLine(",");
            else Console.WriteLine();
        }
        Console.WriteLine("  },");
        
        Console.WriteLine($"  \"totals\": {{");
        Console.WriteLine($"    \"subtotal\": {result.Totals.Subtotal:F2},");
        Console.WriteLine($"    \"tax\": {result.Totals.Tax:F2},");
        Console.WriteLine($"    \"total\": {result.Totals.Total:F2}");
        Console.WriteLine("  }");
        Console.WriteLine("}");
    }
    
    public static void Main()
    {
        Test();
    }
}