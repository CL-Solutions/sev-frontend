"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Link as LinkIcon,
  Unlink,
  ArrowUpRight,
  ArrowDownLeft,
  Home,
  FileText,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for bank transactions
const bankTransactions = [
  {
    id: "BT001",
    date: "15.01.2025",
    amount: 825.00,
    sender: "David Ochs",
    iban: "DE89370400440532013001",
    reference: "Miete Januar Linkstr 27",
    matched: true,
    contract: "660.001.001.01",
    tenant: "Ochs, David",
    property: "SEV Linkstr. 27",
    type: "incoming",
  },
  {
    id: "BT002",
    date: "10.01.2025",
    amount: 735.00,
    sender: "Anna Mueller",
    iban: "DE89370400440532013002",
    reference: "Mietzahlung 01/2025",
    matched: true,
    contract: "661.003.001.01",
    tenant: "Müller, Anna",
    property: "SEV Arbestr. 1",
    type: "incoming",
  },
  {
    id: "BT003",
    date: "20.01.2025",
    amount: -2030.40,
    recipient: "Thomas Müller",
    iban: "DE89370400440532013000",
    reference: "Auszahlung Januar 2025 - Linkstr/Theaterstr",
    matched: true,
    owner: "Müller, Thomas",
    properties: ["SEV Linkstr. 27", "SEV Theaterstr. 1"],
    type: "outgoing",
  },
  {
    id: "BT004",
    date: "20.01.2025",
    amount: -2241.90,
    recipient: "Andrea Schmidt",
    iban: "DE45700202700015764833",
    reference: "Auszahlung Januar 2025 - Arbestr",
    matched: true,
    owner: "Schmidt, Andrea",
    properties: ["SEV Arbestr. 1"],
    type: "outgoing",
  },
  {
    id: "BT005",
    date: "08.01.2025",
    amount: 650.00,
    sender: "Peter Schmidt",
    iban: "DE89370400440532013003",
    reference: "Miete Theaterstr",
    matched: true,
    contract: "662.002.001.01",
    tenant: "Schmidt, Peter",
    property: "SEV Theaterstr. 1",
    type: "incoming",
  },
  {
    id: "BT006",
    date: "06.01.2025",
    amount: 1250.00,
    sender: "Max Mustermann",
    iban: "DE89370400440532013004",
    reference: "Überweisung",
    matched: false,
    type: "incoming",
  },
]

