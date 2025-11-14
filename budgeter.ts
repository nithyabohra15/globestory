import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BudgetService,BudgetCategory } from '../services/budget';

@Component({
  selector: 'app-budgeter',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './budgeter.html',
  styleUrls: ['./budgeter.css']
})
export class BudgeterComponent implements OnInit {
  // --- Trip details ---
  tripDetails = { startDate: '', endDate: '' };
  get nights(): number {
    if (!this.tripDetails.startDate || !this.tripDetails.endDate) return 0;
    const start = new Date(this.tripDetails.startDate);
    const end = new Date(this.tripDetails.endDate);
    return Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
  }

  // --- Travellers ---
  travellers = { adults: 0, children: 0, pets: 0 };

  // --- Currency ---
  currency = {
    base: '',
    target: '',
    rate: 0,
    amount: 0
  };

  get convertedAmount(): number {
    if (!this.currency.rate || !this.currency.amount) return 0;
    return Number(this.currency.amount) * Number(this.currency.rate);
  }

  // --- Tasks ---
  tasks: { name: string; value: number }[] = [];
  newTask = '';
  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ name: this.newTask, value: 0 });
      this.newTask = '';
    }
  }
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  // --- Budget ---
  totalBudget = 0;
  categories: BudgetCategory[] = [];
  newCategory = { name: '', budget: 0, actual: 0 };

  constructor(private budgetService: BudgetService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.budgetService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => ({
          ...cat,
          budget: Number(cat.budget) || 0,
          actual: Number(cat.actual) || 0
        }));
        this.updateChart();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  addCategory() {
    if (!this.newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const newCat: BudgetCategory = {
      name: this.newCategory.name,
      budget: Number(this.newCategory.budget) || 0,
      actual: Number(this.newCategory.actual) || 0
    };

    this.budgetService.create(newCat).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategory = { name: '', budget: 0, actual: 0 };
      },
      error: (err) => console.error('Error adding category:', err)
    });
  }

  updateCategory(cat: BudgetCategory) {
    if (!cat.id) return;

    const payload: BudgetCategory = {
      id: cat.id,
      name: cat.name,
      budget: Number(cat.budget) || 0,
      actual: Number(cat.actual) || 0
    };

    this.budgetService.update(cat.id, payload).subscribe({
      next: () => this.updateChart(),
      error: (err) => console.error('Error updating category:', err)
    });
  }

  deleteCategory(index: number) {
    const cat = this.categories[index];
    if (cat.id) {
      this.budgetService.delete(cat.id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Error deleting category:', err)
      });
    } else {
      this.categories.splice(index, 1);
      this.updateChart();
    }
  }

  getDifference(cat: BudgetCategory): number {
    return (Number(cat.budget) || 0) - (Number(cat.actual) || 0);
  }

  get totalSpent(): number {
    return this.categories.reduce((acc, cat) => acc + (Number(cat.actual) || 0), 0);
  }

  get remaining(): number {
    const total = Number(this.totalBudget) || 0;
    return total - this.totalSpent;
  }

  // --- Chart ---
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#FF9AA2', '#A2D2FF'],
        borderWidth: 0
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: true, position: 'bottom' } }
  };

  public doughnutChartType: 'doughnut' = 'doughnut';

  updateChart() {
    const spent = this.totalSpent || 0;
    const remaining = this.remaining || 0;
    this.doughnutChartData.datasets[0].data = [spent, remaining];
    this.doughnutChartData = { ...this.doughnutChartData }; // force refresh
  }
}