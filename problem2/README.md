# Currency Swap Application

A React-based currency swap interface built with Material-UI and Vite.

## Features

- Real-time currency conversion
- Dynamic currency pair selection
- Live price data from Switcheo API
- Interactive form validation
- Responsive design
- Currency icons support
- Loading states and error handling

## Technologies Used

- React 18
- Material-UI (MUI)
- Vite
- Axios
- Yarn

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:
2. Install dependencies:
```bash
yarn install
```
3. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure
problem2/
├── public/
│ └── icons/
│ └── tokens/ # Currency SVG icons
├── src/
│ ├── components/
│ │ └── SwapForm.jsx # Main swap form component
│ ├── theme/
│ │ └── index.js # MUI theme configuration
│ ├── App.jsx # Root component
│ └── main.jsx # Entry point
├── index.html
├── package.json
└── vite.config.js

## Features in Detail

### Currency Swap Form
- Input validation for amount field
- Real-time currency pair validation
- Dynamic price calculations
- Interactive error messages
- Loading states during swap operation

### API Integration
- Fetches real-time price data from Switcheo API
- Handles loading and error states
- Automatic currency list population

### UI/UX Features
- Currency icons for better visual recognition
- Responsive design for all screen sizes
- Interactive feedback during user actions
- Loading indicators for async operations

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build

## Validation Rules

- Amount must be a positive number
- Maximum 6 decimal places allowed
- Selected currencies must be different
- All fields are required before swap