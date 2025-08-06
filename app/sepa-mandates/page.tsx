"use client"

import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Download,
  Plus,
  Search,
  FileText,
  Edit,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  Printer,
  Copy,
  Shield,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for SEPA mandates
const sepaMandates = [
  {
    id: "SEPA001",
    mandateReference: "SEV-2025-001-OM",
    tenant: "Ochs, David",
    property: "SEV Linkstr. 27",
    unit: "1",
    iban: "DE89 3704 0044 0532 0130 00",
    accountHolder: "David Ochs",
    status: "active",
    signedDate: "15.04.2025",
    validFrom: "15.04.2025",
    validUntil: null,
    lastCollection: "25.01.2025",
    monthlyAmount: 825,
    type: "recurrent",
  },
  {
    id: "SEPA002",
    mandateReference: "SEV-2023-002-MM",
    tenant: "Müller, Anna",
    property: "SEV Arbestr. 1",
    unit: "3",
    iban: "DE44 5001 0517 5407 3249 31",
    accountHolder: "Anna Müller",
    status: "active",
    signedDate: "01.01.2023",
    validFrom: "01.01.2023",
    validUntil: null,
    lastCollection: "25.01.2025",
    monthlyAmount: 735,
    type: "recurrent",
  },
  {
    id: "SEPA003",
    mandateReference: "SEV-2020-003-SP",
    tenant: "Schmidt, Peter",
    property: "SEV Theaterstr. 1",
    unit: "2",
    iban: "DE12 5001 0517 0648 4898 90",
    accountHolder: "Peter Schmidt",
    status: "cancelled",
    signedDate: "01.06.2020",
    validFrom: "01.06.2020",
    validUntil: "31.12.2024",
    lastCollection: "25.12.2024",
    monthlyAmount: 650,
    type: "recurrent",
  },
]

// Mock collection history
const collectionHistory = [
  {
    id: "COLL001",
    mandateId: "SEPA001",
    date: "25.01.2025",
    amount: 825,
    status: "collected",
    reference: "Miete Januar 2025",
  },
  {
    id: "COLL002",
    mandateId: "SEPA001",
    date: "27.12.2024",
    amount: 825,
    status: "collected",
    reference: "Miete Dezember 2024",
  },
  {
    id: "COLL003",
    mandateId: "SEPA002",
    date: "25.01.2025",
    amount: 735,
    status: "collected",
    reference: "Miete Januar 2025",
  },
  {
    id: "COLL004",
    mandateId: "SEPA002",
    date: "27.12.2024",
    amount: 735,
    status: "failed",
    reference: "Miete Dezember 2024",
    reason: "Konto nicht gedeckt",
  },
]

