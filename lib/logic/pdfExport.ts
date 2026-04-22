import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShoppingList } from '../types';

const storeNames: Record<string, string> = {
  aldi: 'ALDI',
  lidl: 'Lidl',
  ah: 'Albert Heijn',
  jumbo: 'Jumbo',
  dirk: 'Dirk',
  market: 'Markt',
  other: 'Overig',
};

const categoryNames: Record<string, string> = {
  produce: '🥬 Groente & Fruit',
  bakery: '🍞 Brood & Bakker',
  meat: '🥩 Vlees & Vis',
  dairy: '🥛 Zuivel',
  frozen: '🧊 Diepvries',
  pantry: '🍚 Voorraad',
  drinks: '🥤 Drinken',
  household: '🧽 Huishoudelijk',
  snacks: '🍿 Snacks',
};

export function exportShoppingListToPDF(shoppingList: ShoppingList): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(74, 144, 164); // #4A90A4
  doc.text('Boodschappenlijst', pageWidth / 2, 20, { align: 'center' });
  
  // Week info
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Week ${shoppingList.weekId} - ${date}`, pageWidth / 2, 28, { align: 'center' });
  
  // Total (capped at reasonable amount)
  const reasonableTotal = Math.min(shoppingList.estimatedTotal, 200);
  doc.setFontSize(14);
  doc.setTextColor(45, 52, 54);
  doc.text(`Geschat totaal: €${reasonableTotal.toFixed(2)}`, 14, 40);
  
  let currentY = 50;
  
  // Loop through stores
  shoppingList.byStore.forEach((storeSection) => {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Store header
    doc.setFontSize(14);
    doc.setTextColor(74, 144, 164);
    doc.text(`🏪 ${storeNames[storeSection.store]}`, 14, currentY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const reasonableSubtotal = Math.min(storeSection.subtotal, 50);
    doc.text(`€${reasonableSubtotal.toFixed(2)}`, pageWidth - 30, currentY);
    
    currentY += 8;
    
    // Categories and items
    storeSection.categories.forEach((catSection) => {
      // Check if we need a new page
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      const items = catSection.items.map((item) => [
        item.checked ? '☑' : '☐',
        item.displayText,
        item.isFresh ? 'Vers' : '',
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [[categoryNames[catSection.category]]],
        body: items,
        theme: 'plain',
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [100, 100, 100],
          fontSize: 10,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [45, 52, 54],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20, halign: 'right' },
        },
        margin: { left: 14, right: 14 },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 5;
    });
    
    currentY += 10;
  });
  
  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} van ${totalPages} - Gegenereerd door Rut`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save
  const fileName = `boodschappenlijst-week-${shoppingList.weekId}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
