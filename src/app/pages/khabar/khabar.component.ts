import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-khabar',
  imports: [CommonModule, FormsModule],
  templateUrl: './khabar.component.html',
  styleUrl: './khabar.component.css'
})
export class KhabarComponent {
officeMenu = ['Murgi', 'Fish', 'Egg', 'Goru', 'Fish', 'Murgi'];
  homeMenu = ['Egg', 'Murgi', 'Murgi', 'Egg', 'Murgi', 'Fish', 'Murgi']; // রাতের খাওয়া
  homeFridayLunch = 'Goru'; // শুক্রবার দুপুরে গরু

  officePeople = 18;
  homePeople = 6;

  officeSummary: any[] = [];
  homeSummary: any[] = [];
  totalSummary: any[] = [];

  ngOnInit(): void {
    this.officeSummary = this.calculateSummary(this.officeMenu, this.officePeople);

    // বাড়ির খাওয়া = 7 দিনের রাত + শুক্রবার দুপুর
    const homeMenuWithFriday = [...this.homeMenu, this.homeFridayLunch];
    this.homeSummary = this.calculateSummary(homeMenuWithFriday, this.homePeople);

    this.totalSummary = this.mergeSummaries(this.officeSummary, this.homeSummary);
  }

  calculateSummary(menu: string[], people: number) {
    const result: { [key: string]: number } = {};

    const qtyMap: any = {
      'Murgi': { perPerson: 0.15, unit: 'kg' },
      'Fish': { perPerson: 0.15, unit: 'kg' },
      'Goru': { perPerson: 0.12, unit: 'kg' },
      'Egg': { perPerson: 1, unit: 'pcs' }
    };

    menu.forEach(item => {
      const def = qtyMap[item];
      const total = def.perPerson * people;
      result[item] = (result[item] || 0) + total;
    });

    return Object.keys(result).map(key => ({
      name: key,
      qty: result[key],
      unit: qtyMap[key].unit
    }));
  }

  mergeSummaries(office: any[], home: any[]) {
    const combined: { [key: string]: { qty: number, unit: string } } = {};

    [...office, ...home].forEach(item => {
      if (!combined[item.name]) {
        combined[item.name] = { qty: item.qty, unit: item.unit };
      } else {
        combined[item.name].qty += item.qty;
      }
    });

    return Object.keys(combined).map(key => ({
      name: key,
      qty: combined[key].qty,
      unit: combined[key].unit
    }));
  }
// ✅ Export to PDF
  exportAsPDF() {
    const element = document.getElementById('summary-content');
    if (!element) return;

    html2canvas(element, {
      scale: 2,       // better resolution
      useCORS: true,
      backgroundColor: '#ffffff' // force white background for pdf
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Khabar-Summary.pdf');
    });
  }
}