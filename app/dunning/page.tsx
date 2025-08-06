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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Phone,
  Printer,
  Send,
  TrendingUp,
  Settings,
  Eye,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for overdue payments
const overduePayments = [
  {
    id: "OP001",
    tenant: "Wagner, Maria",
    property: "SEV Rathausstr. 12",
    unit: "5",
    amount: 890,
    monthsOverdue: 2,
    totalOwed: 1780,
    lastPayment: "01.11.2024",
    dunningLevel: 2,
    lastDunning: "20.01.2025",
    nextAction: "3. Mahnung",
    daysOverdue: 31,
  },
  {
    id: "OP002",
    tenant: "Schmidt, Peter",
    property: "SEV Theaterstr. 1",
    unit: "2",
    amount: 650,
    monthsOverdue: 1,
    totalOwed: 650,
    lastPayment: "05.12.2024",
    dunningLevel: 1,
    lastDunning: "15.12.2024",
    nextAction: "2. Mahnung",
    daysOverdue: 15,
  },
  {
    id: "OP003",
    tenant: "Fischer, Thomas",
    property: "SEV Linkstr. 27",
    unit: "3",
    amount: 775,
    monthsOverdue: 3,
    totalOwed: 2325,
    lastPayment: "15.10.2024",
    dunningLevel: 3,
    lastDunning: "25.01.2025",
    nextAction: "Inkasso",
    daysOverdue: 62,
  },
]

// Mock data for rent adjustments
const rentAdjustments = [
  {
    id: "RA001",
    tenant: "Müller, Anna",
    property: "SEV Arbestr. 1",
    unit: "3",
    currentRent: 650,
    newRent: 695,
    increase: 45,
    percentage: 6.9,
    effectiveDate: "01.04.2025",
    lastIncrease: "01.01.2023",
    status: "draft",
    indexLinked: true,
  },
  {
    id: "RA002",
    tenant: "Weber, Klaus",
    property: "SEV Linkstr. 27",
    unit: "2",
    currentRent: 580,
    newRent: 610,
    increase: 30,
    percentage: 5.2,
    effectiveDate: "01.05.2025",
    lastIncrease: "01.06.2022",
    status: "sent",
    indexLinked: false,
  },
  {
    id: "RA003",
    tenant: "Bauer, Lisa",
    property: "SEV Theaterstr. 1",
    unit: "4",
    currentRent: 720,
    newRent: 760,
    increase: 40,
    percentage: 5.6,
    effectiveDate: "01.06.2025",
    lastIncrease: "01.07.2022",
    status: "scheduled",
    indexLinked: true,
  },
]

// Mock templates
const letterTemplates = [
  { id: "T001", name: "1. Mahnung - Zahlungserinnerung", category: "dunning" },
  { id: "T002", name: "2. Mahnung - Dringend", category: "dunning" },
  { id: "T003", name: "3. Mahnung - Letzte Warnung", category: "dunning" },
  { id: "T004", name: "Mieterhöhung nach Mietspiegel", category: "adjustment" },
  { id: "T005", name: "Indexmieterhöhung", category: "adjustment" },
  { id: "T006", name: "Modernisierungsmieterhöhung", category: "adjustment" },
]

