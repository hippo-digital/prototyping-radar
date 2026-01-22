# 📊 Miro Export Files - Skills Radar

I've created multiple files to help you import the skills tree into Miro. Here's what's available:

## 🎯 Files Created

### 1. **miro-export.csv** (Recommended for Quick Import)
- **Best for**: Direct import into Miro
- **Contains**: All 108 skills with titles, descriptions, and tags
- **How to use**: 
  1. Open your Miro board
  2. Click "..." menu → "Import from CSV"
  3. Upload this file
  4. Map columns: Title → Title, Description → Description, Tags → Tags
  5. Import!

### 2. **miro-export.json**
- **Best for**: API integration or advanced scripting
- **Contains**: Structured data with color codes for each ring level
- **Features**: 
  - Pre-defined colors (Yellow, Green, Blue, Purple)
  - Clean descriptions without HTML
  - Organized by quadrant and ring

### 3. **MIRO_IMPORT_GUIDE.md**
- **Best for**: Understanding the structure before importing
- **Contains**: Complete list of all skills organized by quadrant and ring
- **Features**: 
  - Visual layout diagram
  - Step-by-step import instructions
  - Color coding guide

### 4. **MIRO_LAYOUT.txt**
- **Best for**: Manual layout reference
- **Contains**: Grid-style layout showing exactly where each skill goes
- **Features**: 
  - Summary table with counts
  - Detailed instructions for organizing in Miro
  - ASCII art layout guide

### 5. **MIRO_CHECKLIST.md**
- **Best for**: Following a step-by-step process
- **Contains**: Interactive checklist for the import process
- **Features**: 
  - Quick reference numbers
  - Checkbox list of steps
  - Tag filtering instructions

## 📈 Skills Overview

- **Total Skills**: 108
- **Quadrants**: 4 (Setup & Deployment, Components & Patterns, Pages & Layouts, Data & Logic)
- **Rings/Levels**: 4 (Working, Practitioner, Expert, Leading)

### Breakdown by Quadrant:
- **Setup and Deployment**: 30 skills
- **Components and Patterns**: 24 skills
- **Pages and Layouts**: 29 skills
- **Data and Logic**: 25 skills

### Breakdown by Ring:
- **Working** (Yellow): 46 skills - Foundational skills
- **Practitioner** (Green): 40 skills - Intermediate skills
- **Expert** (Blue): 22 skills - Advanced skills
- **Leading** (Purple): 0 skills - Cutting-edge skills

## 🚀 Quick Start (Fastest Method)

1. Open Miro
2. Click the "..." menu in the toolbar
3. Select "Import from CSV"
4. Upload `miro-export.csv`
5. Map the columns (Title, Description, Tags)
6. Click Import
7. Use the tag filters to organize:
   - Filter by `components-and-patterns`
   - Move those to their section
   - Repeat for other quadrants

## 🎨 Suggested Miro Layout

Create a board with this structure:

```
┌─────────────────────────────────────────────────────────────┐
│              PROTOTYPING SKILLS RADAR                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────┐  ┌───────────────────┐              │
│  │ Setup & Deploy    │  │ Components &      │              │
│  │                   │  │ Patterns          │              │
│  │ 🟡 🟢 🔵 🟣      │  │ 🟡 🟢 🔵 🟣     │              │
│  │ (30 skills)       │  │ (24 skills)       │              │
│  └───────────────────┘  └───────────────────┘              │
│                                                              │
│  ┌───────────────────┐  ┌───────────────────┐              │
│  │ Pages & Layouts   │  │ Data & Logic      │              │
│  │                   │  │                   │              │
│  │ 🟡 🟢 🔵 🟣      │  │ 🟡 🟢 🔵 🟣     │              │
│  │ (29 skills)       │  │ (25 skills)       │              │
│  └───────────────────┘  └───────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Color Guide

Use these colors when organizing your sticky notes:

- 🟡 **Yellow** = Working level (foundational)
- 🟢 **Light Green** = Practitioner level (intermediate)
- 🔵 **Blue** = Expert level (advanced)
- 🟣 **Purple** = Leading level (cutting-edge)

## 📝 Tips for Best Results

1. **Import first, organize later**: Get all the data in, then arrange it
2. **Use frames**: Create frames for each quadrant to keep things organized
3. **Filter by tags**: Use the tag filters to find skills by quadrant or ring
4. **Add connections**: Draw lines between related skills
5. **Add context**: Use text boxes or comments to add notes about skill progressions

## 🔧 Regenerating Files

If you need to regenerate these files (e.g., after updating the data):

```bash
node scripts/export-to-miro.js
node scripts/create-miro-guide.js
node scripts/create-miro-layout.js
```

## 📚 Need Help?

- Check `MIRO_IMPORT_GUIDE.md` for detailed instructions
- Use `MIRO_CHECKLIST.md` as a step-by-step guide
- Refer to `MIRO_LAYOUT.txt` for the exact layout structure

---

**Ready to import?** Start with `miro-export.csv` for the quickest results! 🚀
