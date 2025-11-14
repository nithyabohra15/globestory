import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators ,FormGroup} from '@angular/forms';
import { Chart, ChartOptions, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsService,Trip } from '../services/analytics';




@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    // NgChartsModule is no longer needed!
  ],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css'] // Optional if the file is missing
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  trips: Trip[] = [];
  insights: string[] = [];

  tripForm!: FormGroup; // ✅ declared but initialized in constructor

  chartData: ChartData<'scatter'> = {
    datasets: [
      {
        label: 'Trips',
        data: [],
        pointBackgroundColor: [],
        pointRadius: 8,
        pointHoverRadius: 12
      }
    ]
  };

  chartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Cost (₹)' } },
      y: { title: { display: true, text: 'Happiness (1–10)' }, min: 0, max: 10 }
    }
  };

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService
  ) {
    // ✅ Initialize form inside constructor (no more "used before init" warning)
    this.tripForm = this.fb.group({
      destination: ['', Validators.required],
      cost: [null, [Validators.required, Validators.min(1)]],
      happiness: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      type: ['', Validators.required]
    });
  }

ngAfterViewInit() {
  setTimeout(() => {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'scatter',
      data: this.chartData,
      options: this.chartOptions
    });

    this.loadTrips();
  }, 0);
}


  loadTrips() {
    this.analyticsService.getAll().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.updateChart();
        this.generateInsights();
      },
      error: (err) => console.error('Error loading trips', err)
    });
  }

  addTrip() {
    if (this.tripForm.valid) {
      const newTrip: Trip = this.tripForm.value;
      this.analyticsService.create(newTrip).subscribe({
        next: () => {
          this.loadTrips();
          this.tripForm.reset();
        },
        error: (err) => console.error('Error adding trip', err)
      });
    }
  }

  deleteTrip(id: number) {
    this.analyticsService.delete(id).subscribe({
      next: () => this.loadTrips(),
      error: (err) => console.error('Error deleting trip', err)
    });
  }

  updateChart() {
    this.chart.data = {
      datasets: [
        {
          label: 'Trips',
          data: this.trips.map(t => ({ x: t.cost, y: t.happiness })),
          pointBackgroundColor: this.trips.map(t =>
            t.type.toLowerCase() === 'beach' ? '#4fc3f7' : '#ffb74d'
          ),
          pointRadius: 8,
          pointHoverRadius: 12
        }
      ]
    };
    this.chart.update();
  }

  generateInsights() {
    const insights: string[] = [];

    if (this.trips.length > 0) {
      const avgCost = this.trips.reduce((a, b) => a + b.cost, 0) / this.trips.length;
      const happiest = this.trips.reduce((a, b) => (a.happiness > b.happiness ? a : b));

      if (avgCost < 15000) insights.push('Your happiest trips cost under ₹15,000.');
      insights.push(`Your top-rated trip was ${happiest.destination} with a score of ${happiest.happiness}.`);

      const beachTrips = this.trips.filter(t => t.type.toLowerCase() === 'beach');
      const cityTrips = this.trips.filter(t => t.type.toLowerCase() === 'city');

      const avgBeach = beachTrips.length ? beachTrips.reduce((a, b) => a + b.happiness, 0) / beachTrips.length : 0;
      const avgCity = cityTrips.length ? cityTrips.reduce((a, b) => a + b.happiness, 0) / cityTrips.length : 0;

      if (avgBeach > avgCity) insights.push('You find higher joy in beach trips than city trips.');
      else if (avgCity > avgBeach) insights.push('You enjoy city trips more than beaches.');
    }

    this.insights = insights;
  }
}
