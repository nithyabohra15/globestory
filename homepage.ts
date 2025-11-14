import { Component,AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink,FormsModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class HomepageComponent implements AfterViewInit {
  
  // Features array (used in Features section)
  features = [
    { title: "Travel Journal + Map", desc: "Pin destinations, add diaries, galleries & trip ratings." },
    { title: "Smart Analytics", desc: "Visualize cost vs happiness and track ROI of your adventures." },
    { title: "Budgeter", desc: "Plan ahead, monitor expenses, and get smart alerts on overspending." },
    { title: "Packing List", desc: "AI-powered packing lists based on weather, duration, and activities." },
    { title: "Visa Manager", desc: "Upload & manage travel visas, auto-check expiry, and reminders." }
  ];

  ngAfterViewInit(): void {
    // Fade-in on scroll
    window.addEventListener('scroll', () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('visible');
        }
      });
    });
  }
}