// Mock data for expected payments
const expectedPayments = [
  // Tenant payments (incoming)
  {
    id: "EP001",
    contract: "660.001.001.01",
    tenant: "Ochs, David",
    property: "SEV Linkstr. 27",
    amount: 825,
    dueDate: "01.01.2025",
    status: "paid",
    paidDate: "15.01.2025",
    paidAmount: 825,
    type: "tenant",
  },
  {
    id: "EP002",
    contract: "661.003.001.01",
    tenant: "Müller, Anna",
    property: "SEV Arbestr. 1",
    amount: 735,
    dueDate: "01.01.2025",
    status: "paid",
    paidDate: "10.01.2025",
    paidAmount: 735,
    type: "tenant",
  },
  {
    id: "EP003",
    contract: "662.002.001.01",
    tenant: "Schmidt, Peter",
    property: "SEV Theaterstr. 1",
    amount: 650,
    dueDate: "01.01.2025",
    status: "paid",
    paidDate: "08.01.2025",
    paidAmount: 650,
    type: "tenant",
  },
  {
    id: "EP004",
    contract: "663.005.001.01",
    tenant: "Wagner, Maria",
    property: "SEV Rathausstr. 12",
    amount: 890,
    dueDate: "01.01.2025",
    status: "overdue",
    paidDate: null,
    paidAmount: 0,
    type: "tenant",
  },
  // Owner payments (outgoing)
  {
    id: "OP001",
    owner: "Müller, Thomas",
    ownerId: "1",
    properties: ["SEV Linkstr. 27", "SEV Theaterstr. 1"],
    amount: -2030.40,
    dueDate: "20.01.2025",
    status: "paid",
    paidDate: "20.01.2025",
    description: "Monatliche Auszahlung (nach Abzug Verwaltungsgebühr)",
    type: "owner",
  },
  {
    id: "OP002",
    owner: "Schmidt, Andrea",
    ownerId: "2",
    properties: ["SEV Arbestr. 1"],
    amount: -2241.90,
    dueDate: "20.01.2025",
    status: "paid",
    paidDate: "20.01.2025",
    description: "Monatliche Auszahlung (nach Abzug Verwaltungsgebühr)",
    type: "owner",
  },
  {
    id: "OP003",
    owner: "Weber, Klaus",
    ownerId: "3",
    properties: ["SEV Rathausstr. 12", "SEV Bahnhofstr. 5"],
    amount: -2566.20,
    dueDate: "20.01.2025",
    status: "pending",
    paidDate: null,
    description: "Monatliche Auszahlung (nach Abzug Verwaltungsgebühr)",
    type: "owner",
  },
]

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [lastSync, setLastSync] = useState("20.01.2025 09:15")
  const [isSyncing, setIsSyncing] = useState(false)

  // Calculate statistics
  const tenantPayments = expectedPayments.filter(p => p.type === "tenant")
  const ownerPayments = expectedPayments.filter(p => p.type === "owner")
  
  const totalExpectedRent = tenantPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalCollectedRent = tenantPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
  const collectionRate = (totalCollectedRent / totalExpectedRent) * 100
  
  const totalOwnerPayouts = Math.abs(ownerPayments.reduce((sum, p) => sum + p.amount, 0))
  const totalPaidToOwners = Math.abs(ownerPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0))
  
  const paymentStats = {
    tenantsPaid: tenantPayments.filter(p => p.status === "paid").length,
    tenantsPartial: tenantPayments.filter(p => p.status === "partial").length,
    tenantsOverdue: tenantPayments.filter(p => p.status === "overdue").length,
    ownersPaid: ownerPayments.filter(p => p.status === "paid").length,
    ownersPending: ownerPayments.filter(p => p.status === "pending").length,
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date().toLocaleString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Bezahlt</Badge>
      case "partial":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Teilzahlung</Badge>
      case "overdue":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Überfällig</Badge>
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Ausstehend</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-lg font-semibold">Zahlungen</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Letzte Synchronisation: {lastSync}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Bank synchronisieren
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="transactions">Banktransaktionen</TabsTrigger>
            <TabsTrigger value="tenant-payments">Mieterzahlungen</TabsTrigger>
            <TabsTrigger value="owner-payments">Eigentümerzahlungen</TabsTrigger>
            <TabsTrigger value="unmatched">Nicht zugeordnet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Payment Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Erwartete Miete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalExpectedRent)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Januar 2025
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Eingegangen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalCollectedRent)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {collectionRate.toFixed(1)}% Quote
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Auszahlungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    -{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalPaidToOwners)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    An Eigentümer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Verwaltungsgebühren</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(470)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fixbetrag pro Monat
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mieterzahlungen</CardTitle>
                  <CardDescription>Status der Mietzahlungen für Januar 2025</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Einziehungsquote</p>
                      <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{paymentStats.tenantsPaid}</p>
                        <p className="text-xs text-muted-foreground">Bezahlt</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{paymentStats.tenantsPartial}</p>
                        <p className="text-xs text-muted-foreground">Teilzahlung</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{paymentStats.tenantsOverdue}</p>
                        <p className="text-xs text-muted-foreground">Überfällig</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={collectionRate} className="h-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eigentümerzahlungen</CardTitle>
                  <CardDescription>Auszahlungen an Eigentümer für Januar 2025</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Auszahlungsstatus</p>
                      <p className="text-2xl font-bold">{paymentStats.ownersPaid}/{ownerPayments.length}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{paymentStats.ownersPaid}</p>
                        <p className="text-xs text-muted-foreground">Ausgezahlt</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{paymentStats.ownersPending}</p>
                        <p className="text-xs text-muted-foreground">Ausstehend</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={(paymentStats.ownersPaid / ownerPayments.length) * 100} className="h-3" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Letzte Transaktionen</CardTitle>
                <CardDescription>Ein- und Ausgänge der letzten Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bankTransactions.slice(0, 6).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'incoming' ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.type === 'incoming' 
                              ? transaction.tenant || transaction.sender
                              : transaction.owner || transaction.recipient
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type === 'incoming' 
                              ? transaction.property || 'Nicht zugeordnet'
                              : transaction.properties?.join(', ') || 'Eigentümerzahlung'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Transaktionen suchen..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Typ filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="incoming">Eingänge</SelectItem>
                  <SelectItem value="outgoing">Ausgänge</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportieren
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Von/An</TableHead>
                    <TableHead>IBAN</TableHead>
                    <TableHead>Verwendungszweck</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Zuordnung</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankTransactions
                    .filter(t => typeFilter === "all" || t.type === typeFilter)
                    .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.type === 'incoming' ? (
                          <Badge variant="outline" className="gap-1">
                            <ArrowDownLeft className="h-3 w-3" />
                            Eingang
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            Ausgang
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{transaction.sender || transaction.recipient}</TableCell>
                      <TableCell className="font-mono text-xs">{transaction.iban}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.reference}</TableCell>
                      <TableCell className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        {transaction.matched ? (
                          <div className="flex items-center gap-1">
                            <LinkIcon className="h-3 w-3 text-green-600" />
                            <span className="text-sm">
                              {transaction.tenant || transaction.owner || 'Zugeordnet'}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Unlink className="h-3 w-3" />
                            Nicht zugeordnet
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          {transaction.matched ? "Details" : "Zuordnen"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="tenant-payments" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="paid">Bezahlt</SelectItem>
                  <SelectItem value="partial">Teilzahlung</SelectItem>
                  <SelectItem value="overdue">Überfällig</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Mahnlauf starten
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mieter</TableHead>
                    <TableHead>Objekt</TableHead>
                    <TableHead>Fällig am</TableHead>
                    <TableHead>Soll</TableHead>
                    <TableHead>Ist</TableHead>
                    <TableHead>Differenz</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantPayments
                    .filter(p => statusFilter === "all" || p.status === statusFilter)
                    .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/tenants?id=${payment.id.replace('EP00', '')}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {payment.tenant}
                        </Link>
                      </TableCell>
                      <TableCell>{payment.property}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.amount}€</TableCell>
                      <TableCell className={(payment.paidAmount || 0) === payment.amount ? "text-green-600" : ""}>
                        {payment.paidAmount || 0}€
                      </TableCell>
                      <TableCell className={payment.amount - (payment.paidAmount || 0) > 0 ? "text-red-600 font-semibold" : ""}>
                        {payment.amount - (payment.paidAmount || 0) > 0 ? `-${payment.amount - (payment.paidAmount || 0)}€` : "0€"}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.status === "overdue" && (
                          <Button variant="ghost" size="sm">
                            Mahnung
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="owner-payments" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Abrechnungen erstellen
              </Button>
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Sammelüberweisung
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Eigentümer</TableHead>
                    <TableHead>Objekte</TableHead>
                    <TableHead>Mieteinnahmen</TableHead>
                    <TableHead>Verwaltungsgebühr</TableHead>
                    <TableHead>Auszahlung</TableHead>
                    <TableHead>Fällig am</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerPayments.map((payment) => {
                    // Fixed fees based on property
                    const managementFee = payment.owner === "Müller, Thomas" ? 170 :
                                        payment.owner === "Schmidt, Andrea" ? 150 :
                                        payment.owner === "Weber, Klaus" ? 150 : 0
                    const grossRent = Math.abs(payment.amount) + managementFee
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          <Link 
                            href={`/owners?id=${payment.ownerId}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <Home className="h-4 w-4" />
                            {payment.owner}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {payment.properties?.map((prop, idx) => (
                              <div key={idx}>{prop}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600">
                          +{grossRent.toFixed(2)}€
                        </TableCell>
                        <TableCell className="text-red-600">
                          -{managementFee}€ (fix)
                        </TableCell>
                        <TableCell className="font-semibold">
                          {Math.abs(payment.amount).toFixed(2)}€
                        </TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {payment.status === "pending" && (
                              <Button variant="ghost" size="sm">
                                Auszahlen
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Owner Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Zahlungsübersicht</CardTitle>
                <CardDescription>Zusammenfassung für Januar 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Gesamte Mieteinnahmen</p>
                      <p className="text-xl font-bold text-green-600">+{totalExpectedRent.toLocaleString('de-DE')}€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Verwaltungsgebühren</p>
                      <p className="text-xl font-bold">+470€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Auszahlungen</p>
                      <p className="text-xl font-bold text-red-600">-{totalOwnerPayouts.toLocaleString('de-DE')}€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Netto-Ertrag</p>
                      <p className="text-xl font-bold">470€</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unmatched" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nicht zugeordnete Transaktionen</CardTitle>
                <CardDescription>
                  Diese Zahlungen konnten keinem Mietvertrag oder Eigentümer automatisch zugeordnet werden
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Absender</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Verwendungszweck</TableHead>
                      <TableHead>Mögliche Zuordnung</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTransactions
                      .filter(t => !t.matched)
                      .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.sender}</TableCell>
                        <TableCell className="font-semibold">
                          {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Zuordnung wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tenant">Mieterzahlung</SelectItem>
                              <SelectItem value="deposit">Kaution</SelectItem>
                              <SelectItem value="other">Sonstiges</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">
                            Zuordnen
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}