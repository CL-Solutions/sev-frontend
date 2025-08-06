"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailDialog } from "@/components/email-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Euro,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Share2,
  File,
  MessageSquare,
  Send,
  Paperclip,
  AlertCircle,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for tenants
const tenants = [
  {
    id: "1",
    name: "Ochs, David",
    firstName: "David",
    lastName: "Ochs",
    email: "david.ochs@email.de",
    phone: "0173 9227 954",
    mobile: "0173 9227 954",
    property: "SEV Linkstr. 27",
    unit: "1",
    address: {
      street: "Linkerstraße 27",
      plz: "80933",
      city: "München",
    },
    contractStart: "15.04.2025",
    contractEnd: "31.05.2025",
    rent: 735,
    additionalCosts: 90,
    totalRent: 825,
    deposit: 2205,
    paymentStatus: "current",
    ktn: "800",
    unr: "001",
    contracts: [
      { id: "660.001.001.01", status: "active", type: "Hauptmietvertrag" }
    ]
  },
  {
    id: "2",
    name: "Müller, Anna",
    firstName: "Anna",
    lastName: "Müller",
    email: "anna.mueller@email.de",
    phone: "089 123456",
    mobile: "0176 98765432",
    property: "SEV Arbestr. 1",
    unit: "3",
    address: {
      street: "Arbeiterstraße 1",
      plz: "80933",
      city: "München",
    },
    contractStart: "01.01.2023",
    contractEnd: null,
    rent: 650,
    additionalCosts: 85,
    totalRent: 735,
    deposit: 1950,
    paymentStatus: "current",
    ktn: "801",
    unr: "003",
    contracts: [
      { id: "661.003.001.01", status: "active", type: "Hauptmietvertrag" }
    ]
  },
  {
    id: "3",
    name: "Schmidt, Peter",
    firstName: "Peter",
    lastName: "Schmidt",
    email: "p.schmidt@email.de",
    phone: "089 234567",
    mobile: "0171 1234567",
    property: "SEV Theaterstr. 1",
    unit: "2",
    address: {
      street: "Theaterstraße 1",
      plz: "80333",
      city: "München",
    },
    contractStart: "01.06.2022",
    contractEnd: null,
    rent: 550,
    additionalCosts: 100,
    totalRent: 650,
    deposit: 1650,
    paymentStatus: "partial",
    ktn: "802",
    unr: "002",
    contracts: [
      { id: "662.002.001.01", status: "active", type: "Hauptmietvertrag" }
    ]
  },
  {
    id: "4",
    name: "Wagner, Maria",
    firstName: "Maria",
    lastName: "Wagner",
    email: "m.wagner@email.de",
    phone: "089 345678",
    mobile: "0172 2345678",
    property: "SEV Rathausstr. 12",
    unit: "5",
    address: {
      street: "Rathausstraße 12",
      plz: "80331",
      city: "München",
    },
    contractStart: "01.03.2021",
    contractEnd: null,
    rent: 790,
    additionalCosts: 100,
    totalRent: 890,
    deposit: 2370,
    paymentStatus: "overdue",
    ktn: "803",
    unr: "005",
    contracts: [
      { id: "663.005.001.01", status: "active", type: "Hauptmietvertrag" }
    ]
  },
]

// Property mapping for cross-references
const propertyMapping = {
  "SEV Linkstr. 27": "660",
  "SEV Arbestr. 1": "661",
  "SEV Theaterstr. 1": "662",
  "SEV Rathausstr. 12": "663",
  "SEV Bahnhofstr. 5": "664",
}

