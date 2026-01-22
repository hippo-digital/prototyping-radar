# Skills Radar - Miro Import Guide

## Overview

Total Skills: 108

## Quadrants Structure

### Components and Patterns

#### Working (10 skills)

- **What is a macro?**
- **Standard GOV.UK components**
- **Copying code from the Design System**
- **Basic component options**
- **Basic page layouts**
- **Nunjucks vs HTML components**
- **Checking accessibility defaults**
- **Tables with data**
- **Accordions**
- **Accessibility testing basics**

#### Practitioner (9 skills)

- **Create custom macros**
- **Passing variables to macros**
- **Use macros for items**
- **Form element validation states**
- **Customizing CSS for patterns**
- **Conditional components**
- **Autocomplete component**
- **Skip links and focus management**
- **WCAG basics for prototypers**

#### Expert (5 skills)

- **Building complex macros**
- **Isolating patterns for reuse**
- **Pattern library management**
- **Design system contribution**
- **Updating the GOV.UK Frontend**


### Data and Logic

#### Working (8 skills)

- **Storing user answers**
- **Viewing session data**
- **Different data types**
- **Basic 'if' statements**
- **Basic math in Nunjucks**
- **Standard data filters**
- **Data in the URL**
- **Clearing session data**

#### Practitioner (7 skills)

- **Using data across pages**
- **Logic in routes.js**
- **Redirecting with logic**
- **Validation logic**
- **Using checkboxes (arrays)**
- **Generating reference numbers**
- **Date manipulation**

#### Expert (10 skills)

- **Complex data structures**
- **Custom Nunjucks filters**
- **Using external JSON files**
- **Creating data maps**
- **Looping through data**
- **Filtering data**
- **Searching/Filtering lists**
- **Email notification preview**
- **Multi-user testing**
- **Complex 'if/else' logic**


### Pages and Layouts

#### Working (14 skills)

- **Views and page templates**
- **Creating a new page**
- **Linking pages**
- **Using the /index page**
- **Nunjucks vs HTML**
- **Basic page titles**
- **Standard GOV.UK Page blocks**
- **What is Routing?**
- **What is POST and GET?**
- **Hard-coding data**
- **Previewing in local host**
- **Add delays**
- **Simulate errors**
- **Mobile responsive testing**

#### Practitioner (11 skills)

- **Extend layout files**
- **Using block content**
- **Customizing the start page**
- **Branding**
- **Navigation patterns**
- **Use back link correctly**
- **Form layout design**
- **Confirmation pages**
- **Error page handling**
- **Deep linking**
- **User research handoff**

#### Expert (4 skills)

- **Building wizard patterns**
- **Multi-path journeys**
- **Dynamic routing logic**
- **Print stylesheets**


### Setup and Deployment

#### Working (14 skills)

- **Setting up VS Code**
- **Installing the kit**
- **Node.js basics**
- **NPM packages**
- **Introduction to Git and GitHub**
- **Terminal basics**
- **Running the kit locally**
- **Restarting the kit**
- **What's in the kit**
- **Folder structure**
- **Assets folder**
- **Update notifications**
- **Using browser DevTools**
- **Sass compile errors**

#### Practitioner (13 skills)

- **Add utilities**
- **Debugging**
- **Errors in routes**
- **Git basics**
- **Managing versions**
- **Terminal shortcuts**
- **Environment variables**
- **Backing up prototypes**
- **Password protection**
- **Prototype documentation**
- **Cleaning up before sharing**
- **What is Heroku?**
- **Deploying to Heroku**

#### Expert (3 skills)

- **Advanced Git**
- **Cleaning up prototypes**
- **Archiving old versions**


## Miro Import Instructions

### Method 1: CSV Import (Recommended)

1. Open your Miro board
2. Click the three dots menu (...) in the toolbar
3. Select "Import from CSV"
4. Upload the `miro-export.csv` file
5. Map the columns:
   - Title → Title
   - Description → Description
   - Tags → Tags
6. Click Import
7. Use tags to filter and organize sticky notes into quadrants

### Method 2: Manual Layout

1. Create 4 sections on your Miro board (one for each quadrant)
2. Within each section, create 4 columns for the rings:
   - 🟡 Working (Yellow sticky notes)
   - 🟢 Practitioner (Green sticky notes)
   - 🔵 Expert (Blue sticky notes)
   - 🟣 Leading (Purple sticky notes)
3. Add sticky notes for each skill in the appropriate column

### Color Coding

- **Yellow**: Working level skills
- **Light Green**: Practitioner level skills
- **Blue**: Expert level skills
- **Purple**: Leading level skills

## Suggested Miro Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROTOTYPING SKILLS RADAR                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │   Setup & Deployment    │  │ Components & Patterns   │      │
│  │                         │  │                         │      │
│  │  🟡 Working (14)        │  │  🟡 Working (10)        │      │
│  │  🟢 Practitioner (13)   │  │  🟢 Practitioner (9)    │      │
│  │  🔵 Expert (3)          │  │  🔵 Expert (5)          │      │
│  │                         │  │                         │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │   Pages & Layouts       │  │    Data & Logic         │      │
│  │                         │  │                         │      │
│  │  🟡 Working (14)        │  │  🟡 Working (8)         │      │
│  │  🟢 Practitioner (11)   │  │  🟢 Practitioner (7)    │      │
│  │  🔵 Expert (4)          │  │  🔵 Expert (10)         │      │
│  │                         │  │                         │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
