"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  Link2,
  RefreshCw,
  Upload,
  XCircle,
  AlertCircle,
  Eye,
  Sparkles,
  CheckSquare,
  Receipt,
  Clock,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"

// Type definitions
type TransactionMatch = {
  type: string
  tenant?: string
  contractor?: string
  property?: string
  unit?: string
}

type SuggestedMatch = {
  type: string
  tenant?: string
  contractor?: string
  provider?: string
  property?: string
  unit?: string
  confidence: number
}

type BankTransaction = {
  id: string
  date: string
  amount: number
  type: string
  reference: string
  sender: string
  iban: string
  matched: boolean
  match?: TransactionMatch
  suggestedMatch?: SuggestedMatch
}

// Mock bank transactions
const bankTransactions: BankTransaction[] = [
  {
    id: "BT001",
    date: "25.01.2025",
    amount: 890.00,
    type: "credit",
    reference: "Miete Wagner Jan 2025",
    sender: "Maria Wagner",
    iban: "DE89370400440532013000",
    matched: false,
    suggestedMatch: {
      type: "rent",
      tenant: "Wagner, Maria",
      property: "SEV Rathausstr. 12",
      unit: "5",
      confidence: 95,
    }
  },
  {
    id: "BT002",
    date: "24.01.2025",
    amount: 735.00,
    type: "credit",
    reference: "Müller A. Miete",
    sender: "Anna Müller",
    iban: "DE12500105170648489890",
    matched: true,
    match: {
      type: "rent",
      tenant: "Müller, Anna",
      property: "SEV Arbestr. 1",
      unit: "3",
    }
  },
  {
    id: "BT003",
    date: "23.01.2025",
    amount: 450.00,
    type: "debit",
    reference: "RG-2025-001 Müller Haustechnik",
    sender: "Müller Haustechnik GmbH",
    iban: "DE44500105175407324931",
    matched: false,
    suggestedMatch: {
      type: "invoice",
      contractor: "Müller Haustechnik GmbH",
      property: "SEV Linkstr. 27",
      confidence: 88,
    }
  },
  {
    id: "BT004",
    date: "22.01.2025",
    amount: 1650.00,
    type: "credit",
    reference: "Kaution Schmidt P.",
    sender: "Peter Schmidt",
    iban: "DE89370400440532013001",
    matched: false,
    suggestedMatch: {
      type: "deposit",
      tenant: "Schmidt, Peter",
      property: "SEV Theaterstr. 1",
      unit: "2",
      confidence: 92,
    }
  },
  {
    id: "BT005",
    date: "21.01.2025",
    amount: 325.00,
    type: "debit",
    reference: "Stadtwerke München KD-Nr 123456",
    sender: "Stadtwerke München",
    iban: "DE23500105170648489891",
    matched: false,
    suggestedMatch: {
      type: "utility",
      provider: "Stadtwerke München",
      property: "SEV Arbestr. 1",
      confidence: 75,
    }
  },
]

// Mock invoices
const invoices = [
  {
    id: "INV001",
    number: "RG-2025-001",
    date: "20.01.2025",
    amount: 450.00,
    contractor: "Müller Haustechnik GmbH",
    property: "SEV Linkstr. 27",
    description: "Heizungsreparatur",
    status: "unpaid",
    matched: false,
  },
  {
    id: "INV002",
    number: "2025-0123",
    date: "15.01.2025",
    amount: 325.00,
    contractor: "Stadtwerke München",
    property: "SEV Arbestr. 1",
    description: "Wasser/Abwasser Januar",
    status: "unpaid",
    matched: false,
  },
  {
    id: "INV003",
    number: "RE-2024-456",
    date: "28.12.2024",
    amount: 220.00,
    contractor: "Elektro Schmidt",
    property: "SEV Rathausstr. 12",
    description: "Steckdose Reparatur",
    status: "paid",
    matched: true,
  },
]

