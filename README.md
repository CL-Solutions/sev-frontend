# SEV Property Management System - Frontend Mockup

A modern property management system mockup built with Next.js and shadcn/ui components.

## Features

### 🏠 Dashboard
- Real-time payment status overview
- Key metrics (properties, tenants, collection rate)
- Recent transactions with automatic payment matching
- Upcoming move-ins/move-outs

### 🏢 Property Management (Objektverwaltung)
- Master-detail view of all properties
- Detailed property information including:
  - Unit management
  - Financial overview
  - Property specifications
  - Tenant occupancy status

### 👥 Tenant Management (Mieterverwaltung)
- Complete tenant database
- Contact information management
- Contract history
- Payment status tracking
- Move-in/out dates

### 📄 Contract Management (Vertragsverwaltung)
- Active contract overview
- Rent increase scheduling
- Contract expiration tracking
- Payment terms management

### 💰 Payment Tracking (Zahlungsverfolgung)
- Bank account integration mockup
- Automatic payment matching
- Payment status dashboard
- Overdue payment alerts
- Bank transaction import simulation

### 📁 Document Management (Dokumentenverwaltung)
- Centralized document storage
- Category-based organization
- Document sharing with tenants
- Search and filter capabilities
- Archive functionality

### ⚙️ Settings (Einstellungen)
- Company information
- Banking configuration
- Notification preferences
- User management
- System settings

## Tech Stack

- **Framework:** Next.js 15.3.5 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Icons:** Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the mockup.

## Project Structure

```
app/
├── page.tsx              # Dashboard
├── properties/           # Property management
├── tenants/             # Tenant management
├── contracts/           # Contract management
├── payments/            # Payment tracking
├── documents/           # Document management
└── settings/            # System settings

components/
├── layout/
│   └── app-sidebar.tsx  # Main navigation sidebar
└── ui/                  # shadcn/ui components
```

## Mock Data

The application uses mock data to demonstrate functionality:
- 4 properties with various unit configurations
- Multiple tenants with different payment statuses
- Bank transactions with automatic matching
- Sample documents across different categories

## Key Features Demonstrated

1. **Automatic Payment Matching**: Shows how bank transactions are automatically matched to tenant contracts
2. **Payment Status Visualization**: Color-coded status indicators (green = paid, yellow = partial, red = overdue)
3. **Document Sharing**: Mockup of sharing documents with specific tenants
4. **Multi-language Support**: German interface for the German market
5. **Responsive Design**: Works on desktop and tablet devices

## Future Enhancements

- Real bank API integration
- Email notification system
- Advanced reporting features
- Mobile app version
- Tenant portal
- Automated invoice generation
- Integration with accounting software

## Development Notes

This is a frontend mockup demonstrating the user interface and workflow. Backend integration would require:
- REST API or GraphQL backend
- Database design (PostgreSQL recommended)
- Authentication system
- File storage solution (S3 or similar)
- Payment gateway integration
- Email service integration