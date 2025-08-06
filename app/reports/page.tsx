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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Send,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  Mail,
  Eye,
  Plus,
  Edit,
  Copy,
  Building2,
  Euro,
  Home,
  RefreshCw,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for scheduled reports
const scheduledReports = [
  {
    id: "REP001",
    name: "Monatliche Eigentümerübersicht",
    type: "owner_summary",
    recipients: ["eigentümer@sev-linkerstr27.de", "verwaltung@example.com"],
    frequency: "monthly",
    dayOfMonth: 1,
    lastSent: "01.01.2025",
    nextScheduled: "01.02.2025",
    status: "active",
    properties: ["SEV Linkstr. 27", "SEV Arbestr. 1"],
    includeFinancials: true,
    includeOccupancy: true,
    includeMaintenance: true,
  },
  {
    id: "REP002",
    name: "Quartalsabrechnung WEG",
    type: "weg_quarterly",
    recipients: ["weg-verwaltung@example.com"],
    frequency: "quarterly",
    lastSent: "01.01.2025",
    nextScheduled: "01.04.2025",
    status: "active",
    properties: ["SEV Rathausstr. 12"],
    includeFinancials: true,
    includeExpenses: true,
    includeReserves: true,
  },
  {
    id: "REP003",
    name: "Wöchentlicher Zahlungsstatus",
    type: "payment_status",
    recipients: ["buchhaltung@example.com"],
    frequency: "weekly",
    dayOfWeek: 1, // Monday
    lastSent: "20.01.2025",
    nextScheduled: "27.01.2025",
    status: "paused",
    properties: ["Alle Objekte"],
    includeOverdue: true,
    includeUpcoming: true,
  },
]

// Mock report templates
const reportTemplates = [
  {
    id: "TPL001",
    name: "Eigentümerübersicht",
    type: "owner_summary",
    description: "Monatliche Übersicht für Eigentümer mit Finanzen und Belegung",
    sections: ["Finanzen", "Belegung", "Instandhaltung", "Mieterwechsel"],
  },
  {
    id: "TPL002",
    name: "WEG Quartalsabrechnung",
    type: "weg_quarterly",
    description: "Quartalsweise Abrechnung für WEG-Verwaltung",
    sections: ["Einnahmen/Ausgaben", "Rücklagen", "Hausgeldabrechnung"],
  },
  {
    id: "TPL003",
    name: "Zahlungsstatus",
    type: "payment_status",
    description: "Übersicht über Zahlungseingänge und offene Posten",
    sections: ["Überfällige Zahlungen", "Erwartete Zahlungen", "Zahlungshistorie"],
  },
  {
    id: "TPL004",
    name: "Mieterbewegungen",
    type: "tenant_changes",
    description: "Übersicht über Ein- und Auszüge",
    sections: ["Neue Mieter", "Kündigungen", "Anstehende Wechsel"],
  },
]

