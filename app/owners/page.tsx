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
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Euro,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for owners
const owners = [
  {
    id: "1",
    name: "Müller, Thomas",
    firstName: "Thomas",
    lastName: "Müller",
    email: "thomas.mueller@email.de",
    phone: "089 123456",
    mobile: "0171 1234567",
    address: {
      street: "Leopoldstraße 15",
      plz: "80802",
      city: "München",
    },
    bankAccount: {
      iban: "DE89 3704 0044 0532 0130 00",
      bic: "COBADEFFXXX",
      bank: "Commerzbank AG",
    },
    properties: [
      { id: "660", name: "SEV Linkstr. 27", units: 1, monthlyIncome: 825, managementFee: 50 },
      { id: "662", name: "SEV Theaterstr. 1", units: 1, monthlyIncome: 1335, managementFee: 120 }, // 3-person WG
    ],
    totalUnits: 2,
    totalMonthlyIncome: 2160,
    totalManagementFee: 170,
    paymentStatus: "current",
    contract: {
      id: "VV001",
      startDate: "01.01.2024",
      endDate: "31.12.2025",
      duration: 2, // years
      monthsRemaining: 11,
      status: "active",
    },
  },
  {
    id: "2",
    name: "Schmidt, Andrea",
    firstName: "Andrea",
    lastName: "Schmidt",
    email: "andrea.schmidt@email.de",
    phone: "089 234567",
    mobile: "0172 2345678",
    address: {
      street: "Maximilianstraße 20",
      plz: "80539",
      city: "München",
    },
    bankAccount: {
      iban: "DE45 7002 0270 0015 7648 33",
      bic: "HYVEDEMMXXX",
      bank: "HypoVereinsbank",
    },
    properties: [
      { id: "661", name: "SEV Arbestr. 1", units: 3, monthlyIncome: 2385, managementFee: 150 }, // 3 units = 150€
    ],
    totalUnits: 3,
    totalMonthlyIncome: 2385,
    totalManagementFee: 150,
    paymentStatus: "current",
    contract: {
      id: "VV002",
      startDate: "01.06.2023",
      endDate: "31.05.2025",
      duration: 2,
      monthsRemaining: 4, // Expires soon!
      status: "expiring_soon",
    },
  },
  {
    id: "3",
    name: "Weber, Klaus",
    firstName: "Klaus",
    lastName: "Weber",
    email: "klaus.weber@email.de",
    phone: "089 345678",
    mobile: "0173 3456789",
    address: {
      street: "Sendlinger Straße 30",
      plz: "80331",
      city: "München",
    },
    bankAccount: {
      iban: "DE12 5001 0517 5407 3249 31",
      bic: "INGDDEFFXXX",
      bank: "ING-DiBa AG",
    },
    properties: [
      { id: "663", name: "SEV Rathausstr. 12", units: 2, monthlyIncome: 1780, managementFee: 100 },
      { id: "664", name: "SEV Bahnhofstr. 5", units: 1, monthlyIncome: 950, managementFee: 50 },
    ],
    totalUnits: 3,
    totalMonthlyIncome: 2730,
    totalManagementFee: 150,
    paymentStatus: "overdue",
    contract: {
      id: "VV003",
      startDate: "01.03.2024",
      endDate: "28.02.2025",
      duration: 1,
      monthsRemaining: 1, // Expires very soon!
      status: "expiring_soon",
    },
  },
]

// Mock recent transactions for owners
const ownerTransactions = {
  "1": [
    { date: "05.01.2025", type: "income", description: "Mieteinnahmen Januar", amount: 2160, status: "completed" },
    { date: "10.01.2025", type: "expense", description: "Verwaltungsgebühr Januar", amount: -129.60, status: "completed" },
    { date: "20.12.2024", type: "expense", description: "Instandhaltung Linkstr. 27", amount: -450, status: "completed" },
    { date: "05.12.2024", type: "income", description: "Mieteinnahmen Dezember", amount: 2160, status: "completed" },
  ],
  "2": [
    { date: "05.01.2025", type: "income", description: "Mieteinnahmen Januar", amount: 2385, status: "completed" },
    { date: "10.01.2025", type: "expense", description: "Verwaltungsgebühr Januar", amount: -143.10, status: "completed" },
    { date: "15.12.2024", type: "expense", description: "Nebenkostenabrechnung 2024", amount: -320, status: "completed" },
  ],
  "3": [
    { date: "05.01.2025", type: "income", description: "Mieteinnahmen Januar", amount: 2730, status: "pending" },
    { date: "10.01.2025", type: "expense", description: "Verwaltungsgebühr Januar", amount: -163.80, status: "overdue" },
    { date: "28.12.2024", type: "expense", description: "Reparatur Heizung Rathausstr.", amount: -890, status: "completed" },
  ],
}

