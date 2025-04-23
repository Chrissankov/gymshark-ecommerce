import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form-dialog',
  standalone: false,
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.scss'],
})
export class ProductFormDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.productForm = this.fb.group({
      id: [data?.id || Date.now()],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      color: [data?.color || '', Validators.required],
      price: [data?.price || 0, [Validators.required, Validators.min(0.01)]],
      image: [data?.image || ''],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>
        this.productForm.patchValue({ image: reader.result });
      reader.readAsDataURL(input.files[0]);
    }
  }

  save(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
