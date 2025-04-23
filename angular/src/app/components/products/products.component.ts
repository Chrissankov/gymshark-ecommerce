// Component: Decorator to define the component
// OnInit: Lifecycle hook that runs when the component is initialized
// OnDestroy: Lifecycle hook that runs when the component is destroyed (used for cleanup)
import { Component, OnInit, OnDestroy } from '@angular/core';

// Importing the Product interface (custom type) to define product structure
import { Product } from '../../models/product.model';

// Importing the authentication service to react to login status
import { AuthService } from '../../services/auth.service';

// Subscription is used to manage and clean up observable subscriptions (avoid memory leaks)
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';

// 🔽 Component metadata
@Component({
  selector: 'app-products', // Tag used in templates to render this component
  standalone: false, // It's part of a module, not standalone
  templateUrl: './products.component.html', // External HTML file for layout
  styleUrl: './products.component.scss', // External SCSS file for styles
})

// Main component class
export class ProductsComponent implements OnInit, OnDestroy {
  // Component state
  products: Product[] = []; // Array to hold all product objects
  showModal: boolean = false; // Controls visibility of the modal
  editingProduct: Product | null = null; // Stores the product being edited (if any)
  formProduct: Product = this.getEmptyProduct(); // Product object bound to the modal form
  isLoggedIn: boolean = false; // Tracks if user is logged in (from AuthService)

  // Holds subscription to login state observable (will be unsubscribed on destroy)
  private authSubscription!: Subscription;

  // Inject services
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  // Lifecycle hook: runs on component init
  ngOnInit(): void {
    // Subscribe to AuthService login state observable
    this.authSubscription = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status; // Update local isLoggedIn variable when login state changes
    });

    // Load products from localStorage if they exist
    const stored = localStorage.getItem('products');
    if (stored) {
      this.products = JSON.parse(stored);
    }
  }

  // Lifecycle hook: runs on component destroy
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    // Unsubscribes from login observable to prevent memory leaks
  }

  // Returns an empty product template
  getEmptyProduct(): Product {
    return {
      id: Date.now(), // Generates a unique timestamp ID
      name: '',
      description: '',
      color: '',
      price: 0,
      image: '',
    };
  }

  // Opens the modal with a product (for edit) or empty (for add)
  openModal(product: Product | null = null): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '400px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result) {
        if (product) {
          const index = this.products.findIndex((p) => p.id === product.id);
          this.products[index] = result;
        } else {
          this.products.push(result);
        }
        this.updateLocalStorage();
      }
    });
  }

  // Read the image as base64 and store it in formProduct.image
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.formProduct.image = base64String;
      };

      reader.readAsDataURL(file);
    }
  }

  // Closes the modal and clears editing state
  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  // Saves a new or edited product
  saveProduct(): void {
    if (this.editingProduct) {
      // If editing, find and replace the existing product
      const index = this.products.findIndex(
        (p) => p.id === this.editingProduct?.id
      );
      this.products[index] = this.formProduct;
    } else {
      // If adding a new product, push to array
      this.products.push(this.formProduct);
    }

    this.updateLocalStorage(); // Sync to localStorage
    this.closeModal(); // Hide modal
  }

  // Deletes a product by ID
  deleteProduct(id: number): void {
    // Filters out the deleted product
    this.products = this.products.filter((p) => p.id !== id);
    this.updateLocalStorage(); // Sync to localStorage
  }

  // Saves the product list to localStorage
  updateLocalStorage(): void {
    // Converts array to string and saves under 'products' key
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
