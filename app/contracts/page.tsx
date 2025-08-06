"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Search,
  Download,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Home,
  Users,
  Plus,
  Calendar,
  Euro,
  Printer,
  Save,
  User,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for tenant contracts
const tenantContracts = [
  {
    id: "660.001.001.01",
    tenant: "Ochs, David",
    property: "SEV Linkstr. 27",
    unit: "1",
    type: "Hauptmietvertrag",
    status: "active",
    startDate: "15.04.2025",
    endDate: "31.05.2025",
    notice: true,
    rent: 735,
    additionalCosts: 90,
    totalRent: 825,
    paymentMode: "manuelle Zahlung",
    paymentRhythm: "monatlich",
    lastIncrease: null,
    nextIncrease: null,
  },
  {
    id: "661.003.001.01",
    tenant: "Müller, Anna",
    property: "SEV Arbestr. 1",
    unit: "3",
    type: "Hauptmietvertrag",
    status: "active",
    startDate: "01.01.2023",
    endDate: null,
    notice: false,
    rent: 650,
    additionalCosts: 85,
    totalRent: 735,
    paymentMode: "SEPA Lastschrift",
    paymentRhythm: "monatlich",
    lastIncrease: "01.01.2024",
    nextIncrease: "01.01.2026",
  },
  {
    id: "662.002.001.01",
    tenant: "Schmidt, Peter",
    property: "SEV Theaterstr. 1",
    unit: "2",
    type: "Hauptmietvertrag",
    status: "active",
    startDate: "01.06.2022",
    endDate: null,
    notice: false,
    rent: 550,
    additionalCosts: 100,
    totalRent: 650,
    paymentMode: "Überweisung",
    paymentRhythm: "monatlich",
    lastIncrease: "01.06.2023",
    nextIncrease: "01.06.2025",
  },
  {
    id: "663.005.001.01",
    tenant: "Wagner, Maria",
    property: "SEV Rathausstr. 12",
    unit: "5",
    type: "Hauptmietvertrag",
    status: "active",
    startDate: "01.03.2021",
    endDate: null,
    notice: false,
    rent: 790,
    additionalCosts: 100,
    totalRent: 890,
    paymentMode: "Überweisung",
    paymentRhythm: "monatlich",
    lastIncrease: "01.03.2023",
    nextIncrease: "01.03.2025",
  },
]

// Mock data for owner contracts
const ownerContracts = [
  {
    id: "VV001",
    owner: "Müller, Thomas",
    ownerId: "1",
    properties: [
      { name: "SEV Linkstr. 27", units: 1 },
      { name: "SEV Theaterstr. 1", units: 1 }
    ],
    totalUnits: 2,
    type: "Verwaltungsvertrag",
    status: "active",
    startDate: "01.01.2024",
    endDate: "31.12.2025",
    duration: 2,
    monthsRemaining: 11,
    monthlyIncome: 2160,
    managementFee: 170,
    feeType: "Fixbetrag",
  },
  {
    id: "VV002",
    owner: "Schmidt, Andrea",
    ownerId: "2",
    properties: [
      { name: "SEV Arbestr. 1", units: 3 }
    ],
    totalUnits: 3,
    type: "Verwaltungsvertrag",
    status: "expiring_soon",
    startDate: "01.06.2023",
    endDate: "31.05.2025",
    duration: 2,
    monthsRemaining: 4,
    monthlyIncome: 2385,
    managementFee: 150,
    feeType: "Fixbetrag",
  },
  {
    id: "VV003",
    owner: "Weber, Klaus",
    ownerId: "3",
    properties: [
      { name: "SEV Rathausstr. 12", units: 2 },
      { name: "SEV Bahnhofstr. 5", units: 1 }
    ],
    totalUnits: 3,
    type: "Verwaltungsvertrag",
    status: "expiring_soon",
    startDate: "01.03.2024",
    endDate: "28.02.2025",
    duration: 1,
    monthsRemaining: 1,
    monthlyIncome: 2730,
    managementFee: 150,
    feeType: "Fixbetrag",
  },
]