// Mock communication history for tenants
const tenantCommunications = {
  "1": [ // Ochs, David
    { id: "COMM001", type: "email", subject: "Willkommen in Ihrer neuen Wohnung", date: "15.04.2025", time: "10:30", direction: "outgoing", status: "sent", attachments: 1 },
    { id: "COMM002", type: "email", subject: "Re: Frage zur Heizungsanlage", date: "20.04.2025", time: "14:15", direction: "incoming", status: "read" },
    { id: "COMM003", type: "phone", subject: "Anruf: Terminvereinbarung Übergabe", date: "14.04.2025", time: "11:00", direction: "outgoing", duration: "5 Min" },
    { id: "COMM004", type: "letter", subject: "Mietvertrag unterschrieben", date: "10.04.2025", time: "09:00", direction: "incoming", status: "processed", attachments: 1 },
  ],
  "2": [ // Müller, Anna
    { id: "COMM005", type: "email", subject: "Nebenkostenabrechnung 2023", date: "15.01.2024", time: "09:00", direction: "outgoing", status: "sent", attachments: 2 },
    { id: "COMM006", type: "email", subject: "Mieterhöhung ab 01.01.2024", date: "01.11.2023", time: "10:00", direction: "outgoing", status: "sent" },
    { id: "COMM007", type: "phone", subject: "Anruf: Reparatur Wasserhahn", date: "10.01.2025", time: "16:30", direction: "incoming", duration: "8 Min" },
  ],
  "3": [ // Schmidt, Peter
    { id: "COMM008", type: "email", subject: "1. Mahnung - Dezember 2024", date: "15.12.2024", time: "09:00", direction: "outgoing", status: "sent" },
    { id: "COMM009", type: "email", subject: "Re: Zahlungserinnerung", date: "18.12.2024", time: "14:20", direction: "incoming", status: "read" },
    { id: "COMM010", type: "letter", subject: "Zahlungserinnerung November", date: "15.11.2024", time: "09:00", direction: "outgoing", status: "sent" },
  ],
  "4": [ // Wagner, Maria  
    { id: "COMM011", type: "email", subject: "1. Mahnung - Januar 2025", date: "10.01.2025", time: "09:00", direction: "outgoing", status: "sent" },
    { id: "COMM012", type: "email", subject: "2. Mahnung - Januar 2025", date: "20.01.2025", time: "09:00", direction: "outgoing", status: "sent" },
    { id: "COMM013", type: "phone", subject: "Anruf: Zahlungsverzug besprochen", date: "22.01.2025", time: "10:15", direction: "outgoing", duration: "12 Min" },
    { id: "COMM014", type: "letter", subject: "Letzte Mahnung vor rechtlichen Schritten", date: "25.01.2025", time: "09:00", direction: "outgoing", status: "sent", important: true },
  ],
}

// Mock documents for tenants
const tenantDocuments = {
  "1": [ // Ochs, David
    { id: "DOC001", name: "Mietvertrag_Ochs_David.pdf", type: "contract", size: "2.4 MB", uploadDate: "15.04.2025", shared: true },
    { id: "DOC002", name: "Übergabeprotokoll_Einzug_Ochs.pdf", type: "protocol", size: "5.8 MB", uploadDate: "15.04.2025", shared: false },
    { id: "DOC007", name: "Selbstauskunft_Ochs.pdf", type: "document", size: "1.2 MB", uploadDate: "10.04.2025", shared: false },
    { id: "DOC008", name: "Kaution_Bestätigung_Ochs.pdf", type: "document", size: "450 KB", uploadDate: "14.04.2025", shared: true },
  ],
  "2": [ // Müller, Anna
    { id: "DOC009", name: "Mietvertrag_Mueller_Anna.pdf", type: "contract", size: "2.3 MB", uploadDate: "01.01.2023", shared: true },
    { id: "DOC010", name: "Nebenkostenabrechnung_2023_Mueller.pdf", type: "invoice", size: "890 KB", uploadDate: "15.01.2024", shared: true },
    { id: "DOC011", name: "Mieterhöhung_2024_Mueller.pdf", type: "document", size: "340 KB", uploadDate: "01.11.2023", shared: true },
  ],
  "3": [ // Schmidt, Peter
    { id: "DOC012", name: "Mietvertrag_Schmidt_Peter.pdf", type: "contract", size: "2.5 MB", uploadDate: "01.06.2022", shared: true },
    { id: "DOC013", name: "Mahnung_Schmidt_Dezember.pdf", type: "document", size: "230 KB", uploadDate: "15.12.2024", shared: false },
  ],
  "4": [ // Wagner, Maria
    { id: "DOC014", name: "Mietvertrag_Wagner_Maria.pdf", type: "contract", size: "2.2 MB", uploadDate: "01.03.2021", shared: true },
    { id: "DOC015", name: "Mahnung_1_Wagner.pdf", type: "document", size: "220 KB", uploadDate: "10.01.2025", shared: false },
    { id: "DOC016", name: "Mahnung_2_Wagner.pdf", type: "document", size: "225 KB", uploadDate: "20.01.2025", shared: false },
  ],
}

