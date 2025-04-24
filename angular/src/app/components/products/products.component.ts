// Component: Decorator to define the component
// OnInit: Lifecycle hook that runs when the component is initialized
// OnDestroy: Lifecycle hook that runs when the component is destroyed (used for cleanup)
import { Component, OnInit, OnDestroy } from '@angular/core';

// Importing the Product interface (custom type) to define product structure
import { Product } from '../../models/product.model';

// Importing the authentication service to react to login status
import { AuthService } from '../../services/auth.service';

// Importing to manage observable subscriptions.
import { Subscription } from 'rxjs';

// Angular Material dialog service.
import { MatDialog } from '@angular/material/dialog';

// Dialog component for product form.
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
  products: Product[] = []; // Array to hold all product entries.
  showModal: boolean = false; // Controls display of modal.
  editingProduct: Product | null = null; // Product being edited.
  formProduct: Product = this.getEmptyProduct(); // Form-bound product model.
  isLoggedIn: boolean = false; // Reflects current user login state.
  private authSubscription!: Subscription; // Stores subscription to login status. '!:' means that this variable will definitely be assigned a value later, so don't flag it as potentially uninitialized.

  // Inject services
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  // Lifecycle hook: runs on component init
  ngOnInit(): void {
    // Subscribe to AuthService login state observable
    this.authSubscription = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status; // Update isLoggedIn variable when login state changes
    });

    // Load saved products from localStorage
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

    // After dialog closes, either update or add a product
    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result) {
        if (product) {
          const index = this.products.findIndex((p) => p.id === product.id);
          this.products[index] = result;
        } else {
          this.products.push(result);
        }
        this.updateLocalStorage(); // Save changes
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
    this.products = this.products.filter((p) => p.id !== id); // Filters out the deleted product
    this.updateLocalStorage(); // Sync to localStorage
  }

  // Saves the product list to localStorage
  updateLocalStorage(): void {
    // Converts array to string and saves under 'products' key
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