// Stats calculations
const totalTenantContracts = tenantContracts.length
const activeTenantContracts = tenantContracts.filter(c => c.status === "active").length
const expiringTenantContracts = tenantContracts.filter(c => c.notice).length
const totalMonthlyRent = tenantContracts.reduce((sum, c) => sum + c.totalRent, 0)

const totalOwnerContracts = ownerContracts.length
const activeOwnerContracts = ownerContracts.filter(c => c.status === "active").length
const expiringOwnerContracts = ownerContracts.filter(c => c.status === "expiring_soon").length
const totalManagementFees = ownerContracts.reduce((sum, c) => sum + c.managementFee, 0)

function ContractsPageContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("all")
  const [tenantSearchQuery, setTenantSearchQuery] = useState("")
  const [ownerSearchQuery, setOwnerSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [contractCreateOpen, setContractCreateOpen] = useState(false)
  const [contractPreviewOpen, setContractPreviewOpen] = useState(false)
  const [newContract, setNewContract] = useState({
    tenant: "",
    property: "",
    unit: "",
    startDate: "",
    endDate: "",
    rentType: "unbefristet",
    coldRent: "",
    additionalCosts: "",
    parkingRent: "",
    deposit: "",
    indexRent: false,
    stepRent: false,
    sepaMandate: false,
    includeHeating: true,
    includeWater: true,
    includeElectricity: false,
  })

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab')
    const search = searchParams.get('search')
    
    if (tab && ['all', 'tenants', 'owners'].includes(tab)) {
      setActiveTab(tab)
    }
    
    if (search) {
      if (tab === 'owners') {
        setOwnerSearchQuery(search)
      } else {
        setTenantSearchQuery(search)
      }
    }
  }, [searchParams])

  const filteredTenantContracts = tenantContracts.filter((contract) => {
    const matchesSearch = 
      contract.id.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      contract.tenant.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      contract.property.toLowerCase().includes(tenantSearchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && contract.status === "active") ||
      (statusFilter === "notice" && contract.notice)
    
    const matchesType = typeFilter === "all" || contract.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const filteredOwnerContracts = ownerContracts.filter((contract) => {
    const matchesSearch = 
      contract.id.toLowerCase().includes(ownerSearchQuery.toLowerCase()) ||
      contract.owner.toLowerCase().includes(ownerSearchQuery.toLowerCase()) ||
      contract.properties.some(p => p.name.toLowerCase().includes(ownerSearchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && contract.status === "active") ||
      (statusFilter === "expiring" && contract.status === "expiring_soon")

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-lg font-semibold">Verträge</h1>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Alle Verträge</TabsTrigger>
            <TabsTrigger value="tenants">Mietverträge</TabsTrigger>
            <TabsTrigger value="owners">Verwaltungsverträge</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Combined Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gesamte Verträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTenantContracts + totalOwnerContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalTenantContracts} Miet- & {totalOwnerContracts} Verwaltung
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Auslaufende Verträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expiringTenantContracts + expiringOwnerContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    Verlängerung erforderlich
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monatliche Einnahmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalMonthlyRent)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bruttomieteinnahmen
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Verwaltungsgebühren</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalManagementFees)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Monatliche Fixgebühren
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Expiring Contracts Warning */}
            {(expiringOwnerContracts > 0) && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Verwaltungsverträge auslaufend</CardTitle>
                  <CardDescription>{expiringOwnerContracts} Verwaltungsverträge laufen in den nächsten 6 Monaten aus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ownerContracts.filter(c => c.status === "expiring_soon").map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{contract.owner}</p>
                          <p className="text-xs text-muted-foreground">{contract.totalUnits} Einheiten • {contract.managementFee}€/Monat</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {contract.monthsRemaining} {contract.monthsRemaining === 1 ? 'Monat' : 'Monate'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">bis {contract.endDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Contracts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Alle Verträge</CardTitle>
                <CardDescription>Übersicht über Miet- und Verwaltungsverträge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Mietverträge
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vertragsnummer</TableHead>
                          <TableHead>Mieter</TableHead>
                          <TableHead>Objekt</TableHead>
                          <TableHead>Miete</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantContracts.slice(0, 3).map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell className="font-medium">{contract.id}</TableCell>
                            <TableCell>{contract.tenant}</TableCell>
                            <TableCell>{contract.property}</TableCell>
                            <TableCell>{contract.totalRent}€</TableCell>
                            <TableCell>
                              {contract.notice ? (
                                <Badge variant="destructive">Kündigung</Badge>
                              ) : (
                                <Badge variant="default">Aktiv</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Verwaltungsverträge
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vertragsnummer</TableHead>
                          <TableHead>Eigentümer</TableHead>
                          <TableHead>Objekte</TableHead>
                          <TableHead>Gebühr</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ownerContracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell className="font-medium">{contract.id}</TableCell>
                            <TableCell>{contract.owner}</TableCell>
                            <TableCell>{contract.properties.length} Objekte</TableCell>
                            <TableCell>{contract.managementFee}€/Monat</TableCell>
                            <TableCell>
                              {contract.status === "expiring_soon" ? (
                                <Badge variant="destructive">Läuft aus</Badge>
                              ) : (
                                <Badge variant="default">Aktiv</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            {/* Tenant Contracts Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Mietverträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeTenantContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    von {totalTenantContracts} gesamt
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Kündigungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expiringTenantContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    auslaufende Verträge
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monatliche Einnahmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalMonthlyRent)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Summe aller Mietverträge
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mieterhöhungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    fällig in 2025
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Mietverträge suchen..."
                  className="pl-8"
                  value={tenantSearchQuery}
                  onChange={(e) => setTenantSearchQuery(e.target.value)}
                />
              </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="notice">Gekündigt</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vertragstyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value="Hauptmietvertrag">Hauptmietvertrag</SelectItem>
              <SelectItem value="Untermietvertrag">Untermietvertrag</SelectItem>
              <SelectItem value="Gewerbemietvertrag">Gewerbemietvertrag</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setContractCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Mietvertrag
          </Button>
        </div>

            {/* Tenant Contracts Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vertragsnummer</TableHead>
                    <TableHead>Mieter</TableHead>
                    <TableHead>Objekt</TableHead>
                    <TableHead>Einheit</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Miete</TableHead>
                    <TableHead>Beginn</TableHead>
                    <TableHead>Ende</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenantContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.tenant}</TableCell>
                  <TableCell>{contract.property}</TableCell>
                  <TableCell>{contract.unit}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{contract.totalRent}€</div>
                      <div className="text-xs text-muted-foreground">
                        {contract.rent}€ + {contract.additionalCosts}€ NK
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate || "Unbefristet"}</TableCell>
                  <TableCell>
                    {contract.notice ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Kündigung
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Aktiv
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Upcoming Events */}
            <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Anstehende Mieterhöhungen</CardTitle>
              <CardDescription>Nächste 3 Monate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Schmidt, Peter</p>
                    <p className="text-xs text-muted-foreground">SEV Theaterstr. 1 - Einheit 2</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      01.06.2025
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">650€ → 680€</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Wagner, Maria</p>
                    <p className="text-xs text-muted-foreground">SEV Rathausstr. 12 - Einheit 5</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      01.03.2025
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">890€ → 920€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auslaufende Verträge</CardTitle>
              <CardDescription>Kündigungen und Befristungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Ochs, David</p>
                    <p className="text-xs text-muted-foreground">SEV Linkstr. 27 - Einheit 1</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="gap-1">
                      <Clock className="h-3 w-3" />
                      31.05.2025
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Befristung</p>
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="owners" className="space-y-6">
          {/* Owner Contracts Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Aktive Verträge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeOwnerContracts}</div>
                <p className="text-xs text-muted-foreground">
                  von {totalOwnerContracts} gesamt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Auslaufende Verträge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringOwnerContracts}</div>
                <p className="text-xs text-muted-foreground">
                  in den nächsten 6 Monaten
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verwaltete Einheiten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ownerContracts.reduce((sum, c) => sum + c.totalUnits, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  über alle Verträge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monatliche Gebühren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalManagementFees)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fixbeträge gesamt
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expiring Warning */}
          {expiringOwnerContracts > 0 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Verträge laufen bald aus
                </CardTitle>
                <CardDescription>Diese Verwaltungsverträge müssen verlängert werden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ownerContracts.filter(c => c.status === "expiring_soon").map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contract.owner}</p>
                          <p className="text-xs text-muted-foreground">{contract.totalUnits} Einheiten • {contract.managementFee}€/Monat</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {contract.monthsRemaining} {contract.monthsRemaining === 1 ? 'Monat' : 'Monate'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">bis {contract.endDate}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Mail className="mr-2 h-4 w-4" />
                          Verlängerung anbieten
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Verwaltungsverträge suchen..."
                className="pl-8"
                value={ownerSearchQuery}
                onChange={(e) => setOwnerSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="expiring">Auslaufend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Owner Contracts Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vertragsnummer</TableHead>
                  <TableHead>Eigentümer</TableHead>
                  <TableHead>Objekte</TableHead>
                  <TableHead>Einheiten</TableHead>
                  <TableHead>Gebühr</TableHead>
                  <TableHead>Vertragsbeginn</TableHead>
                  <TableHead>Vertragsende</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwnerContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>
                      <Link 
                        href={`/owners?id=${contract.ownerId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {contract.owner}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {contract.properties.map((prop, idx) => (
                          <div key={idx}>{prop.name}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{contract.totalUnits}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{contract.managementFee}€/Monat</div>
                        <div className="text-xs text-muted-foreground">{contract.feeType}</div>
                      </div>
                    </TableCell>
                    <TableCell>{contract.startDate}</TableCell>
                    <TableCell>{contract.endDate}</TableCell>
                    <TableCell>
                      {contract.status === "expiring_soon" ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Läuft aus
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Aktiv
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Fee Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Gebührenübersicht</CardTitle>
              <CardDescription>Monatliche Verwaltungsgebühren nach Eigentümer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ownerContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{contract.owner}</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.totalUnits} {contract.totalUnits === 1 ? 'Einheit' : 'Einheiten'} • 
                        {contract.properties.map(p => p.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{contract.managementFee}€</p>
                      <p className="text-xs text-muted-foreground">pro Monat</p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t flex items-center justify-between">
                  <p className="font-medium">Gesamte Verwaltungsgebühren</p>
                  <p className="text-lg font-bold">{totalManagementFees}€/Monat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Contract Creation Dialog */}
      <Dialog open={contractCreateOpen} onOpenChange={setContractCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neuen Mietvertrag erstellen</DialogTitle>
            <DialogDescription>
              Erfassen Sie die Details für den neuen Mietvertrag
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Mieter und Objekt */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Mieter und Objekt
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Mieter</Label>
                  <Select value={newContract.tenant} onValueChange={(value) => setNewContract({...newContract, tenant: value})}>
                    <SelectTrigger id="tenant">
                      <SelectValue placeholder="Mieter wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">+ Neuer Mieter</SelectItem>
                      <SelectItem value="Bauer, Thomas">Bauer, Thomas</SelectItem>
                      <SelectItem value="Klein, Sarah">Klein, Sarah</SelectItem>
                      <SelectItem value="Wagner, Michael">Wagner, Michael</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property">Objekt</Label>
                  <Select value={newContract.property} onValueChange={(value) => setNewContract({...newContract, property: value})}>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Objekt wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEV Linkstr. 27">SEV Linkstr. 27</SelectItem>
                      <SelectItem value="SEV Arbestr. 1">SEV Arbestr. 1</SelectItem>
                      <SelectItem value="SEV Theaterstr. 1">SEV Theaterstr. 1</SelectItem>
                      <SelectItem value="SEV Rathausstr. 12">SEV Rathausstr. 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Einheit</Label>
                  <Input 
                    id="unit" 
                    placeholder="z.B. 3"
                    value={newContract.unit}
                    onChange={(e) => setNewContract({...newContract, unit: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Vertragslaufzeit */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vertragslaufzeit
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Vertragsbeginn</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rentType">Vertragsart</Label>
                  <Select value={newContract.rentType} onValueChange={(value) => setNewContract({...newContract, rentType: value})}>
                    <SelectTrigger id="rentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unbefristet">Unbefristet</SelectItem>
                      <SelectItem value="befristet">Befristet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newContract.rentType === "befristet" && (
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Vertragsende</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={newContract.endDate}
                      onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Miete und Kosten */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Miete und Kosten
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coldRent">Kaltmiete (€)</Label>
                  <Input 
                    id="coldRent" 
                    type="number"
                    placeholder="z.B. 650"
                    value={newContract.coldRent}
                    onChange={(e) => setNewContract({...newContract, coldRent: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalCosts">Nebenkosten (€)</Label>
                  <Input 
                    id="additionalCosts" 
                    type="number"
                    placeholder="z.B. 150"
                    value={newContract.additionalCosts}
                    onChange={(e) => setNewContract({...newContract, additionalCosts: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parkingRent">Stellplatz/Garage (€)</Label>
                  <Input 
                    id="parkingRent" 
                    type="number"
                    placeholder="z.B. 50"
                    value={newContract.parkingRent}
                    onChange={(e) => setNewContract({...newContract, parkingRent: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deposit">Kaution (€)</Label>
                  <Input 
                    id="deposit" 
                    type="number"
                    placeholder="z.B. 1950"
                    value={newContract.deposit}
                    onChange={(e) => setNewContract({...newContract, deposit: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Total calculation */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gesamtmiete (warm)</span>
                  <span className="text-lg font-bold">
                    {(parseFloat(newContract.coldRent || "0") + 
                      parseFloat(newContract.additionalCosts || "0") + 
                      parseFloat(newContract.parkingRent || "0")).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Nebenkosten Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">In Nebenkosten enthalten</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="heating" 
                    checked={newContract.includeHeating}
                    onCheckedChange={(checked) => setNewContract({...newContract, includeHeating: checked as boolean})}
                  />
                  <Label htmlFor="heating" className="text-sm font-normal cursor-pointer">
                    Heizung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="water" 
                    checked={newContract.includeWater}
                    onCheckedChange={(checked) => setNewContract({...newContract, includeWater: checked as boolean})}
                  />
                  <Label htmlFor="water" className="text-sm font-normal cursor-pointer">
                    Wasser/Abwasser
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="electricity" 
                    checked={newContract.includeElectricity}
                    onCheckedChange={(checked) => setNewContract({...newContract, includeElectricity: checked as boolean})}
                  />
                  <Label htmlFor="electricity" className="text-sm font-normal cursor-pointer">
                    Strom
                  </Label>
                </div>
              </div>
            </div>

            {/* Zusätzliche Optionen */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Zusätzliche Vereinbarungen</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="indexRent" 
                    checked={newContract.indexRent}
                    onCheckedChange={(checked) => setNewContract({...newContract, indexRent: checked as boolean})}
                  />
                  <Label htmlFor="indexRent" className="text-sm font-normal cursor-pointer">
                    Indexmiete (Anpassung nach Verbraucherpreisindex)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="stepRent" 
                    checked={newContract.stepRent}
                    onCheckedChange={(checked) => setNewContract({...newContract, stepRent: checked as boolean})}
                  />
                  <Label htmlFor="stepRent" className="text-sm font-normal cursor-pointer">
                    Staffelmiete (festgelegte Mieterhöhungen)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sepaMandate" 
                    checked={newContract.sepaMandate}
                    onCheckedChange={(checked) => setNewContract({...newContract, sepaMandate: checked as boolean})}
                  />
                  <Label htmlFor="sepaMandate" className="text-sm font-normal cursor-pointer">
                    SEPA-Lastschriftmandat erteilen
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractCreateOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setContractCreateOpen(false)
                setContractPreviewOpen(true)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Vorschau
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Vertrag erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Preview Dialog */}
      <Dialog open={contractPreviewOpen} onOpenChange={setContractPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vertragsvorschau</DialogTitle>
            <DialogDescription>
              Vorschau des Mietvertrags
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg p-8 bg-white overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">MIETVERTRAG</h1>
                <p className="text-sm text-gray-600 mt-2">für Wohnraum</p>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-bold">Zwischen</h2>
                <div className="pl-4">
                  <p>SEV Property Management GmbH</p>
                  <p>Musterstraße 1</p>
                  <p>80331 München</p>
                  <p className="italic">(nachfolgend &quot;Vermieter&quot; genannt)</p>
                </div>
                
                <p className="font-bold">und</p>
                
                <div className="pl-4">
                  <p>{newContract.tenant || "[Mietername]"}</p>
                  <p>[Adresse des Mieters]</p>
                  <p className="italic">(nachfolgend &quot;Mieter&quot; genannt)</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-bold">§ 1 Mietgegenstand</h2>
                <p>
                  Der Vermieter vermietet an den Mieter die Wohnung im Objekt <strong>{newContract.property || "[Objekt]"}</strong>,
                  Einheit <strong>{newContract.unit || "[Einheit]"}</strong>, bestehend aus [Anzahl] Zimmern, Küche, Bad und Flur
                  mit einer Wohnfläche von ca. [XX] m².
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-bold">§ 2 Mietzeit</h2>
                <p>
                  Das Mietverhältnis beginnt am <strong>{newContract.startDate || "[Datum]"}</strong> und läuft
                  {newContract.rentType === "befristet" 
                    ? ` bis zum ${newContract.endDate || "[Datum]"} (befristet).`
                    : " auf unbestimmte Zeit."
                  }
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-bold">§ 3 Miete</h2>
                <p>Die monatliche Miete beträgt:</p>
                <div className="pl-4 space-y-1">
                  <p>Kaltmiete: <strong>{newContract.coldRent || "0"} €</strong></p>
                  <p>Nebenkosten-Vorauszahlung: <strong>{newContract.additionalCosts || "0"} €</strong></p>
                  {newContract.parkingRent && parseFloat(newContract.parkingRent) > 0 && (
                    <p>Stellplatz/Garage: <strong>{newContract.parkingRent} €</strong></p>
                  )}
                  <p className="border-t pt-1 font-bold">
                    Gesamtmiete (warm): {(parseFloat(newContract.coldRent || "0") + 
                      parseFloat(newContract.additionalCosts || "0") + 
                      parseFloat(newContract.parkingRent || "0")).toFixed(2)} €
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-bold">§ 4 Kaution</h2>
                <p>
                  Der Mieter leistet eine Kaution in Höhe von <strong>{newContract.deposit || "0"} €</strong>
                  (entspricht {newContract.deposit && newContract.coldRent 
                    ? (parseFloat(newContract.deposit) / parseFloat(newContract.coldRent)).toFixed(1) 
                    : "X"} Monatsmieten).
                </p>
              </div>
              
              {(newContract.indexRent || newContract.stepRent) && (
                <div className="space-y-4">
                  <h2 className="font-bold">§ 5 Mietanpassung</h2>
                  {newContract.indexRent && (
                    <p>Die Miete wird jährlich entsprechend der Entwicklung des Verbraucherpreisindex angepasst.</p>
                  )}
                  {newContract.stepRent && (
                    <p>Die Miete erhöht sich gemäß folgender Staffelung: [Staffelvereinbarung einfügen]</p>
                  )}
                </div>
              )}
              
              <div className="mt-12 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="mb-8">_______________________________</p>
                    <p>Ort, Datum</p>
                  </div>
                  <div>
                    <p className="mb-8">_______________________________</p>
                    <p>Ort, Datum</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="mb-8">_______________________________</p>
                    <p>Vermieter</p>
                  </div>
                  <div>
                    <p className="mb-8">_______________________________</p>
                    <p>Mieter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setContractPreviewOpen(false)
                setContractCreateOpen(true)
              }}
            >
              Zurück zur Bearbeitung
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Als PDF speichern
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Drucken
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}

export default function ContractsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractsPageContent />
    </Suspense>
  )
}