// Mock sent reports history
const sentReports = [
  {
    id: "SENT001",
    reportName: "Monatliche Eigentümerübersicht",
    sentDate: "01.01.2025",
    sentTime: "08:00",
    recipients: ["eigentümer@sev-linkerstr27.de", "verwaltung@example.com"],
    status: "delivered",
    size: "2.4 MB",
    opened: true,
    openedDate: "01.01.2025 09:15",
  },
  {
    id: "SENT002",
    reportName: "Quartalsabrechnung WEG",
    sentDate: "01.01.2025",
    sentTime: "08:30",
    recipients: ["weg-verwaltung@example.com"],
    status: "delivered",
    size: "3.1 MB",
    opened: true,
    openedDate: "01.01.2025 10:30",
  },
  {
    id: "SENT003",
    reportName: "Wöchentlicher Zahlungsstatus",
    sentDate: "20.01.2025",
    sentTime: "07:00",
    recipients: ["buchhaltung@example.com"],
    status: "delivered",
    size: "1.2 MB",
    opened: false,
  },
]

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState("scheduled")
  const [createReportOpen, setCreateReportOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<string | null>(null)
  // const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  // const [selectedSections, setSelectedSections] = useState<string[]>([])

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return <Badge variant="secondary">Täglich</Badge>
      case "weekly":
        return <Badge variant="secondary">Wöchentlich</Badge>
      case "monthly":
        return <Badge variant="secondary">Monatlich</Badge>
      case "quarterly":
        return <Badge variant="secondary">Quartalsweise</Badge>
      case "yearly":
        return <Badge variant="secondary">Jährlich</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Aktiv</Badge>
      case "paused":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pausiert</Badge>
      case "delivered":
        return <Badge variant="default" className="bg-green-500"><Mail className="h-3 w-3 mr-1" />Zugestellt</Badge>
      case "failed":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Fehler</Badge>
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
            <Button onClick={() => setCreateReportOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neuen Report erstellen
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Automatische Reports</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Synchronisieren
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheduled">Geplante Reports</TabsTrigger>
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            <TabsTrigger value="history">Versandhistorie</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {scheduledReports.filter(r => r.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">von {scheduledReports.length} geplant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nächster Versand</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">27.01.2025</div>
                  <p className="text-xs text-muted-foreground">in 2 Tagen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Empfänger gesamt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">über alle Reports</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Geplante Reports</CardTitle>
                <CardDescription>Automatisch versendete Reports an Eigentümer und Verwalter</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Empfänger</TableHead>
                      <TableHead>Frequenz</TableHead>
                      <TableHead>Nächster Versand</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{report.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {report.properties.join(", ")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.type === "owner_summary" && <Home className="h-4 w-4" />}
                          {report.type === "weg_quarterly" && <Building2 className="h-4 w-4" />}
                          {report.type === "payment_status" && <Euro className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {report.recipients.length} Empfänger
                            <div className="text-xs text-muted-foreground">
                              {report.recipients[0]}
                              {report.recipients.length > 1 && ` +${report.recipients.length - 1}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getFrequencyBadge(report.frequency)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {report.nextScheduled}
                            <div className="text-xs text-muted-foreground">
                              Zuletzt: {report.lastSent}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingReport(report.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {report.status === "active" ? (
                                <Clock className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
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
                <CardTitle>Report-Vorlagen</CardTitle>
                <CardDescription>Vordefinierte Vorlagen für verschiedene Report-Typen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {reportTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {template.description}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            Verwenden
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Enthaltene Abschnitte:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.sections.map((section, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Versandhistorie</CardTitle>
                <CardDescription>Übersicht über alle versendeten Reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Versanddatum</TableHead>
                      <TableHead>Empfänger</TableHead>
                      <TableHead>Größe</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Geöffnet</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.reportName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {report.sentDate}
                            <div className="text-xs text-muted-foreground">{report.sentTime}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {report.recipients.length} Empfänger
                            <div className="text-xs text-muted-foreground">
                              {report.recipients[0]}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {report.opened ? (
                            <div className="text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <div className="text-xs text-muted-foreground">
                                {report.openedDate}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Nicht geöffnet
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E-Mail Einstellungen</CardTitle>
                <CardDescription>Konfiguration für den automatischen E-Mail-Versand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Absendername</Label>
                    <Input id="sender-name" defaultValue="SEV Property Management" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Absender E-Mail</Label>
                    <Input id="sender-email" type="email" defaultValue="reports@sev-management.de" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Antwort an</Label>
                  <Input id="reply-to" type="email" defaultValue="info@sev-management.de" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report-Einstellungen</CardTitle>
                <CardDescription>Allgemeine Einstellungen für automatische Reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Empfangsbestätigung anfordern</Label>
                    <div className="text-sm text-muted-foreground">
                      Lesebestätigung für versendete Reports anfordern
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reports archivieren</Label>
                    <div className="text-sm text-muted-foreground">
                      Kopie aller versendeten Reports speichern
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fehler-Benachrichtigungen</Label>
                    <div className="text-sm text-muted-foreground">
                      Bei Versandfehlern Administrator benachrichtigen
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Report Dialog */}
        <Dialog open={createReportOpen || editingReport !== null} onOpenChange={(open) => {
          setCreateReportOpen(open)
          if (!open) setEditingReport(null)
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? "Report bearbeiten" : "Neuen automatischen Report erstellen"}
              </DialogTitle>
              <DialogDescription>
                Konfigurieren Sie den automatischen Versand von Reports
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-name" className="text-right">
                  Name
                </Label>
                <Input id="report-name" className="col-span-3" placeholder="z.B. Monatliche Eigentümerübersicht" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-type" className="text-right">
                  Typ
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Report-Typ wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner_summary">Eigentümerübersicht</SelectItem>
                    <SelectItem value="weg_quarterly">WEG Quartalsabrechnung</SelectItem>
                    <SelectItem value="payment_status">Zahlungsstatus</SelectItem>
                    <SelectItem value="tenant_changes">Mieterbewegungen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequenz
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Versandfrequenz wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Täglich</SelectItem>
                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                    <SelectItem value="monthly">Monatlich</SelectItem>
                    <SelectItem value="quarterly">Quartalsweise</SelectItem>
                    <SelectItem value="yearly">Jährlich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Objekte
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all-properties" />
                    <label htmlFor="all-properties" className="text-sm font-medium">
                      Alle Objekte
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prop1" />
                    <label htmlFor="prop1" className="text-sm">
                      SEV Linkstr. 27
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prop2" />
                    <label htmlFor="prop2" className="text-sm">
                      SEV Arbestr. 1
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prop3" />
                    <label htmlFor="prop3" className="text-sm">
                      SEV Rathausstr. 12
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipients" className="text-right">
                  Empfänger
                </Label>
                <Input 
                  id="recipients" 
                  className="col-span-3" 
                  placeholder="E-Mail-Adressen (kommagetrennt)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setCreateReportOpen(false)
                setEditingReport(null)
              }}>
                Abbrechen
              </Button>
              <Button type="submit">
                {editingReport ? "Speichern" : "Report erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}