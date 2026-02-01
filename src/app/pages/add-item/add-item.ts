import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  LucideAngularModule,
  ScanBarcode,
  Upload,
  X,
} from 'lucide-angular';
import { ClickOutsideDirective } from '../../directives/click-outside';
import * as Papa from 'papaparse';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { InventoryService } from '../../services/inventory-service';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';

@Component({
  selector: 'app-add-item',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxCountriesDropdownModule,
    LucideAngularModule,
    ClickOutsideDirective,
  ],
  templateUrl: './add-item.html',
  styleUrl: './add-item.css',
})
export class AddItem {
  readonly Upload = Upload;
  readonly Scanner = ScanBarcode;
  readonly Close = X;
  readonly Check = Check;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly Loading = Loader2;
  selectedFileName: string | null = null;
  uploadAreaVisible = false;
  processingCSVFile = false;
  csvFile: File | null = null;
  parsedData: any = [];
  visibleSection: number = 1;

  form = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    expiry: new FormControl(''),
    quantity: new FormControl(1),
    price: new FormControl(0),
    tags: new FormControl(''),
    barcode: new FormControl(''),
    consumed: new FormControl(false),
  });

  categories = ['Food', 'Electronics', 'Clothing', 'Household', 'Other'];

  constructor(private inventory: InventoryService) {}

  onBulkFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.csvFile = file;
    if (!file) return;

    this.selectedFileName = file.name;
  }

  addManual() {
    const form = this.form;
    const item = {
      name: form.get('name')?.value ?? '',
      category: form.get('category')?.value ?? '',
      expiry: form.get('expiry')?.value ?? null,
      quantity: form.get('quantity')?.value ?? 1,
      price: form.get('price')?.value ?? 0,
      tags: form.get('tags')?.value ?? '',
      barcode: form.get('barcode')?.value ?? '',
      consumed: form.get('consumed')?.value ?? false,
    };
    this.inventory.setItem(item);
    this.form.reset({
      name: '',
      category: '',
      expiry: '',
      quantity: 1,
      price: 0,
      tags: '',
      barcode: '',
      consumed: false,
    });
  }

  toggleUploadArea() {
    this.uploadAreaVisible = !this.uploadAreaVisible;
  }

  toggelFormSection(Section: number) {
    this.visibleSection = Section;
  }

  handleCsvFile() {
    this.processingCSVFile = true;
    const file = this.csvFile;
    if (!file) {
      this.processingCSVFile = false;
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        this.parsedData = result.data;
        this.processingCSVFile = false;
        console.log('Parsed CSV Data:', this.parsedData);
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        this.processingCSVFile = false;
      },
    });
  }
}