export default function DunningPage() {
  const [selectedTab, setSelectedTab] = useState("dunning")
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  // const [selectedTemplate, setSelectedTemplate] = useState("")

  const getDunningLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return <Badge variant="secondary">1. Mahnung</Badge>
      case 2:
        return <Badge variant="outline" className="border-orange-500 text-orange-600">2. Mahnung</Badge>
      case 3:
        return <Badge variant="destructive">3. Mahnung</Badge>
      default:
        return null
    }
  }

  const getAdjustmentStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Entwurf</Badge>
      case "scheduled":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Geplant</Badge>
      case "sent":
        return <Badge variant="default"><Send className="h-3 w-3 mr-1" />Versendet</Badge>
      case "confirmed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Bestätigt</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Mahnverfahren & Mietanpassungen</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="dunning">Mahnungen</TabsTrigger>
            <TabsTrigger value="adjustments">Mietanpassungen</TabsTrigger>
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
          </TabsList>

          <TabsContent value="dunning" className="space-y-4">
            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Offene Forderungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.755€</div>
                  <p className="text-xs text-muted-foreground">3 Mieter betroffen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Überfällige Mieter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Von 48 gesamt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ø Verzugstage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">Durchschnitt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mahnungen diese Woche</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Automatisch versendet</p>
                </CardContent>
              </Card>
            </div>

            {/* Overdue Payments Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Überfällige Zahlungen</CardTitle>
                    <CardDescription>Mieter mit ausstehenden Zahlungen</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Einstellungen
                    </Button>
                    <Button size="sm" disabled={selectedTenants.length === 0}>
                      <Send className="mr-2 h-4 w-4" />
                      Mahnungen versenden ({selectedTenants.length})
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
                              setSelectedTenants(overduePayments.map(p => p.id))
                            } else {
                              setSelectedTenants([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Mieter</TableHead>
                      <TableHead>Objekt</TableHead>
                      <TableHead>Monatsmiete</TableHead>
                      <TableHead>Rückstand</TableHead>
                      <TableHead>Verzug</TableHead>
                      <TableHead>Mahnstufe</TableHead>
                      <TableHead>Nächste Aktion</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overduePayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTenants.includes(payment.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTenants([...selectedTenants, payment.id])
                              } else {
                                setSelectedTenants(selectedTenants.filter(id => id !== payment.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.tenant}</div>
                          <div className="text-xs text-muted-foreground">
                            Letzte Zahlung: {payment.lastPayment}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{payment.property}</div>
                          <div className="text-xs text-muted-foreground">Einheit {payment.unit}</div>
                        </TableCell>
                        <TableCell>{payment.amount}€</TableCell>
                        <TableCell>
                          <div className="font-medium text-red-600">{payment.totalOwed}€</div>
                          <div className="text-xs text-muted-foreground">
                            {payment.monthsOverdue} {payment.monthsOverdue === 1 ? "Monat" : "Monate"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{payment.daysOverdue} Tage</span>
                          </div>
                        </TableCell>
                        <TableCell>{getDunningLevelBadge(payment.dunningLevel)}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{payment.nextAction}</div>
                          <div className="text-xs text-muted-foreground">
                            Letzte: {payment.lastDunning}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
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
              </CardContent>
            </Card>

            {/* Automated Dunning Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Automatisches Mahnverfahren</CardTitle>
                <CardDescription>Konfigurieren Sie die automatischen Mahnläufe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Automatische 1. Mahnung</div>
                    <div className="text-sm text-muted-foreground">
                      Nach 7 Tagen Zahlungsverzug
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Automatische 2. Mahnung</div>
                    <div className="text-sm text-muted-foreground">
                      Nach 14 Tagen seit 1. Mahnung
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Automatische 3. Mahnung</div>
                    <div className="text-sm text-muted-foreground">
                      Nach 14 Tagen seit 2. Mahnung
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adjustments" className="space-y-4">
            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Geplante Erhöhungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Nächste 3 Monate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ø Erhöhung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,9%</div>
                  <p className="text-xs text-muted-foreground">38,33€ absolut</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Zusätzliche Einnahmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">115€</div>
                  <p className="text-xs text-muted-foreground">Pro Monat</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Letzte Prüfung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15.01.</div>
                  <p className="text-xs text-muted-foreground">Mietspiegel 2025</p>
                </CardContent>
              </Card>
            </div>

            {/* Rent Adjustments Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mietanpassungen</CardTitle>
                    <CardDescription>Geplante und durchgeführte Mieterhöhungen</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Mietspiegel prüfen
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Neue Anpassung
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Neue Mietanpassung</DialogTitle>
                          <DialogDescription>
                            Erstellen Sie eine neue Mieterhöhung
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tenant" className="text-right">
                              Mieter
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Mieter wählen" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="m1">Müller, Anna</SelectItem>
                                <SelectItem value="m2">Weber, Klaus</SelectItem>
                                <SelectItem value="m3">Bauer, Lisa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                              Art
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Art der Erhöhung" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="index">Indexmiete</SelectItem>
                                <SelectItem value="mietspiegel">Nach Mietspiegel</SelectItem>
                                <SelectItem value="modernisierung">Modernisierung</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Neue Miete
                            </Label>
                            <Input id="amount" type="number" className="col-span-3" placeholder="z.B. 695" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Ab Datum
                            </Label>
                            <Input id="date" type="date" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Anpassung erstellen</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mieter</TableHead>
                      <TableHead>Objekt</TableHead>
                      <TableHead>Aktuelle Miete</TableHead>
                      <TableHead>Neue Miete</TableHead>
                      <TableHead>Erhöhung</TableHead>
                      <TableHead>Wirksam ab</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentAdjustments.map((adjustment) => (
                      <TableRow key={adjustment.id}>
                        <TableCell>
                          <div className="font-medium">{adjustment.tenant}</div>
                          <div className="text-xs text-muted-foreground">
                            Letzte Erhöhung: {adjustment.lastIncrease}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{adjustment.property}</div>
                          <div className="text-xs text-muted-foreground">Einheit {adjustment.unit}</div>
                        </TableCell>
                        <TableCell>{adjustment.currentRent}€</TableCell>
                        <TableCell className="font-medium">{adjustment.newRent}€</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">+{adjustment.increase}€</span>
                            <span className="text-sm text-muted-foreground">({adjustment.percentage}%)</span>
                          </div>
                        </TableCell>
                        <TableCell>{adjustment.effectiveDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAdjustmentStatusBadge(adjustment.status)}
                            {adjustment.indexLinked && (
                              <Badge variant="outline" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Index
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
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

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Briefvorlagen</CardTitle>
                    <CardDescription>Vorlagen für Mahnungen und Mietanpassungen</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Vorlage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {letterTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:border-primary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {template.category === "dunning" ? "Mahnvorlage" : "Mietanpassung"}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Vorlage
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Vorschau
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <FileText className="h-4 w-4 mr-1" />
                            Bearbeiten
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Letter Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Briefvorschau</DialogTitle>
              <DialogDescription>
                Vorschau des Mahnschreibens
              </DialogDescription>
            </DialogHeader>
            <div className="border rounded-lg p-8 bg-white min-h-[600px]">
              <div className="space-y-4">
                <div className="text-right text-sm text-gray-600">
                  München, {new Date().toLocaleDateString('de-DE')}
                </div>
                
                <div className="space-y-1">
                  <div className="font-semibold">Maria Wagner</div>
                  <div>Rathausstraße 12</div>
                  <div>80331 München</div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-lg">2. Mahnung - Mietrückstand</h3>
                  
                  <p>Sehr geehrte Frau Wagner,</p>
                  
                  <p>
                    trotz unserer ersten Mahnung vom 10.01.2025 haben wir bisher keine Zahlung von Ihnen erhalten.
                    Ihr Mietrückstand beträgt aktuell:
                  </p>

                  <div className="bg-gray-100 p-4 rounded-lg my-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Dezember 2024:</div>
                      <div className="font-semibold text-right">890,00 €</div>
                      <div>Januar 2025:</div>
                      <div className="font-semibold text-right">890,00 €</div>
                      <div className="border-t pt-2 font-bold">Gesamt:</div>
                      <div className="border-t pt-2 font-bold text-right text-red-600">1.780,00 €</div>
                    </div>
                  </div>

                  <p>
                    Wir fordern Sie hiermit letztmalig auf, den ausstehenden Betrag bis spätestens
                    <span className="font-semibold"> 05.02.2025</span> auf unser Konto zu überweisen.
                  </p>

                  <p>
                    Sollte bis zu diesem Zeitpunkt keine Zahlung eingehen, werden wir ohne weitere
                    Ankündigung rechtliche Schritte einleiten.
                  </p>

                  <div className="mt-8">
                    <p>Mit freundlichen Grüßen</p>
                    <p className="mt-4">SEV Property Management GmbH</p>
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

// Import the Switch component
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"