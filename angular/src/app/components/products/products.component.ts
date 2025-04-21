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
  constructor(private authService: AuthService) {}

  // Lifecycle hook: runs on component init
  ngOnInit(): void {
    // Subscribe to AuthService login state observable
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Update local isLoggedIn variable when login state changes
    });

    // Load products from localStorage if they exist
    const stored = localStorage.getItem('products');
    if (stored) {
      this.products = JSON.parse(stored);
    } else {
      // If no products in localStorage, use default seed data
      this.products = [
        {
          id: Date.now(),
          name: 'Lifting Club Hoodie',
          description: 'Oversized Fit',
          color: 'Black',
          price: 85,
          image:
            'https://cdn.shopify.com/s/files/1/0156/6146/files/GFXGymsharkLiftingClubHoodieGSBlack_GSPebbleGreyA1C8C-BB3L-0534_1664x.jpg?v=1728378671',
        },
        {
          id: Date.now() + 1,
          name: 'Camo Long Sleeve Top',
          description: 'Body Fit',
          color: 'Black-Grey',
          price: 42,
          image:
            'https://cdn.shopify.com/s/files/1/1367/5207/files/ADAPTCAMOSEAMLESSLSCROPTOPENG-L-A0146GSBlackGSAsphaltGreyB9A5A-BCNC4_1664x.jpg?v=1715768203',
        },
        {
          id: Date.now() + 2,
          name: 'Corset Seamless Sports Bra',
          description: 'Light Support',
          color: 'Lift Blue',
          price: 42,
          image:
            'https://cdn.shopify.com/s/files/1/1367/5207/files/LINEARSEAMLESSBRAGSLiftBlueB9A7P-UCVF4060_1664x.jpg?v=1728655024',
        },
        {
          id: Date.now() + 3,
          name: 'Scallop Hem Shaped Shorts',
          description: 'Regular Fit',
          color: 'Vintage Pink',
          price: 17,
          image:
            'https://cdn.shopify.com/s/files/1/1367/5207/files/ScallopHemLooseShortGSVintagePinkB8A9X-KB0V_1ee728eb-28d3-48b5-9a89-197bed0fc84e_1664x.jpg?v=1738061106',
        },
      ];
      this.updateLocalStorage(); // Save default data to localStorage
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
    this.editingProduct = product; // Set the product being edited (or null)
    this.formProduct = product ? { ...product } : this.getEmptyProduct(); // Use a copy to avoid changing the original object directly
    this.showModal = true; // Show the modal
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
