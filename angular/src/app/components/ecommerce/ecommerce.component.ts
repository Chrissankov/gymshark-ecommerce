// Component: Decorator to define the component
// OnInit: Lifecycle hook that runs when the component is initialized
// OnDestroy: Lifecycle hook that runs when the component is destroyed (used for cleanup)
import { Component, OnInit } from '@angular/core';

// Import the Product model interface
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-ecommerce', // HTML tag used to include this component
  standalone: false, // Indicates that this component is part of a module (not standalone)
  templateUrl: './ecommerce.component.html', // Link to the component's HTML template
  styleUrl: './ecommerce.component.scss' // Link to the component's styles
})
export class EcommerceComponent implements OnInit {
  // List of all products to display on the left section
  products: Product[] = [];

  // Object to keep track of selected products and their quantities
  // Format: { productId: { product, quantity } }
  selectedProducts: { [id: number]: { product: Product; quantity: number } } = {};

  // Lifecycle hook that runs when the component initializes
  ngOnInit(): void {
    // Get the product data from localStorage
    const stored = localStorage.getItem('products');

    // If data exists, parse it and shows the products
    if (stored) {
      this.products = JSON.parse(stored);
    }
  }

  // Toggle product selection (select if not selected, deselect if already selected)
  toggleSelection(product: Product): void {
    if (this.selectedProducts[product.id]) {
      // If already selected, remove it from the selectedProducts object
      delete this.selectedProducts[product.id];
    } else {
      // If not selected, add it with default quantity = 1
      this.selectedProducts[product.id] = { product, quantity: 1 };
    }
  }

  // Check if a product is currently selected
  isSelected(product: Product): boolean {
    return !!this.selectedProducts[product.id]; // Returns true if the product is selected
  }

  // Increase the quantity of a selected product
  increaseQuantity(product: Product): void {
    if (this.selectedProducts[product.id]) {
      this.selectedProducts[product.id].quantity++;
    }
  }

  // Decrease the quantity of a selected product (minimum quantity = 1)
  decreaseQuantity(product: Product): void {
    if (
      this.selectedProducts[product.id] &&
      this.selectedProducts[product.id].quantity > 1
    ) {
      this.selectedProducts[product.id].quantity--;
    }
  }

  // Get an array of the selected products and their quantities
  // Used to loop through in the checkout section
  get checkoutItems() {
    return Object.values(this.selectedProducts);
  }

  // Calculate the total price based on selected products and their quantities
  get totalPrice(): number {
    return this.checkoutItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
