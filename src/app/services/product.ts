import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductFromBarcode(barcode: string): Observable<any> {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    return this.http.get(url);
  }
}
