import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model'; // Product model interface

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products: Product[] = []; // List of all products
  showModal: boolean = false; // Controls whether the modal is shown
  editingProduct: Product | null = null; // Product being edited (or null for new)
  formProduct: Product = this.getEmptyProduct(); // Form-bound product
  isLoggedIn: boolean = false; // Tracks whether the user is logged in

  // Lifecycle hook: runs when component initializes
  ngOnInit(): void {
    this.checkLoginStatus(); // Check login state
    
    const stored = localStorage.getItem('products');
    if (stored) {
      this.products = JSON.parse(stored);
    } else {
      // If no products in local storage, initialize with defaults
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
      this.updateLocalStorage();
    }
  }

  // Checks login state from localStorage
  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  // Returns a new empty product
  getEmptyProduct(): Product {
    return {
      id: Date.now(),
      name: '',
      description: '',
      color: '',
      price: 0,
      image: '',
    };
  }

  // Opens modal with form for add or edit
  openModal(product: Product | null = null): void {
    this.editingProduct = product;
    this.formProduct = product ? { ...product } : this.getEmptyProduct();
    this.showModal = true;
  }

  // Closes modal and resets editing state
  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  // Saves form product (new or edited)
  saveProduct(): void {
    if (this.editingProduct) {
      const index = this.products.findIndex(
        (p) => p.id === this.editingProduct?.id
      );
      this.products[index] = this.formProduct;
    } else {
      this.products.push(this.formProduct);
    }

    this.updateLocalStorage();
    this.closeModal();
  }

  // Deletes a product by ID
  deleteProduct(id: number): void {
    this.products = this.products.filter((p) => p.id !== id);
    this.updateLocalStorage();
  }

  // Saves product list to localStorage
  updateLocalStorage(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
