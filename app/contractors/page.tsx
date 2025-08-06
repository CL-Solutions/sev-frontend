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
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  Hammer,
  Mail,
  Phone,
  Plus,
  Search,
  Settings,
  Star,
  Wrench,
  Zap,
  Droplets,
  Home,
  Paintbrush,
  Lock,
  Trees,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  MapPin,
  User,
  Globe,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for contractors
const contractors = [
  {
    id: "C001",
    name: "Müller Haustechnik GmbH",
    trade: "Heizung/Sanitär",
    contact: "Thomas Müller",
    email: "info@mueller-haustechnik.de",
    phone: "089 123456",
    mobile: "0171 1234567",
    address: "Handwerkerstr. 15, 80331 München",
    website: "www.mueller-haustechnik.de",
    rating: 4.5,
    activeOrders: 2,
    completedOrders: 45,
    assignedProperties: ["SEV Linkstr. 27", "SEV Arbestr. 1", "SEV Theaterstr. 1"],
    specialties: ["Heizungsinstallation", "Rohrbruch", "Wartung"],
    emergencyService: true,
    hourlyRate: 65,
  },
  {
    id: "C002",
    name: "Elektro Schmidt",
    trade: "Elektrik",
    contact: "Peter Schmidt",
    email: "kontakt@elektro-schmidt.de",
    phone: "089 234567",
    mobile: "0172 2345678",
    address: "Elektroweg 8, 80333 München",
    website: "www.elektro-schmidt.de",
    rating: 4.8,
    activeOrders: 1,
    completedOrders: 32,
    assignedProperties: ["SEV Rathausstr. 12", "SEV Bahnhofstr. 5"],
    specialties: ["Installationen", "Smart Home", "Notdienst"],
    emergencyService: true,
    hourlyRate: 70,
  },
  {
    id: "C003",
    name: "Malermeister Weber",
    trade: "Maler/Lackierer",
    contact: "Klaus Weber",
    email: "weber@malermeister.de",
    phone: "089 345678",
    mobile: "0173 3456789",
    address: "Farbenstr. 22, 80331 München",
    website: null,
    rating: 4.2,
    activeOrders: 0,
    completedOrders: 28,
    assignedProperties: ["SEV Linkstr. 27"],
    specialties: ["Innenräume", "Fassaden", "Tapezieren"],
    emergencyService: false,
    hourlyRate: 45,
  },
]

// Mock repair orders
const repairOrders = [
  {
    id: "RO001",
    property: "SEV Linkstr. 27",
    unit: "3",
    tenant: "Fischer, Anna",
    issue: "Heizung funktioniert nicht",
    trade: "Heizung/Sanitär",
    contractor: "Müller Haustechnik GmbH",
    status: "in_progress",
    priority: "high",
    created: "25.01.2025",
    scheduled: "26.01.2025",
    estimatedCost: 250,
  },
  {
    id: "RO002",
    property: "SEV Rathausstr. 12",
    unit: "2",
    tenant: "Bauer, Thomas",
    issue: "Steckdose defekt",
    trade: "Elektrik",
    contractor: "Elektro Schmidt",
    status: "scheduled",
    priority: "medium",
    created: "24.01.2025",
    scheduled: "28.01.2025",
    estimatedCost: 150,
  },
  {
    id: "RO003",
    property: "SEV Linkstr. 27",
    unit: "1",
    tenant: "Ochs, David",
    issue: "Wasserhahn tropft",
    trade: "Heizung/Sanitär",
    contractor: "Müller Haustechnik GmbH",
    status: "completed",
    priority: "low",
    created: "20.01.2025",
    scheduled: "22.01.2025",
    completed: "22.01.2025",
    actualCost: 120,
  },
]

// Trade categories
const trades = [
  { value: "heating_plumbing", label: "Heizung/Sanitär", icon: Droplets },
  { value: "electric", label: "Elektrik", icon: Zap },
  { value: "painter", label: "Maler/Lackierer", icon: Paintbrush },
  { value: "locksmith", label: "Schlosser", icon: Lock },
  { value: "carpenter", label: "Schreiner", icon: Hammer },
  { value: "roofer", label: "Dachdecker", icon: Home },
  { value: "gardener", label: "Gartenbau", icon: Trees },
  { value: "general", label: "Hausmeister", icon: Wrench },
]

