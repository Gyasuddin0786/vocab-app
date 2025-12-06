import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Box, Fade, Slide, IconButton, Chip,
  Card, CardContent, Grid, Pagination, Snackbar, Alert, CircularProgress
} from '@mui/material';
import {
  Download, ContentCopy, PictureAsPdf, Description, TableChart,
  AutoAwesome, Visibility
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType } from 'docx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

// Configure pdfMake with fonts that support Unicode
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

function App() {
  const [inputText, setInputText] = useState('');
  const [vocabList, setVocabList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const recordsPerPage = 10;

  const handleGenerate = async () => {
    setLoading(true);
    const text = inputText.trim();
    const allWords = [];
    
    // Split by comma followed by space and word pattern
    const entries = text.split(/,\s+(?=[A-Za-z\s]+=)/).filter(entry => entry.trim());
    
    entries.forEach((entry) => {
      if (entry.includes('=') && entry.includes('(')) {
        // Extract meanings from parentheses
        const hindiMatch = entry.match(/\(([^)]+)\)/);
        const meanings = hindiMatch ? hindiMatch[1].split(',').map(h => h.trim()) : [];
        
        // Remove meaning part
        const withoutHindi = entry.replace(/\s*\([^)]+\)\s*/, '').trim();
        const parts = withoutHindi.split('=');
        
        if (parts.length >= 2) {
          const mainWord = parts[0].trim();
          const synonyms = parts[1].split(',').map(s => s.trim()).filter(s => s);
          const allEnglishWords = [mainWord, ...synonyms];
          
          // Assign meanings to words
          allEnglishWords.forEach((word, index) => {
            if (word) {
              const meaning = meanings[index] || meanings[0] || '';
              allWords.push({ word, meaning });
            }
          });
        }
      }
    });
    
    // Group words into rows of 3
    const result = [];
    for (let i = 0; i < allWords.length; i += 3) {
      const group = allWords.slice(i, i + 3);
      result.push({
        sno: result.length + 1,
        english1: group[0] ? group[0].word : '',
        hindi1: group[0] ? group[0].meaning : '',
        english2: group[1] ? group[1].word : '',
        hindi2: group[1] ? group[1].meaning : '',
        english3: group[2] ? group[2].word : '',
        hindi3: group[2] ? group[2].meaning : ''
      });
    }

    setTimeout(() => {
      setVocabList(result);
      setLoading(false);
      setSnackbar({ open: true, message: `Generated ${allWords.length} words in ${result.length} rows!`, severity: 'success' });
    }, 1000);
  };

  const handleCopyAll = async () => {
    const headers = ['S.No', 'English', 'Hindi', 'English', 'Hindi', 'English', 'Hindi'];
    const rows = vocabList.map(item => [
      item.sno, item.english1, item.hindi1, item.english2, item.hindi2, item.english3, item.hindi3
    ]);
    const tableText = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
    
    await navigator.clipboard.writeText(tableText);
    setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
  };

  const exportToPDF = () => {
    try {
      const tableBody = [
        // Header row
        [
          { text: 'S.No', style: 'tableHeader' },
          { text: 'English', style: 'tableHeader' },
          { text: 'Hindi', style: 'tableHeader' },
          { text: 'English', style: 'tableHeader' },
          { text: 'Hindi', style: 'tableHeader' },
          { text: 'English', style: 'tableHeader' },
          { text: 'Hindi', style: 'tableHeader' }
        ],
        // Data rows
        ...vocabList.map(item => [
          { text: item.sno.toString(), style: 'tableCell' },
          { text: item.english1 || '', style: 'tableCell' },
          { text: item.hindi1 || '', style: 'tableCellHindi' },
          { text: item.english2 || '', style: 'tableCell' },
          { text: item.hindi2 || '', style: 'tableCellHindi' },
          { text: item.english3 || '', style: 'tableCell' },
          { text: item.hindi3 || '', style: 'tableCellHindi' }
        ])
      ];

      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
        content: [
          {
            text: 'Vocabulary Table',
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['8%', '15%', '15%', '15%', '15%', '15%', '17%'],
              body: tableBody
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#3f51b5' : (rowIndex % 2 === 0 ? '#f5f5f5' : null);
              },
              hLineWidth: function () { return 1; },
              vLineWidth: function () { return 1; },
              hLineColor: function () { return '#cccccc'; },
              vLineColor: function () { return '#cccccc'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            font: 'Roboto'
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white',
            alignment: 'center',
            font: 'Roboto'
          },
          tableCell: {
            fontSize: 9,
            alignment: 'center',
            font: 'Roboto'
          },
          tableCellHindi: {
            fontSize: 11,
            alignment: 'center',
            font: 'Roboto',
            lineHeight: 1.2
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };

      pdfMake.createPdf(docDefinition).download('VocabularyTable.pdf');
      setSnackbar({ open: true, message: 'PDF exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('PDF export error:', error);
      setSnackbar({ open: true, message: 'PDF export failed!', severity: 'error' });
    }
  };

  const exportToWord = async () => {
    try {
      const cleanText = (text) => {
        if (!text) return '';
        return text.toString()
          .replace(/&gt;/g, '')
          .replace(/&lt;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();
      };

      const rows = [
        new DocxTableRow({
          children: ['S.No', 'English', 'Hindi', 'English', 'Hindi', 'English', 'Hindi']
            .map(text => new DocxTableCell({ 
              children: [new Paragraph({ text: cleanText(text), bold: true })],
              width: { size: text === 'S.No' ? 10 : 15, type: WidthType.PERCENTAGE }
            }))
        }),
        ...vocabList.map(item => new DocxTableRow({
          children: [
            cleanText(item.sno),
            cleanText(item.english1),
            cleanText(item.hindi1),
            cleanText(item.english2),
            cleanText(item.hindi2),
            cleanText(item.english3),
            cleanText(item.hindi3)
          ].map((text, index) => new DocxTableCell({ 
            children: [new Paragraph({ 
              text: text,
              font: 'Arial Unicode MS'
            })],
            width: { size: index === 0 ? 10 : 15, type: WidthType.PERCENTAGE }
          }))
        }))
      ];

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: [
            new Paragraph({ 
              text: 'Vocabulary Table', 
              heading: 'Heading1',
              spacing: { after: 200 }
            }),
            new DocxTable({ 
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
                insideHorizontal: { style: 'single', size: 1 },
                insideVertical: { style: 'single', size: 1 },
              }
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'VocabularyTable.docx');
      setSnackbar({ open: true, message: 'Word document exported!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Word export failed!', severity: 'error' });
    }
  };

  const exportToExcel = () => {
    const headers = ['S.No', 'English', 'Hindi', 'English', 'Hindi', 'English', 'Hindi'];
    const data = vocabList.map(item => [
      item.sno, item.english1, item.hindi1, item.english2, item.hindi2, item.english3, item.hindi3
    ]);
    
    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vocabulary');
    XLSX.writeFile(wb, 'VocabularyTable.xlsx');
    setSnackbar({ open: true, message: 'Excel file exported!', severity: 'success' });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = vocabList.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(vocabList.length / recordsPerPage);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={1000}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h5" align="center" sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}>
            <AutoAwesome sx={{ mr: 2, fontSize: 40 }} />
            Vocabulary Table Generator
          </Typography>
        </Paper>
      </Fade>

      <Slide direction="up" in timeout={1200}>
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              label="Enter Vocabulary Words"
              placeholder="Enter comma-separated entries with multiple meanings:\n\nFormat: Word = Synonym1, Synonym2 (meaning1, meaning2, meaning3)\n\nExample:\nEdge = Border, Limit (किनारा, सीमा, सीमा), Luscious = Tasty, Juicy (स्वादिष्ट, स्वादिष्ट, रसीला)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={loading || !inputText.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <Visibility />}
                sx={{ borderRadius: 3, px: 4 }}
              >
                {loading ? 'Generating...' : 'Generate Table'}
              </Button>
              
              {vocabList.length > 0 && (
                <Fade in timeout={500}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyAll} sx={{ borderRadius: 3 }}>
                      Copy All
                    </Button>
                    <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={exportToPDF} sx={{ borderRadius: 3 }}>
                      Export PDF
                    </Button>
                    <Button variant="outlined" startIcon={<Description />} onClick={exportToWord} sx={{ borderRadius: 3 }}>
                      Export Word
                    </Button>
                    <Button variant="outlined" startIcon={<TableChart />} onClick={exportToExcel} sx={{ borderRadius: 3 }}>
                      Export Excel
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>

      {vocabList.length > 0 && (
        <Slide direction="up" in timeout={1500}>
          <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Generated Table ({vocabList.length} words)
                </Typography>
                <Chip label={`Page ${currentPage} of ${totalPages}`} color="primary" variant="outlined" />
              </Box>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'primary.main' }}>
                    <TableRow>
                      {['S.No', 'English', 'Hindi', 'English', 'Hindi', 'English', 'Hindi'].map((header, index) => (
                        <TableCell key={`${header}-${index}`} align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRecords.map((item, index) => (
                      <Fade in timeout={300 + index * 100} key={item.sno}>
                        <TableRow hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>{item.sno}</TableCell>
                          <TableCell align="center">{item.english1}</TableCell>
                          <TableCell align="center">{item.hindi1}</TableCell>
                          <TableCell align="center">{item.english2}</TableCell>
                          <TableCell align="center">{item.hindi2}</TableCell>
                          <TableCell align="center">{item.english3}</TableCell>
                          <TableCell align="center">{item.hindi3}</TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{ '& .MuiPaginationItem-root': { borderRadius: 2 } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Slide>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
