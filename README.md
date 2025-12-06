# 📚 Vocabulary Table Generator

A modern web application to generate, manage, and export vocabulary tables with English words and their Hindi meanings. Built with React, Vite, and Material-UI.

## ✨ Features

- **Smart Word Parsing**: Automatically parse vocabulary entries with synonyms and multiple meanings
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Multiple Export Formats**: Export your vocabulary tables to:
  - 📄 PDF
  - 📝 Word (DOCX)
  - 📊 Excel (XLSX)
  - 📋 Clipboard (Copy to paste anywhere)
- **Pagination**: Easy navigation through large vocabulary lists
- **Real-time Preview**: See your vocabulary table as you generate it
- **Hindi Support**: Full support for Devanagari script

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gyasuddin0786/vocab-app
cd vocab-app/vocab-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### Input Format

Enter your vocabulary in the following format:

```
Word = Synonym1, Synonym2 (meaning1, meaning2, meaning3)
```

### Example Input

```
Edge = Border, Limit (किनारा, सीमा, सीमा), Luscious = Tasty, Juicy (स्वादिष्ट, स्वादिष्ट, रसीला)
```

### Steps to Generate Table

1. **Enter Words**: Paste or type your vocabulary entries in the text area
2. **Generate**: Click the "Generate Table" button
3. **View**: See your formatted vocabulary table with 3 words per row
4. **Export**: Choose your preferred export format (PDF, Word, Excel, or Copy)

## 🛠️ Built With

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **pdfmake** - PDF generation
- **docx** - Word document generation
- **xlsx** - Excel file generation
- **file-saver** - File download utility

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📂 Project Structure

```
vocab-app/
├── public/
│   ├── NotoSansDevanagari-Regular.ttf
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx  # Main application component
│   ├── fonts.js
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Features in Detail

### Table Generation
- Automatically groups words into rows of 3
- Assigns meanings to each word intelligently
- Handles multiple synonyms and meanings

### Export Options

#### PDF Export
- Landscape orientation for better readability
- Professional table layout with alternating row colors
- Unicode support for Hindi text

#### Word Export
- Clean, formatted tables
- Compatible with Microsoft Word and Google Docs
- Preserves Hindi characters

#### Excel Export
- Structured spreadsheet format
- Adjustable column widths
- Easy to edit and share

#### Copy to Clipboard
- Tab-separated format
- Ready to paste into any application
- Preserves table structure
#### Images 
- <img width="1885" height="632" alt="image" src="https://github.com/user-attachments/assets/ecc56ffe-6a85-4394-bc93-1f0c80575a84" />

- <img width="1868" height="898" alt="image" src="https://github.com/user-attachments/assets/6d052c91-e93a-4b03-9149-865377c8823e" />

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author 
- Gyasuddin Ansari

Created with ❤️ for vocabulary learners

## 🙏 Acknowledgments

- Material-UI for the beautiful components
- pdfmake, docx, and xlsx libraries for export functionality
- React and Vite communities

---

## हिंदी में जानकारी

### विशेषताएं
- अंग्रेजी शब्दों और हिंदी अर्थों के साथ vocabulary table बनाएं
- PDF, Word, Excel में export करें
- आसान और सुंदर interface
- Hindi Devanagari script का पूर्ण समर्थन

### उपयोग कैसे करें
1. Text box में अपने शब्द enter करें
2. "Generate Table" button पर click करें
3. अपनी table देखें और export करें

### Format
```
शब्द = पर्यायवाची1, पर्यायवाची2 (अर्थ1, अर्थ2, अर्थ3)
```

---

**Happy Learning! 📚✨**
