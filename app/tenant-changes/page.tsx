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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
import { de } from "date-fns/locale"
// import { cn } from "@/lib/utils"
import {
  UserPlus,
  UserMinus,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowRight,
  Home,
  Mail,
  Phone,
  Search,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for tenant changes
const tenantChanges = [
  {
    id: "TC001",
    property: "SEV Linkstr. 27",
    unit: "1",
    currentTenant: "Ochs, David",
    newTenant: "Bauer, Thomas",
    moveOutDate: "31.05.2025",
    moveInDate: "01.06.2025",
    status: "scheduled",
    handoverScheduled: true,
    documentsComplete: false,
    depositTransferred: false,
    prospectCount: 3,
  },
  {
    id: "TC002",
    property: "SEV Arbestr. 1",
    unit: "5",
    currentTenant: "Weber, Klaus",
    newTenant: null,
    moveOutDate: "28.02.2025",
    moveInDate: null,
    status: "searching",
    handoverScheduled: false,
    documentsComplete: true,
    depositTransferred: false,
    prospectCount: 7,
  },
  {
    id: "TC003",
    property: "SEV Theaterstr. 1",
    unit: "3",
    currentTenant: "Meyer, Sandra",
    newTenant: "Fischer, Julia",
    moveOutDate: "31.03.2025",
    moveInDate: "15.04.2025",
    status: "gap_period",
    handoverScheduled: true,
    documentsComplete: true,
    depositTransferred: true,
    prospectCount: 0,
  },
  {
    id: "TC004",
    property: "SEV Rathausstr. 12",
    unit: "2",
    currentTenant: "Schulz, Peter",
    newTenant: "Hofmann, Maria",
    moveOutDate: "15.01.2025",
    moveInDate: "16.01.2025",
    status: "completed",
    handoverScheduled: true,
    documentsComplete: true,
    depositTransferred: true,
    prospectCount: 0,
  },
]

// Mock data for rental prospects
const rentalProspects = [
  {
    id: "RP001",
    name: "Bauer, Thomas",
    email: "thomas.bauer@email.de",
    phone: "0171 1234567",
    interestedIn: ["SEV Linkstr. 27 - Unit 1"],
    viewingDate: "20.04.2025",
    status: "selected",
    income: "3.500€",
    occupation: "Ingenieur",
    moveInDate: "01.06.2025",
    familySize: 2,
    notes: "Sehr gute Bonität, ruhiger Mieter",
  },
  {
    id: "RP002",
    name: "Klein, Sarah",
    email: "sarah.klein@email.de",
    phone: "0172 2345678",
    interestedIn: ["SEV Arbestr. 1 - Unit 5", "SEV Linkstr. 27 - Unit 1"],
    viewingDate: "15.02.2025",
    status: "viewing_scheduled",
    income: "2.800€",
    occupation: "Lehrerin",
    moveInDate: "01.03.2025",
    familySize: 1,
    notes: "Sucht 2-Zimmer-Wohnung",
  },
  {
    id: "RP003",
    name: "Wagner, Michael",
    email: "m.wagner@email.de",
    phone: "0173 3456789",
    interestedIn: ["SEV Arbestr. 1 - Unit 5"],
    viewingDate: null,
    status: "contacted",
    income: "4.200€",
    occupation: "Selbstständig",
    moveInDate: "01.04.2025",
    familySize: 3,
    notes: "Familie mit Kind",
  },
]

export default function TenantChangesPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  // const [selectedChange, setSelectedChange] = useState<string | null>(null)
  // const [selectedProspect, setSelectedProspect] = useState<string | null>(null)

  const filteredChanges = tenantChanges.filter((change) => {
    const matchesSearch = 
      change.currentTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (change.newTenant && change.newTenant.toLowerCase().includes(searchQuery.toLowerCase())) ||
      change.property.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || change.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" />Geplant</Badge>
      case "searching":
        return <Badge variant="secondary"><Search className="h-3 w-3 mr-1" />Nachmieter gesucht</Badge>
      case "gap_period":
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Leerstand</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Abgeschlossen</Badge>
      default:
        return null
    }
  }

  const getProspectStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge variant="default" className="bg-green-500">Ausgewählt</Badge>
      case "viewing_scheduled":
        return <Badge variant="default">Besichtigung geplant</Badge>
      case "contacted":
        return <Badge variant="secondary">Kontaktiert</Badge>
      case "rejected":
        return <Badge variant="destructive">Abgelehnt</Badge>
      default:
        return <Badge variant="outline">Neu</Badge>
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Mieterwechsel & Nachfolge</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="changes">Mieterwechsel</TabsTrigger>
            <TabsTrigger value="prospects">Interessenten</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Anstehende Wechsel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Nächste 3 Monate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nachmieter gesucht</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Offene Positionen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Interessenten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Aktive Bewerber</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Leerstandstage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground">Ø diese Jahr</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Kommende Mieterwechsel</CardTitle>
                <CardDescription>Die nächsten geplanten Wechsel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredChanges.filter(c => c.status !== "completed").slice(0, 5).map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{change.property} - Einheit {change.unit}</span>
                          {getStatusBadge(change.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <UserMinus className="h-3 w-3" />
                          <span>{change.currentTenant}</span>
                          <ArrowRight className="h-3 w-3" />
                          {change.newTenant ? (
                            <>
                              <UserPlus className="h-3 w-3" />
                              <span>{change.newTenant}</span>
                            </>
                          ) : (
                            <span className="text-orange-600">Nachmieter gesucht</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Auszug: {change.moveOutDate}</span>
                          {change.moveInDate && <span>Einzug: {change.moveInDate}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {change.handoverScheduled && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {change.documentsComplete && (
                            <FileText className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen nach Mieter oder Objekt..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="scheduled">Geplant</SelectItem>
                  <SelectItem value="searching">Nachmieter gesucht</SelectItem>
                  <SelectItem value="gap_period">Leerstand</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Mieterwechsel anlegen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Mieterwechsel anlegen</DialogTitle>
                    <DialogDescription>
                      Erfassen Sie die Details des geplanten Mieterwechsels
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="property" className="text-right">
                        Objekt
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Objekt wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sev1">SEV Linkstr. 27</SelectItem>
                          <SelectItem value="sev2">SEV Arbestr. 1</SelectItem>
                          <SelectItem value="sev3">SEV Theaterstr. 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Einheit
                      </Label>
                      <Input id="unit" className="col-span-3" placeholder="z.B. 1" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="moveout" className="text-right">
                        Auszugsdatum
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="col-span-3 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Datum wählen
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            locale={de}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Anlegen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Changes Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Objekt / Einheit</TableHead>
                    <TableHead>Aktueller Mieter</TableHead>
                    <TableHead>Nachmieter</TableHead>
                    <TableHead>Auszug</TableHead>
                    <TableHead>Einzug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fortschritt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChanges.map((change) => (
                    <TableRow key={change.id}>
                      <TableCell>
                        <div className="font-medium">{change.property}</div>
                        <div className="text-sm text-muted-foreground">Einheit {change.unit}</div>
                      </TableCell>
                      <TableCell>{change.currentTenant}</TableCell>
                      <TableCell>
                        {change.newTenant || (
                          <span className="text-orange-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Nicht besetzt
                          </span>
                        )}
                        {change.prospectCount > 0 && !change.newTenant && (
                          <Badge variant="outline" className="ml-2">
                            {change.prospectCount} Interessenten
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{change.moveOutDate}</TableCell>
                      <TableCell>{change.moveInDate || "-"}</TableCell>
                      <TableCell>{getStatusBadge(change.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {change.documentsComplete ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-300" />
                          )}
                          {change.handoverScheduled ? (
                            <CalendarIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <CalendarIcon className="h-4 w-4 text-gray-300" />
                          )}
                          {change.depositTransferred ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mietinteressenten</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Interessent hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Interessenten erfassen</DialogTitle>
                    <DialogDescription>
                      Erfassen Sie die Kontaktdaten des Mietinteressenten
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" className="col-span-3" />
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="income" className="text-right">
                        Einkommen
                      </Label>
                      <Input id="income" className="col-span-3" placeholder="z.B. 3.500€" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Speichern</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Prospects Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rentalProspects.map((prospect) => (
                <Card key={prospect.id} className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{prospect.name}</CardTitle>
                        <CardDescription>{prospect.occupation}</CardDescription>
                      </div>
                      {getProspectStatusBadge(prospect.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{prospect.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{prospect.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Interessiert an:</p>
                      <div className="flex flex-wrap gap-1">
                        {prospect.interestedIn.map((property, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {property}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Einkommen:</span>
                      <span className="font-medium">{prospect.income}</span>
                    </div>

                    {prospect.viewingDate && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        <span>Besichtigung: {prospect.viewingDate}</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-1" />
                        E-Mail
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Anrufen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}