function TenantsPageContent() {
  const searchParams = useSearchParams()
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  // Check for tenant ID in URL parameters
  useEffect(() => {
    const tenantId = searchParams.get('id')
    if (tenantId && tenants.find(t => t.id === tenantId)) {
      setSelectedTenant(tenantId)
    }
  }, [searchParams])

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedTenantData = tenants.find((t) => t.id === selectedTenant)

  // Helper function to render property link
  const renderPropertyLink = (propertyName: string) => {
    const propertyId = propertyMapping[propertyName as keyof typeof propertyMapping]
    if (propertyId) {
      return (
        <Link 
          href={`/properties?id=${propertyId}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {propertyName}
        </Link>
      )
    }
    return propertyName
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Aktuell</Badge>
      case "partial":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Teilzahlung</Badge>
      case "overdue":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Überfällig</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      {/* Tenants List */}
      <div className="w-96 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold flex-1">Mieter</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Neuer Mieter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen Mieter anlegen</DialogTitle>
                  <DialogDescription>
                    Fügen Sie einen neuen Mieter hinzu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right">
                      Vorname
                    </Label>
                    <Input id="first-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right">
                      Nachname
                    </Label>
                    <Input id="last-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      E-Mail
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telefon
                    </Label>
                    <Input id="phone" type="tel" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Mieter anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Mieter suchen..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-2">
          {filteredTenants.map((tenant) => (
            <Card
              key={tenant.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedTenant === tenant.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedTenant(tenant.id)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{tenant.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        <span className="inline-flex items-center gap-1">
                          {renderPropertyLink(tenant.property)} - Einheit {tenant.unit}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  {getPaymentStatusBadge(tenant.paymentStatus)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    <span>{tenant.totalRent}€</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Seit {tenant.contractStart}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tenant Details */}
      <div className="flex-1 overflow-auto">
        {selectedTenantData ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedTenantData.firstName[0]}{selectedTenantData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTenantData.name}</h2>
                    <p className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        {renderPropertyLink(selectedTenantData.property)} - Einheit {selectedTenantData.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/handover-protocol">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Übergabeprotokoll
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setEmailDialogOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail senden
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Dokumente
                  </Button>
                </div>
              </div>
              {getPaymentStatusBadge(selectedTenantData.paymentStatus)}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="contracts">Verträge</TabsTrigger>
                <TabsTrigger value="payments">Zahlungen</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="contact">Kontakt</TabsTrigger>
                <TabsTrigger value="communication">Kommunikation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Monatliche Miete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedTenantData.totalRent}€</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedTenantData.rent}€ Kaltmiete + {selectedTenantData.additionalCosts}€ NK
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Kaution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedTenantData.deposit}€</div>
                      <p className="text-xs text-muted-foreground">
                        3 Monatsmieten
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Mietbeginn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedTenantData.contractStart.split('.')[2]}</div>
                      <p className="text-xs text-muted-foreground">
                        Seit {selectedTenantData.contractStart}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Dokumente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {tenantDocuments[selectedTenantData.id as keyof typeof tenantDocuments]?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tenantDocuments[selectedTenantData.id as keyof typeof tenantDocuments]?.filter(d => d.shared).length || 0} geteilt
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Mieterinformationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Kontennummer (KTN)</dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.ktn}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Unternummer (UNR)</dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.unr}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Vertragsbeginn</dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.contractStart}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Vertragsende</dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.contractEnd || "Unbefristet"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Wohnobjekt</dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.property}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Wohneinheit</dt>
                        <dd className="text-sm font-semibold">Einheit {selectedTenantData.unit}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Verträge</h3>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Neuer Vertrag
                  </Button>
                </div>
                
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vertragsnummer</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Kaltmiete</TableHead>
                        <TableHead>Nebenkosten</TableHead>
                        <TableHead>Gesamt</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTenantData.contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.id}</TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>
                            <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                              {contract.status === "active" ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </TableCell>
                          <TableCell>{selectedTenantData.rent}€</TableCell>
                          <TableCell>{selectedTenantData.additionalCosts}€</TableCell>
                          <TableCell className="font-semibold">{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Zahlungshistorie</CardTitle>
                    <CardDescription>Letzte 6 Monate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Monat</TableHead>
                          <TableHead>Soll</TableHead>
                          <TableHead>Ist</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Januar 2025</TableCell>
                          <TableCell>{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>{selectedTenantData.paymentStatus === "overdue" ? "0€" : selectedTenantData.totalRent + "€"}</TableCell>
                          <TableCell>{selectedTenantData.paymentStatus === "overdue" ? "-" : "08.01.2025"}</TableCell>
                          <TableCell>{getPaymentStatusBadge(selectedTenantData.paymentStatus)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dezember 2024</TableCell>
                          <TableCell>{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>05.12.2024</TableCell>
                          <TableCell><Badge variant="default">Bezahlt</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>November 2024</TableCell>
                          <TableCell>{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>{selectedTenantData.totalRent}€</TableCell>
                          <TableCell>07.11.2024</TableCell>
                          <TableCell><Badge variant="default">Bezahlt</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Dokumente</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Share2 className="mr-1 h-4 w-4" />
                      Dokument teilen
                    </Button>
                    <Button size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      Dokument hochladen
                    </Button>
                  </div>
                </div>

                {tenantDocuments[selectedTenantData.id as keyof typeof tenantDocuments] && tenantDocuments[selectedTenantData.id as keyof typeof tenantDocuments].length > 0 ? (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dokument</TableHead>
                          <TableHead>Typ</TableHead>
                          <TableHead>Größe</TableHead>
                          <TableHead>Hochgeladen</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantDocuments[selectedTenantData.id as keyof typeof tenantDocuments].map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type === "contract" ? "Vertrag" :
                                 doc.type === "protocol" ? "Protokoll" :
                                 doc.type === "invoice" ? "Rechnung" :
                                 "Dokument"}
                              </Badge>
                            </TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>{doc.uploadDate}</TableCell>
                            <TableCell>
                              {doc.shared ? (
                                <Badge variant="outline" className="gap-1">
                                  <Share2 className="h-3 w-3" />
                                  Geteilt
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Privat</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <File className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">Keine Dokumente vorhanden</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Erstes Dokument hochladen
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Kontaktdaten</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" /> E-Mail
                        </dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Telefon
                        </dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Mobil
                        </dt>
                        <dd className="text-sm font-semibold">{selectedTenantData.mobile}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Adresse
                        </dt>
                        <dd className="text-sm font-semibold">
                          {selectedTenantData.address.street}<br />
                          {selectedTenantData.address.plz} {selectedTenantData.address.city}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Kommunikationsverlauf</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="mr-1 h-4 w-4" />
                      Brief erstellen
                    </Button>
                    <Button size="sm" onClick={() => setEmailDialogOpen(true)}>
                      <Mail className="mr-1 h-4 w-4" />
                      E-Mail senden
                    </Button>
                  </div>
                </div>

                {tenantCommunications[selectedTenantData.id as keyof typeof tenantCommunications] && tenantCommunications[selectedTenantData.id as keyof typeof tenantCommunications].length > 0 ? (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Typ</TableHead>
                          <TableHead>Betreff</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Zeit</TableHead>
                          <TableHead>Richtung</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantCommunications[selectedTenantData.id as keyof typeof tenantCommunications].map((comm) => (
                          <TableRow key={comm.id} className={'important' in comm && comm.important ? "bg-red-50" : ""}>
                            <TableCell>
                              {comm.type === "email" ? (
                                <Mail className="h-4 w-4 text-muted-foreground" />
                              ) : comm.type === "phone" ? (
                                <Phone className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${'important' in comm && comm.important ? "text-red-600" : ""}`}>
                                  {comm.subject}
                                </span>
                                {'important' in comm && comm.important && <AlertCircle className="h-4 w-4 text-red-600" />}
                                {'attachments' in comm && comm.attachments && (
                                  <Badge variant="outline" className="text-xs">
                                    <Paperclip className="h-3 w-3 mr-1" />
                                    {comm.attachments}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{comm.date}</TableCell>
                            <TableCell>
                              {comm.time}
                              {'duration' in comm && comm.duration && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({comm.duration as string})
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={comm.direction === "outgoing" ? "outline" : "secondary"}>
                                {comm.direction === "outgoing" ? (
                                  <>
                                    <Send className="h-3 w-3 mr-1" />
                                    Ausgang
                                  </>
                                ) : (
                                  <>
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Eingang
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {comm.status === "sent" && <Badge variant="outline">Gesendet</Badge>}
                              {comm.status === "read" && <Badge variant="default">Gelesen</Badge>}
                              {comm.status === "processed" && <Badge variant="default">Bearbeitet</Badge>}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {comm.type === "email" && (
                                  <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">Keine Kommunikation vorhanden</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Brief erstellen
                        </Button>
                        <Button size="sm" onClick={() => setEmailDialogOpen(true)}>
                          <Mail className="mr-2 h-4 w-4" />
                          E-Mail senden
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Email Dialog */}
            {selectedTenantData && (
              <EmailDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                context={{
                  type: 'tenant',
                  tenant: {
                    name: selectedTenantData.name,
                    email: selectedTenantData.email,
                  },
                  property: {
                    name: selectedTenantData.property,
                    address: selectedTenantData.property + " - Einheit " + selectedTenantData.unit,
                  },
                  payment: selectedTenantData.paymentStatus === 'overdue' ? {
                    amount: selectedTenantData.totalRent,
                    dueDate: "01." + new Date().toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' }),
                    month: new Date().toLocaleDateString('de-DE', { month: 'long' }),
                  } : undefined,
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Kein Mieter ausgewählt</h3>
              <p className="text-sm text-muted-foreground">
                Wählen Sie einen Mieter aus der Liste aus, um Details anzuzeigen
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TenantsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TenantsPageContent />
    </Suspense>
  )
}