export default function ContractorsPage() {
  // const [selectedTab, setSelectedTab] = useState("contractors")
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [newOrderOpen, setNewOrderOpen] = useState(false)

  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch = 
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.contact.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTrade = tradeFilter === "all" || contractor.trade === tradeFilter

    return matchesSearch && matchesTrade
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Geplant</Badge>
      case "in_progress":
        return <Badge variant="default"><Wrench className="h-3 w-3 mr-1" />In Bearbeitung</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Abgeschlossen</Badge>
      case "cancelled":
        return <Badge variant="destructive">Storniert</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Hoch</Badge>
      case "medium":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Mittel</Badge>
      case "low":
        return <Badge variant="secondary">Niedrig</Badge>
      default:
        return null
    }
  }

  const selectedContractorData = contractors.find(c => c.id === selectedContractor)

  return (
    <div className="flex h-screen">
      {/* Contractors List */}
      <div className="w-96 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold flex-1">Handwerker</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Neuer Handwerker
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen Handwerker anlegen</DialogTitle>
                  <DialogDescription>
                    Fügen Sie einen neuen Handwerker oder Dienstleister hinzu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Firma
                    </Label>
                    <Input id="company" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="trade" className="text-right">
                      Gewerk
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Gewerk wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {trades.map((trade) => (
                          <SelectItem key={trade.value} value={trade.value}>
                            <div className="flex items-center gap-2">
                              <trade.icon className="h-4 w-4" />
                              {trade.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Ansprechpartner
                    </Label>
                    <Input id="contact" className="col-span-3" />
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
                  <Button type="submit">Handwerker anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Handwerker suchen..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Alle Gewerke" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Gewerke</SelectItem>
                {trades.map((trade) => (
                  <SelectItem key={trade.value} value={trade.label}>
                    <div className="flex items-center gap-2">
                      <trade.icon className="h-4 w-4" />
                      {trade.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-2">
          {filteredContractors.map((contractor) => (
            <Card
              key={contractor.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedContractor === contractor.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedContractor(contractor.id)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {contractor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{contractor.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {contractor.trade} • {contractor.contact}
                      </CardDescription>
                    </div>
                  </div>
                  {contractor.emergencyService && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      24/7
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{contractor.rating}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {contractor.activeOrders > 0 ? (
                        <span className="text-orange-600">{contractor.activeOrders} aktiv</span>
                      ) : (
                        <span>Verfügbar</span>
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {contractor.hourlyRate}€/h
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contractor Details */}
      <div className="flex-1 overflow-auto">
        {selectedContractorData ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedContractorData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedContractorData.name}</h2>
                    <p className="text-muted-foreground">{selectedContractorData.trade}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedContractorData.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({selectedContractorData.completedOrders} Aufträge)
                        </span>
                      </div>
                      {selectedContractorData.emergencyService && (
                        <Badge variant="outline">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          24/7 Notdienst
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Anrufen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail senden
                  </Button>
                  <Button size="sm" onClick={() => setNewOrderOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Auftrag
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="orders">Aufträge</TabsTrigger>
                <TabsTrigger value="properties">Objekte</TabsTrigger>
                <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Aktive Aufträge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedContractorData.activeOrders}</div>
                      <p className="text-xs text-muted-foreground">In Bearbeitung</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedContractorData.completedOrders}</div>
                      <p className="text-xs text-muted-foreground">Dieses Jahr</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Stundensatz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedContractorData.hourlyRate}€</div>
                      <p className="text-xs text-muted-foreground">Pro Stunde</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12.450€</div>
                      <p className="text-xs text-muted-foreground">Dieses Jahr</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Kontaktinformationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4" /> Ansprechpartner
                        </dt>
                        <dd className="text-sm font-semibold">{selectedContractorData.contact}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" /> E-Mail
                        </dt>
                        <dd className="text-sm font-semibold">{selectedContractorData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Telefon
                        </dt>
                        <dd className="text-sm font-semibold">{selectedContractorData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Mobil
                        </dt>
                        <dd className="text-sm font-semibold">{selectedContractorData.mobile}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Adresse
                        </dt>
                        <dd className="text-sm font-semibold">{selectedContractorData.address}</dd>
                      </div>
                      {selectedContractorData.website && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Webseite
                          </dt>
                          <dd className="text-sm font-semibold">
                            <a href={`https://${selectedContractorData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedContractorData.website}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Spezialisierungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedContractorData.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Auftragshistorie</CardTitle>
                    <CardDescription>Alle Aufträge dieses Handwerkers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Auftrag</TableHead>
                          <TableHead>Objekt</TableHead>
                          <TableHead>Problem</TableHead>
                          <TableHead>Priorität</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Termin</TableHead>
                          <TableHead>Kosten</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {repairOrders
                          .filter(order => order.contractor === selectedContractorData.name)
                          .map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>
                                <div className="text-sm">{order.property}</div>
                                <div className="text-xs text-muted-foreground">Einheit {order.unit}</div>
                              </TableCell>
                              <TableCell>{order.issue}</TableCell>
                              <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell>
                                <div className="text-sm">{order.scheduled}</div>
                                {order.completed && (
                                  <div className="text-xs text-green-600">✓ {order.completed}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                {order.actualCost ? (
                                  <div>
                                    <div className="font-medium">{order.actualCost}€</div>
                                    <div className="text-xs text-muted-foreground line-through">
                                      {order.estimatedCost}€
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground">~{order.estimatedCost}€</div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Zugewiesene Objekte</CardTitle>
                    <CardDescription>Objekte, für die dieser Handwerker zuständig ist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {selectedContractorData.assignedProperties.map((property, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{property}</div>
                              <div className="text-sm text-muted-foreground">
                                Zuständig für: {selectedContractorData.trade}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Verwalten
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rechnungen</CardTitle>
                    <CardDescription>Eingegangene Rechnungen dieses Handwerkers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Noch keine Rechnungen vorhanden</p>
                      <Button className="mt-4" variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Rechnung hinzufügen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* New Order Dialog */}
            <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen Reparaturauftrag erstellen</DialogTitle>
                  <DialogDescription>
                    Beauftragen Sie {selectedContractorData.name} mit einer Reparatur
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
                        {selectedContractorData.assignedProperties.map((property) => (
                          <SelectItem key={property} value={property}>
                            {property}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">
                      Einheit
                    </Label>
                    <Input id="unit" className="col-span-3" placeholder="z.B. 3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="issue" className="text-right">
                      Problem
                    </Label>
                    <Textarea id="issue" className="col-span-3" placeholder="Beschreiben Sie das Problem..." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priorität
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Priorität wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Hoch - Notfall</SelectItem>
                        <SelectItem value="medium">Mittel - Zeitnah</SelectItem>
                        <SelectItem value="low">Niedrig - Planbar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setNewOrderOpen(false)}>
                    <Send className="mr-2 h-4 w-4" />
                    Auftrag erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Kein Handwerker ausgewählt</h3>
              <p className="text-sm text-muted-foreground">
                Wählen Sie einen Handwerker aus der Liste aus, um Details anzuzeigen
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}