export default function SEPAMandatesPage() {
  const [selectedTab, setSelectedTab] = useState("mandates")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createMandateOpen, setCreateMandateOpen] = useState(false)
  // const [selectedMandate, setSelectedMandate] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const filteredMandates = sepaMandates.filter((mandate) => {
    const matchesSearch = 
      mandate.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mandate.mandateReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mandate.property.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || mandate.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Aktiv</Badge>
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>
      case "cancelled":
        return <Badge variant="destructive">Gekündigt</Badge>
      case "expired":
        return <Badge variant="secondary">Abgelaufen</Badge>
      default:
        return null
    }
  }

  const getCollectionStatusBadge = (status: string) => {
    switch (status) {
      case "collected":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Eingezogen</Badge>
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>
      case "failed":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Fehlgeschlagen</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={() => setCreateMandateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neues SEPA-Mandat
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">SEPA-Mandate</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="mandates">Mandate</TabsTrigger>
            <TabsTrigger value="collections">Lastschriften</TabsTrigger>
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="mandates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Mandate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sepaMandates.filter(m => m.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">von {sepaMandates.length} gesamt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monatliche Einzüge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sepaMandates
                      .filter(m => m.status === "active")
                      .reduce((sum, m) => sum + m.monthlyAmount, 0)
                      .toLocaleString('de-DE')}€
                  </div>
                  <p className="text-xs text-muted-foreground">Gesamtsumme</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nächster Einzug</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">27.02.2025</div>
                  <p className="text-xs text-muted-foreground">in 30 Tagen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Fehlgeschlagen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">letzte 30 Tage</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>SEPA-Mandate</CardTitle>
                <CardDescription>Verwaltung aller SEPA-Lastschriftmandate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Mieter, Referenz oder Objekt suchen..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Status filtern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="cancelled">Gekündigt</SelectItem>
                      <SelectItem value="expired">Abgelaufen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referenz</TableHead>
                      <TableHead>Mieter</TableHead>
                      <TableHead>Objekt</TableHead>
                      <TableHead>IBAN</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gültig ab</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMandates.map((mandate) => (
                      <TableRow key={mandate.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {mandate.mandateReference}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{mandate.tenant}</div>
                            <div className="text-xs text-muted-foreground">
                              {mandate.accountHolder}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {mandate.property}
                            <div className="text-xs text-muted-foreground">
                              Einheit {mandate.unit}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs">
                            {mandate.iban.replace(/(.{4})/g, '$1 ').trim()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{mandate.monthlyAmount}€</div>
                          <div className="text-xs text-muted-foreground">monatlich</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(mandate.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">{mandate.validFrom}</div>
                          {mandate.validUntil && (
                            <div className="text-xs text-muted-foreground">
                              bis {mandate.validUntil}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // setSelectedMandate(mandate.id)
                                setPreviewOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lastschrift-Historie</CardTitle>
                <CardDescription>Übersicht aller SEPA-Lastschriften</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Mandat</TableHead>
                      <TableHead>Mieter</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Verwendungszweck</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collectionHistory.map((collection) => {
                      const mandate = sepaMandates.find(m => m.id === collection.mandateId)
                      return (
                        <TableRow key={collection.id}>
                          <TableCell>{collection.date}</TableCell>
                          <TableCell className="font-medium">
                            {mandate?.mandateReference}
                          </TableCell>
                          <TableCell>{mandate?.tenant}</TableCell>
                          <TableCell className="font-medium">{collection.amount}€</TableCell>
                          <TableCell>{collection.reference}</TableCell>
                          <TableCell>{getCollectionStatusBadge(collection.status)}</TableCell>
                          <TableCell>
                            {collection.status === "failed" && (
                              <div className="text-xs text-destructive">
                                {collection.reason}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEPA-Mandat Vorlagen</CardTitle>
                <CardDescription>Vorlagen für verschiedene Mandatstypen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Standard SEPA-Mandat</CardTitle>
                      <CardDescription>Für wiederkehrende Mietzahlungen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Typ:</span> Wiederkehrende Lastschrift
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Vorlaufzeit:</span> 5 Werktage
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Gültigkeit:</span> Unbegrenzt
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Vorschau
                        </Button>
                        <Button size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Verwenden
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Einmal-SEPA-Mandat</CardTitle>
                      <CardDescription>Für einmalige Zahlungen (Kaution etc.)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Typ:</span> Einmalige Lastschrift
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Vorlaufzeit:</span> 5 Werktage
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Gültigkeit:</span> 36 Monate
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Vorschau
                        </Button>
                        <Button size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Verwenden
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEPA-Einstellungen</CardTitle>
                <CardDescription>Konfiguration für SEPA-Lastschriften</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="creditor-id">Gläubiger-Identifikationsnummer</Label>
                    <Input id="creditor-id" defaultValue="DE98ZZZ09999999999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Firmenname</Label>
                    <Input id="company-name" defaultValue="SEV Property Management GmbH" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Firmenadresse</Label>
                  <Input id="company-address" defaultValue="Musterstraße 1, 80331 München" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Einzugseinstellungen</CardTitle>
                <CardDescription>Standard-Einstellungen für Lastschriften</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatische Einzüge</Label>
                    <div className="text-sm text-muted-foreground">
                      Mietzahlungen automatisch einziehen
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vorabankündigung</Label>
                    <div className="text-sm text-muted-foreground">
                      Pre-Notification 5 Tage vor Einzug versenden
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fehlerbenachrichtigung</Label>
                    <div className="text-sm text-muted-foreground">
                      Bei fehlgeschlagenen Lastschriften benachrichtigen
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Mandate Dialog */}
        <Dialog open={createMandateOpen} onOpenChange={setCreateMandateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Neues SEPA-Mandat erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie ein neues SEPA-Lastschriftmandat für einen Mieter
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tenant" className="text-right">
                  Mieter
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Mieter auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ochs">Ochs, David - SEV Linkstr. 27/1</SelectItem>
                    <SelectItem value="mueller">Müller, Anna - SEV Arbestr. 1/3</SelectItem>
                    <SelectItem value="schmidt">Schmidt, Peter - SEV Theaterstr. 1/2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="iban" className="text-right">
                  IBAN
                </Label>
                <Input id="iban" className="col-span-3" placeholder="DE00 0000 0000 0000 0000 00" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="account-holder" className="text-right">
                  Kontoinhaber
                </Label>
                <Input id="account-holder" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mandate-type" className="text-right">
                  Mandatstyp
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Typ wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurrent">Wiederkehrend (Miete)</SelectItem>
                    <SelectItem value="one-time">Einmalig (Kaution)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Betrag
                </Label>
                <Input id="amount" type="number" className="col-span-3" placeholder="0.00" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateMandateOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit">
                <FileText className="mr-2 h-4 w-4" />
                Mandat erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>SEPA-Mandat Vorschau</DialogTitle>
            </DialogHeader>
            <div className="mt-4 p-8 bg-white border rounded">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">SEPA-Lastschriftmandat</h1>
                <p className="text-sm text-gray-600 mt-2">für wiederkehrende Zahlungen</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="font-bold mb-2">Zahlungsempfänger (Gläubiger)</h2>
                  <p>SEV Property Management GmbH</p>
                  <p>Musterstraße 1</p>
                  <p>80331 München</p>
                  <p className="mt-2">
                    <strong>Gläubiger-Identifikationsnummer:</strong> DE98ZZZ09999999999
                  </p>
                </div>

                <div>
                  <h2 className="font-bold mb-2">Zahlungspflichtiger (Schuldner)</h2>
                  <p>David Ochs</p>
                  <p>SEV Linkstr. 27, Einheit 1</p>
                  <p>80331 München</p>
                </div>

                <div>
                  <h2 className="font-bold mb-2">SEPA-Lastschrift-Mandat</h2>
                  <p className="text-sm leading-relaxed">
                    Ich ermächtige die SEV Property Management GmbH, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. 
                    Zugleich weise ich mein Kreditinstitut an, die von SEV Property Management GmbH auf mein Konto gezogenen 
                    Lastschriften einzulösen.
                  </p>
                  <p className="text-sm leading-relaxed mt-2">
                    Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des 
                    belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Mandatsreferenz:</strong></p>
                    <p>SEV-2025-001-OM</p>
                  </div>
                  <div>
                    <p><strong>Zahlungsart:</strong></p>
                    <p>Wiederkehrende Zahlung</p>
                  </div>
                </div>

                <div>
                  <p><strong>Kontoverbindung des Zahlungspflichtigen:</strong></p>
                  <p>IBAN: DE89 3704 0044 0532 0130 00</p>
                  <p>BIC: COBADEFFXXX</p>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="mb-8">_______________________________</p>
                      <p>Ort, Datum</p>
                    </div>
                    <div>
                      <p className="mb-8">_______________________________</p>
                      <p>Unterschrift des Kontoinhabers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Schließen
              </Button>
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                Drucken
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Per E-Mail senden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}