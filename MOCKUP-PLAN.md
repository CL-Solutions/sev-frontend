# SEV Frontend Mockup Plan

## Overview
Property management system for property management companies with comprehensive features for managing properties, tenants, contracts, and accounting.

## Core Modules (Based on Current System Analysis)

### 1. Objektverwaltung (Property Management)
**Key Fields:**
- OBJ (Object ID) - e.g., "26"
- Objektname - e.g., "SEV Linkerstr. 27"
- Mandant (Client) - e.g., "26"
- Bankinfo - e.g., "1200"
- Straße (Street) - e.g., "Bischof-Hartmann-Str. 2"
- PLZ, Ort (Postal Code, City) - e.g., "D 94538 Fürstenstein"
- Objekttyp - e.g., "WEG-Objekt"
- Mw/St. Quote % - e.g., "0,00"
- Fertigstellung (Completion Year) - e.g., "1996"
- Steuernummer (Tax Number)
- Letzte Abrechnung (Last Settlement)
- Beheizung (Heating Type) - e.g., "Öl-Zentralheizung"
- Firma/Kd.Nr. (Company/Customer No.) - e.g., "ISTA 8065507"
- Verwaltung ab (Management from) - e.g., "01.10.2021"

**Property List View:**
- Tree structure with properties and sub-units
- Shows property type (ET = Eigentumswohnung/Apartment)
- Unit identifiers (e.g., "SEV Arbestr. 1 (ET: Spitzenberger)")

### 2. Wohnungsverwaltung (Unit/Apartment Management)
**Tabs:**
- Stammdaten (Master Data)
- Zahlung (Payment)
- Wohnung (Apartment)
- Details

**Key Fields:**
- Einheit Nr. (Unit Number) - e.g., "1", "Zimmer 1"
- Einheit Typ (Unit Type) - e.g., "Zimmer"
- Stockwerk (Floor)
- Lage (Location)
- Mieter/Preisgruppe (Tenant/Price Group)
- Einzugsdatum (Move-in Date) - e.g., "15.04.2025"
- Auszugsdatum (Move-out Date) - e.g., "31.05.2025"
- Zimmerzahl (Number of Rooms)
- Heizkosten ID
- Additional fields in grid format

### 3. Vertragsverwaltung (Contract Management)
**Contract Details:**
- Vertragsname (Contract Name) - e.g., "660.001.001.01"
- Vertragspartner (Contract Partner) - e.g., "Ochs, David"
- Zahlungsbeginn (Payment Start) - e.g., "15.04.2025"
- Letzte Erhöhung (Last Increase)
- Zahlungsende (Payment End) - e.g., "31.05.2025"
- Zahlungsmodus (Payment Mode) - "manuelle Zahlung"
- Zahlungsrhythmus (Payment Rhythm) - "monatliche Zahlung"

**Payment Breakdown:**
- Miete (Rent) - e.g., "735,00"
- Werberb. (Advertising)
- Betr.K. (Operating Costs) - e.g., "90,00"
- Heizk. (Heating Costs)
- Garage
- Stellplatz (Parking Space)
- Sonstiges (Other)
- Müllgebühr (Waste Fee)
- Gesamtbetrag (Total Amount) - e.g., "825,00"

**Payment Account:**
- Zahlung auf Konto (Payment to Account) dropdown
- Änderung (Change), Index, Umsatz tabs

### 4. Mieterverwaltung (Tenant Management)
**Tenant List View:**
- KTN (Account Number)
- UNR (Sub Number)
- Name
- Straße (Street)
- Shows tenant units (e.g., "Ochs, David - Linkstr. 27")

**Tenant Master Data:**
- Personal information
- Contact details (Telefon, Mobil, Fax)
- Address information
- Department/Unit assignment
- Check options for active contracts

### 5. Document Management
- Document storage per property/tenant
- Shareable with customers
- Archive functionality
- Categories for different document types

### 6. Email Interface
- Send mail functionality
- Basic email integration (no complex templates initially)
- Email action buttons in relevant contexts

### 7. Accounting Integration & Payment Tracking
**Bank Account Integration:**
- Single bank account per property management company
- Automatic bank statement import/sync
- Transaction matching with expected payments

**Payment Tracking Features:**
- Automatic payment recognition (match bank transactions to contracts)
- Payment status dashboard showing:
  - Paid tenants (green status)
  - Outstanding payments (red status)
  - Partial payments (yellow status)
- Payment history per tenant
- Overdue payment alerts
- Monthly payment overview by property/unit

**Reporting:**
- Payment status reports
- Outstanding balance reports
- Cash flow analysis
- Export capabilities for accounting software

## Data Model Summary

### Property (Objekt)
- Basic info (ID, name, address, type)
- Financial info (bank details, tax number)
- Technical info (heating type, completion year)
- Management info (management start date, client)

### Unit (Wohnung/Einheit)
- Unit details (number, type, floor, rooms)
- Occupancy info (move-in/out dates)
- Current tenant reference
- Heating cost allocation

### Contract (Vertrag)
- Contract identifier
- Contract parties
- Payment schedule
- Payment amounts breakdown
- Payment account assignment

### Tenant (Mieter)
- Personal information
- Contact details
- Associated units
- Contract status

## UI/UX Considerations
- Master-detail layout pattern (list on left, details on right)
- Tab-based navigation for detailed views
- Grid/table views for data entry
- Dropdown selections for predefined values
- Date pickers for date fields
- Checkbox options for boolean fields
- Tree view for hierarchical property structure

## Priority Features for MVP
1. **Dashboard** - Overview of payment status, properties, and alerts
2. **Properties** - List and manage properties with their units
3. **Tenants & Contracts** - Manage tenants and their rental contracts
4. **Payment Tracking** - Bank integration and payment status monitoring
5. **Documents** - Basic document upload and sharing

## Next Steps
- [x] Review screenshots of current tool
- [x] Create modern UI mockups using shadcn/ui components
- [x] Design responsive layouts
- [x] Create navigation structure
- [x] Build interactive prototypes for key workflows
- [ ] Implement dashboard with payment status overview
- [x] Create property management interface (basic)
- [x] Build tenant/contract management
- [x] Design payment tracking with bank integration mock
- [x] Add document management functionality

## Implemented Features (January 2025)
- [x] Tenant communication/contact history tab
- [x] Tenant succession/change management with prospects
- [x] Automated dunning procedures and rent adjustments
- [x] Craftsmen/contractors management per building/trade
- [x] Invoice to bank statement matching with AI suggestions
- [x] Rental contract creation with preview and PDF export
- [x] WEG administrator contact management
- [x] SEPA mandate generation
- [x] Automatic report sending to customers