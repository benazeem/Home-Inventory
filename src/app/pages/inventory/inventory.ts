import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
})
export class Inventory {
  search = signal('');
  category = signal('All');
  sortBy = signal('expiry');

  items = signal([
    { name: 'Milk', category: 'Dairy', expires: '2025-02-12', quantity: 1 },
    { name: 'Eggs', category: 'Dairy', expires: '2025-03-01', quantity: 12 },
    { name: 'Bread', category: 'Bakery', expires: '2025-02-04', quantity: 2 },
    { name: 'Apples', category: 'Fruit', expires: '2025-03-15', quantity: 6 },
    { name: 'Paneer', category: 'Dairy', expires: '2025-02-18', quantity: 1 },
    { name: 'Yogurt', category: 'Dairy', expires: '2025-02-10', quantity: 3 },
  ]);

  isExpired(item: { expires: string | Date }): boolean {
    return new Date(item.expires) < new Date();
  }

  categories = ['All', 'Dairy', 'Bakery', 'Fruit'];

  filtered = computed(() => {
    let result = [...this.items()];

    // search
    if (this.search().trim()) {
      result = result.filter((i) => i.name.toLowerCase().includes(this.search().toLowerCase()));
    }

    // category filter
    if (this.category() !== 'All') {
      result = result.filter((i) => i.category === this.category());
    }

    // sorting
    if (this.sortBy() === 'expiry') {
      result.sort((a, b) => +new Date(a.expires) - +new Date(b.expires));
    }
    if (this.sortBy() === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  });
}