function OwnersPageContent() {
  const searchParams = useSearchParams()
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  // Check for owner ID in URL parameters
  useEffect(() => {
    const ownerId = searchParams.get('id')
    if (ownerId && owners.find(o => o.id === ownerId)) {
      setSelectedOwner(ownerId)
    }
  }, [searchParams])

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.properties.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedOwnerData = owners.find((o) => o.id === selectedOwner)

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Aktuell</Badge>
      case "overdue":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Überfällig</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      {/* Owners List */}
      <div className="w-96 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold flex-1">Eigentümer</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Neuer Eigentümer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen Eigentümer anlegen</DialogTitle>
                  <DialogDescription>
                    Fügen Sie einen neuen Eigentümer hinzu
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
                  <Button type="submit">Eigentümer anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Eigentümer suchen..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-2">
          {filteredOwners.map((owner) => (
            <Card
              key={owner.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedOwner === owner.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedOwner(owner.id)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {owner.firstName[0]}{owner.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{owner.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {owner.totalUnits} {owner.totalUnits === 1 ? 'Einheit' : 'Einheiten'} • {owner.properties.length} {owner.properties.length === 1 ? 'Objekt' : 'Objekte'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {owner.contract.status === "expiring_soon" && (
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        {owner.contract.monthsRemaining} {owner.contract.monthsRemaining === 1 ? 'Monat' : 'Monate'}
                      </Badge>
                    )}
                    {getPaymentStatusBadge(owner.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    <span>{owner.totalMonthlyIncome.toLocaleString('de-DE')}€/Monat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <span>{owner.totalManagementFee.toLocaleString('de-DE')}€ Gebühr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Owner Details */}
      <div className="flex-1 overflow-auto">
        {selectedOwnerData ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedOwnerData.firstName[0]}{selectedOwnerData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOwnerData.name}</h2>
                    <p className="text-muted-foreground">
                      Vertrag bis {selectedOwnerData.contract.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEmailDialogOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail senden
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Abrechnung erstellen
                  </Button>
                </div>
              </div>
              {getPaymentStatusBadge(selectedOwnerData.paymentStatus)}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="properties">Objekte</TabsTrigger>
                <TabsTrigger value="finances">Finanzen</TabsTrigger>
                <TabsTrigger value="invoices">Abrechnungen</TabsTrigger>
                <TabsTrigger value="contact">Kontakt</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Objekte</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedOwnerData.properties.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedOwnerData.totalUnits} Einheiten gesamt
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Monatliche Einnahmen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedOwnerData.totalMonthlyIncome.toLocaleString('de-DE')}€
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Bruttomieteinnahmen
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Verwaltungsgebühr</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedOwnerData.totalManagementFee.toLocaleString('de-DE')}€
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fixbetrag pro Einheit
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Netto-Auszahlung</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(selectedOwnerData.totalMonthlyIncome - selectedOwnerData.totalManagementFee).toLocaleString('de-DE')}€
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Nach Abzug der Gebühren
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contract Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vertragsinformationen</CardTitle>
                    <CardDescription>Details zum Verwaltungsvertrag</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vertragsnummer</p>
                        <p className="text-sm font-semibold">
                          <Link 
                            href={`/contracts?tab=owners&search=${selectedOwnerData.contract.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedOwnerData.contract.id}
                          </Link>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vertragsbeginn</p>
                        <p className="text-sm font-semibold">{selectedOwnerData.contract.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vertragsende</p>
                        <p className="text-sm font-semibold">{selectedOwnerData.contract.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <div className="mt-1">
                          {selectedOwnerData.contract.status === "active" ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Aktiv
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Läuft aus in {selectedOwnerData.contract.monthsRemaining} {selectedOwnerData.contract.monthsRemaining === 1 ? 'Monat' : 'Monaten'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedOwnerData.contract.status === "expiring_soon" && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Vertrag läuft bald aus</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Der Verwaltungsvertrag läuft in {selectedOwnerData.contract.monthsRemaining} {selectedOwnerData.contract.monthsRemaining === 1 ? 'Monat' : 'Monaten'} aus. 
                            Bitte kontaktieren Sie den Eigentümer für eine Vertragsverlängerung.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Verlängerungsangebot senden
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="mr-2 h-4 w-4" />
                              <Link href={`/contracts?tab=owners&search=${selectedOwnerData.contract.id}`}>
                                Vertrag anzeigen
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Letzte Transaktionen</CardTitle>
                    <CardDescription>Einnahmen und Ausgaben der letzten Monate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datum</TableHead>
                          <TableHead>Beschreibung</TableHead>
                          <TableHead>Betrag</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ownerTransactions[selectedOwnerData.id as keyof typeof ownerTransactions]?.map((transaction, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                                {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString('de-DE')}€
                              </span>
                            </TableCell>
                            <TableCell>
                              {transaction.status === "completed" && <Badge variant="default">Abgeschlossen</Badge>}
                              {transaction.status === "pending" && <Badge variant="secondary">Ausstehend</Badge>}
                              {transaction.status === "overdue" && <Badge variant="destructive">Überfällig</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Verwaltete Objekte</h3>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Objekt zuweisen
                  </Button>
                </div>
                
                {selectedOwnerData.properties.map((property) => (
                  <Card key={property.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            <Link 
                              href={`/properties?id=${property.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {property.name}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            {property.units} {property.units === 1 ? 'Einheit' : 'Einheiten'}
                          </CardDescription>
                        </div>
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Mieteinnahmen</p>
                          <p className="font-semibold">{property.monthlyIncome.toLocaleString('de-DE')}€/Monat</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Verwaltungsgebühr</p>
                          <p className="font-semibold">{property.managementFee.toLocaleString('de-DE')}€/Monat (fix)</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Netto-Auszahlung</p>
                          <p className="font-semibold">
                            {(property.monthlyIncome - property.managementFee).toLocaleString('de-DE')}€/Monat
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="finances" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Finanzübersicht</CardTitle>
                    <CardDescription>Detaillierte Aufstellung der Einnahmen und Ausgaben</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Einnahmen</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Mieteinnahmen (Brutto)</span>
                            <span className="text-sm font-bold text-green-600">
                              +{selectedOwnerData.totalMonthlyIncome.toLocaleString('de-DE')}€
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Ausgaben</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Verwaltungsgebühr (Fixbetrag)</span>
                            <span className="text-sm font-bold text-red-600">
                              -{selectedOwnerData.totalManagementFee.toLocaleString('de-DE')}€
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4 space-y-1">
                            {selectedOwnerData.properties.map((prop, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{prop.name}: {prop.units} {prop.units === 1 ? 'Einheit' : 'Einheiten'}</span>
                                <span>{prop.managementFee}€</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm">Instandhaltungsrücklage</span>
                            <span className="text-sm font-bold text-red-600">-250€</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Monatliche Netto-Auszahlung</span>
                        <span className="font-bold text-lg">
                          {(selectedOwnerData.totalMonthlyIncome - selectedOwnerData.totalManagementFee - 250).toLocaleString('de-DE')}€
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Zahlungsinformationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Kontoinhaber</dt>
                        <dd className="text-sm font-semibold">{selectedOwnerData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">IBAN</dt>
                        <dd className="text-sm font-semibold font-mono">{selectedOwnerData.bankAccount.iban}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">BIC</dt>
                        <dd className="text-sm font-semibold">{selectedOwnerData.bankAccount.bic}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Bank</dt>
                        <dd className="text-sm font-semibold">{selectedOwnerData.bankAccount.bank}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Abrechnungen</h3>
                  <Button size="sm">
                    <FileText className="mr-1 h-4 w-4" />
                    Neue Abrechnung
                  </Button>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Zeitraum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Betrag</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>15.01.2025</TableCell>
                        <TableCell>Januar 2025</TableCell>
                        <TableCell>Monatsabrechnung</TableCell>
                        <TableCell>{(selectedOwnerData.totalMonthlyIncome - selectedOwnerData.totalManagementFee).toLocaleString('de-DE')}€</TableCell>
                        <TableCell><Badge variant="secondary">Entwurf</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>15.12.2024</TableCell>
                        <TableCell>Dezember 2024</TableCell>
                        <TableCell>Monatsabrechnung</TableCell>
                        <TableCell>{(selectedOwnerData.totalMonthlyIncome - selectedOwnerData.totalManagementFee).toLocaleString('de-DE')}€</TableCell>
                        <TableCell><Badge variant="default">Versendet</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>01.01.2025</TableCell>
                        <TableCell>Jahr 2024</TableCell>
                        <TableCell>Jahresabrechnung</TableCell>
                        <TableCell>25.920€</TableCell>
                        <TableCell><Badge variant="default">Versendet</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
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
                        <dd className="text-sm font-semibold">{selectedOwnerData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Telefon
                        </dt>
                        <dd className="text-sm font-semibold">{selectedOwnerData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Mobil
                        </dt>
                        <dd className="text-sm font-semibold">{selectedOwnerData.mobile}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Adresse
                        </dt>
                        <dd className="text-sm font-semibold">
                          {selectedOwnerData.address.street}<br />
                          {selectedOwnerData.address.plz} {selectedOwnerData.address.city}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Email Dialog */}
            {selectedOwnerData && (
              <EmailDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                context={{
                  type: 'tenant',
                  recipient: {
                    name: selectedOwnerData.name,
                    email: selectedOwnerData.email,
                  },
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Kein Eigentümer ausgewählt</h3>
              <p className="text-sm text-muted-foreground">
                Wählen Sie einen Eigentümer aus der Liste aus, um Details anzuzeigen
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OwnersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OwnersPageContent />
    </Suspense>
  )
}