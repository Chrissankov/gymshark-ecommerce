import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showModal = false;
  editingProduct: Product | null = null;
  formProduct: Product = this.getEmptyProduct();

  ngOnInit(): void {
    const stored = localStorage.getItem('products');
    if (stored) {
      this.products = JSON.parse(stored);
    } else {
      // Default products
      this.products = [
        {
          id: Date.now(),
          name: 'Lifting Club Hoodie',
          description: 'Oversized Fit',
          color: 'Beige',
          price: 85,
          image: 'https://cdn.shopify.com/s/files/1/0156/6146/files/GFXGymsharkLiftingClubHoodieGSBlack_GSPebbleGreyA1C8C-BB3L-0534_1664x.jpg?v=1728378671'
        },
        {
          id: Date.now() + 1,
          name: 'Camo Long Sleeve Top',
          description: 'Body Fit',
          color: 'Black-Grey',
          price: 42,
          image: 'https://cdn.shopify.com/s/files/1/1367/5207/files/ADAPTCAMOSEAMLESSLSCROPTOPENG-L-A0146GSBlackGSAsphaltGreyB9A5A-BCNC4_1664x.jpg?v=1715768203'
        }
      ];
      this.updateLocalStorage();
    }
  }

  getEmptyProduct(): Product {
    return {
      id: Date.now(),
      name: '',
      description: '',
      color: '',
      price: 0,
      image: ''
    };
  }

  openModal(product: Product | null = null): void {
    this.editingProduct = product;
    this.formProduct = product ? { ...product } : this.getEmptyProduct();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  saveProduct(): void {
    if (this.editingProduct) {
      const index = this.products.findIndex(p => p.id === this.editingProduct?.id);
      this.products[index] = this.formProduct;
    } else {
      this.products.push(this.formProduct);
    }

    this.updateLocalStorage();
    this.closeModal();
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.updateLocalStorage();
  }

  updateLocalStorage(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}