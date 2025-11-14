import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService,JournalEntry } from '../services/journal';




@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.html',
  styleUrls: ['./journal.css']
})
export class JournalComponent implements OnInit {
  entries: JournalEntry[] = [];
  showFlashback = false;

  // Slideshow state
  isPlaying = false;
  currentIndex = 0;
  currentEntry: JournalEntry | null = null;
  slideshowInterval: any;

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.loadEntries();
  }

  /** Fetch all journal entries from backend */
  loadEntries() {
    this.journalService.getAll().subscribe({
      next: (data) => {
        this.entries = data.sort((a, b) => {
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        });
      },
      error: (err) => console.error('Failed to load journal entries:', err)
    });
  }

  /** Add a new entry and save it to backend */
  addEntry(city: string, comment: string, imageFile: File | null | undefined) {
    if (!city || !imageFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const entry: JournalEntry = {
        city,
        comment,
        image: reader.result as string,
        date: new Date().toISOString()
      };

      this.journalService.create(entry).subscribe({
        next: () => {
          this.loadEntries();
        },
        error: (err) => console.error('Failed to save entry:', err)
      });
    };

    reader.readAsDataURL(imageFile);
  }

  /** Delete an entry from backend */
  deleteEntry(id: number | undefined) {
    if (!id) return;
    this.journalService.delete(id).subscribe({
      next: () => this.loadEntries(),
      error: (err) => console.error('Failed to delete entry:', err)
    });
  }

  /** Group entries by city */
  getGroupedEntries(): Record<string, JournalEntry[]> {
    const groups: Record<string, JournalEntry[]> = {};
    this.entries.forEach(entry => {
      if (!groups[entry.city]) groups[entry.city] = [];
      groups[entry.city].push(entry);
    });
    return groups;
  }

  /** List of unique cities */
  getCities(): string[] {
    return Object.keys(this.getGroupedEntries());
  }

  /** Start slideshow of all memories */
  startSlideshow() {
    if (this.entries.length === 0) return;

    this.showFlashback = true;
    this.isPlaying = true;
    this.currentIndex = 0;
    this.currentEntry = this.entries[this.currentIndex];

    this.slideshowInterval = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.entries.length) this.currentIndex = 0;
      this.currentEntry = this.entries[this.currentIndex];
    }, 3000);
  }

  /** Pause slideshow */
  pauseSlideshow() {
    this.isPlaying = false;
    clearInterval(this.slideshowInterval);
  }

  /** Stop slideshow */
  stopSlideshow() {
    this.isPlaying = false;
    this.showFlashback = false;
    clearInterval(this.slideshowInterval);
    this.currentIndex = 0;
    this.currentEntry = null;
  }
}