export default function InvoiceMatchingPage() {
  const [selectedTab, setSelectedTab] = useState("matching")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(true)
  const [filterUnmatched, setFilterUnmatched] = useState(false)

  const unmatched = bankTransactions.filter(t => !t.matched).length
  const matchedCount = bankTransactions.filter(t => t.matched).length

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge variant="default" className="bg-green-500">Sehr sicher ({confidence}%)</Badge>
    } else if (confidence >= 70) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Wahrscheinlich ({confidence}%)</Badge>
    } else {
      return <Badge variant="secondary">Unsicher ({confidence}%)</Badge>
    }
  }

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case "rent":
        return <Badge variant="outline"><Home className="h-3 w-3 mr-1" />Miete</Badge>
      case "deposit":
        return <Badge variant="outline"><CreditCard className="h-3 w-3 mr-1" />Kaution</Badge>
      case "invoice":
        return <Badge variant="outline"><Receipt className="h-3 w-3 mr-1" />Rechnung</Badge>
      case "utility":
        return <Badge variant="outline"><Building2 className="h-3 w-3 mr-1" />Nebenkosten</Badge>
      default:
        return null
    }
  }

  const filteredTransactions = filterUnmatched 
    ? bankTransactions.filter(t => !t.matched)
    : bankTransactions

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Rechnungszuordnung</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="matching">Zuordnung</TabsTrigger>
            <TabsTrigger value="transactions">Kontobewegungen</TabsTrigger>
            <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
          </TabsList>

          <TabsContent value="matching" className="space-y-4">
            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nicht zugeordnet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{unmatched}</div>
                  <p className="text-xs text-muted-foreground">Transaktionen offen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Zugeordnet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
                  <p className="text-xs text-muted-foreground">Diese Woche</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Erfolgsquote</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <Progress value={87} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Letzter Import</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Heute</div>
                  <p className="text-xs text-muted-foreground">09:15 Uhr</p>
                </CardContent>
              </Card>
            </div>

            {/* Auto-Match Settings */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Automatische Zuordnung</CardTitle>
                    <CardDescription>KI-basierte Vorschläge für Kontobewegungen</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Kontoauszug importieren
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Aktualisieren
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Intelligente Zuordnung
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Automatische Vorschläge basierend auf Verwendungszweck und Betrag
                    </div>
                  </div>
                  <Switch checked={autoMatchEnabled} onCheckedChange={setAutoMatchEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* Matching Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Kontobewegungen zuordnen</CardTitle>
                    <CardDescription>Ordnen Sie Zahlungen den entsprechenden Mietern oder Rechnungen zu</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="unmatched"
                        checked={filterUnmatched}
                        onCheckedChange={(checked) => setFilterUnmatched(checked as boolean)}
                      />
                      <Label htmlFor="unmatched" className="text-sm font-medium cursor-pointer">
                        Nur nicht zugeordnete
                      </Label>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={selectedTransactions.length === 0}
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Auswahl zuordnen ({selectedTransactions.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTransactions(filteredTransactions.filter(t => !t.matched).map(t => t.id))
                            } else {
                              setSelectedTransactions([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Verwendungszweck</TableHead>
                      <TableHead>Absender/Empfänger</TableHead>
                      <TableHead>Vorschlag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className={transaction.matched ? "opacity-60" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTransactions.includes(transaction.id)}
                            disabled={transaction.matched}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTransactions([...selectedTransactions, transaction.id])
                              } else {
                                setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}€
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.reference}</TableCell>
                        <TableCell>
                          <div className="text-sm">{transaction.sender}</div>
                          <div className="text-xs text-muted-foreground">{transaction.iban.slice(-4)}</div>
                        </TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <div className="space-y-1">
                              {getTransactionTypeBadge(transaction.match?.type || '')}
                              <div className="text-xs">
                                {transaction.match?.tenant || transaction.match?.contractor}
                              </div>
                            </div>
                          ) : transaction.suggestedMatch ? (
                            <div className="space-y-1">
                              {getTransactionTypeBadge(transaction.suggestedMatch.type)}
                              <div className="text-xs">
                                {transaction.suggestedMatch.tenant || transaction.suggestedMatch.contractor || transaction.suggestedMatch.provider}
                              </div>
                              {getConfidenceBadge(transaction.suggestedMatch.confidence)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Kein Vorschlag</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Zugeordnet
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Offen
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!transaction.matched && transaction.suggestedMatch && (
                              <Button variant="ghost" size="sm" title="Vorschlag akzeptieren">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" title="Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!transaction.matched && (
                              <Button variant="ghost" size="sm" title="Manuell zuordnen">
                                <Link2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Alle Kontobewegungen</CardTitle>
                    <CardDescription>Übersicht aller importierten Transaktionen</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Verwendungszweck</TableHead>
                      <TableHead>Absender/Empfänger</TableHead>
                      <TableHead>IBAN</TableHead>
                      <TableHead>Zuordnung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'credit' ? 'default' : 'destructive'}>
                            {transaction.type === 'credit' ? 'Eingang' : 'Ausgang'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}€
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{transaction.reference}</TableCell>
                        <TableCell>{transaction.sender}</TableCell>
                        <TableCell className="font-mono text-xs">{transaction.iban}</TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Eingangsrechnungen</CardTitle>
                    <CardDescription>Rechnungen von Handwerkern und Dienstleistern</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Rechnung hochladen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rechnungsnr.</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Lieferant</TableHead>
                      <TableHead>Objekt</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.contractor}</TableCell>
                        <TableCell>{invoice.property}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell className="font-medium">{invoice.amount.toFixed(2)}€</TableCell>
                        <TableCell>
                          {invoice.status === 'paid' ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Bezahlt
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Offen
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!invoice.matched && (
                              <Button variant="ghost" size="sm">
                                <Link2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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

// Import the Switch component
import { Switch } from "@/components/ui/switch"
import { Plus, Home } from "lucide-react"