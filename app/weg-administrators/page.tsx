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
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Search,
  Calendar,
  FileText,
  Edit,
  Globe,
  Briefcase,
  CheckCircle2,
  Building,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for WEG administrators
const wegAdministrators = [
  {
    id: "WEG001",
    company: "HausVerwaltung München GmbH",
    contactPerson: "Dr. Michael Weber",
    email: "weber@hausverwaltung-muenchen.de",
    phone: "089 123456",
    mobile: "0171 1234567",
    address: "Maximilianstr. 25, 80539 München",
    website: "www.hausverwaltung-muenchen.de",
    properties: [
      {
        id: "PROP001",
        name: "SEV Rathausstr. 12",
        units: 12,
        adminSince: "01.01.2020",
        contractEnd: "31.12.2025",
      },
      {
        id: "PROP002",
        name: "SEV Theaterstr. 1",
        units: 8,
        adminSince: "01.07.2021",
        contractEnd: "30.06.2026",
      },
    ],
    specializations: ["WEG-Verwaltung", "Sondereigentumsverwaltung", "Mietverwaltung"],
    certifications: ["Verwalter-Zertifikat nach §26a WEG", "IHK Sachkundenachweis"],
    employees: 15,
    foundedYear: 2005,
  },
  {
    id: "WEG002",
    company: "Immobilien Service Bayern",
    contactPerson: "Sabine Müller",
    email: "info@isb-verwaltung.de",
    phone: "089 234567",
    mobile: "0172 2345678",
    address: "Leopoldstr. 100, 80802 München",
    website: "www.isb-verwaltung.de",
    properties: [
      {
        id: "PROP003",
        name: "SEV Bahnhofstr. 5",
        units: 20,
        adminSince: "01.01.2019",
        contractEnd: "31.12.2024",
      },
    ],
    specializations: ["WEG-Verwaltung", "Gewerbeverwaltung"],
    certifications: ["Verwalter-Zertifikat nach §26a WEG"],
    employees: 8,
    foundedYear: 2010,
  },
]

// Mock communications
const wegCommunications = [
  {
    id: "COMM001",
    administratorId: "WEG001",
    type: "email",
    subject: "Jahresabrechnung 2024 - SEV Rathausstr. 12",
    date: "15.01.2025",
    direction: "incoming",
    attachments: 3,
  },
  {
    id: "COMM002",
    administratorId: "WEG001",
    type: "phone",
    subject: "Rückfrage Instandhaltungsrücklage",
    date: "20.01.2025",
    direction: "outgoing",
    duration: "15 Min",
  },
  {
    id: "COMM003",
    administratorId: "WEG002",
    type: "email",
    subject: "Eigentümerversammlung - Einladung",
    date: "10.01.2025",
    direction: "incoming",
    attachments: 1,
  },
]

// Mock meetings
const wegMeetings = [
  {
    id: "MEET001",
    title: "Ordentliche Eigentümerversammlung",
    property: "SEV Rathausstr. 12",
    administratorId: "WEG001",
    date: "15.02.2025",
    time: "19:00",
    location: "Büro HausVerwaltung München",
    status: "scheduled",
    agenda: ["Jahresabrechnung 2024", "Wirtschaftsplan 2025", "Instandhaltungsmaßnahmen"],
  },
  {
    id: "MEET002",
    title: "Außerordentliche Eigentümerversammlung",
    property: "SEV Bahnhofstr. 5",
    administratorId: "WEG002",
    date: "01.03.2025",
    time: "18:00",
    location: "Online (Zoom)",
    status: "scheduled",
    agenda: ["Dachsanierung", "Sonderumlage"],
  },
]

export default function WEGAdministratorsPage() {
  // const [selectedTab, setSelectedTab] = useState("administrators")
  const [selectedAdministrator, setSelectedAdministrator] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [addPropertyOpen, setAddPropertyOpen] = useState(false)

  const filteredAdministrators = wegAdministrators.filter((admin) => {
    const matchesSearch = 
      admin.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.properties.some(prop => prop.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  const selectedAdminData = wegAdministrators.find(a => a.id === selectedAdministrator)

  const getContractStatusBadge = (endDate: string) => {
    const end = new Date(endDate.split('.').reverse().join('-'))
    const today = new Date()
    const monthsRemaining = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
    
    if (monthsRemaining < 0) {
      return <Badge variant="destructive">Abgelaufen</Badge>
    } else if (monthsRemaining < 6) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Läuft aus</Badge>
    } else {
      return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Aktiv</Badge>
    }
  }

  return (
    <div className="flex h-screen">
      {/* Administrators List */}
      <div className="w-96 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold flex-1">WEG Verwalter</h1>
            <Button size="sm" onClick={() => setAddAdminOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Neuer Verwalter
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Verwalter oder Objekt suchen..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-2">
          {filteredAdministrators.map((admin) => (
            <Card
              key={admin.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedAdministrator === admin.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedAdministrator(admin.id)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {admin.company.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{admin.company}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {admin.contactPerson}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {admin.properties.length} {admin.properties.length === 1 ? 'Objekt' : 'Objekte'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-1">
                  {admin.properties.slice(0, 2).map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{prop.name}</span>
                      {getContractStatusBadge(prop.contractEnd)}
                    </div>
                  ))}
                  {admin.properties.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{admin.properties.length - 2} weitere
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Administrator Details */}
      <div className="flex-1 overflow-auto">
        {selectedAdminData ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedAdminData.company.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAdminData.company}</h2>
                    <p className="text-muted-foreground">{selectedAdminData.contactPerson}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Gegründet {selectedAdminData.foundedYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedAdminData.employees} Mitarbeiter
                      </span>
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
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="properties">Verwaltete Objekte</TabsTrigger>
                <TabsTrigger value="communications">Kommunikation</TabsTrigger>
                <TabsTrigger value="meetings">Versammlungen</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
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
                        <dd className="text-sm font-semibold">{selectedAdminData.contactPerson}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" /> E-Mail
                        </dt>
                        <dd className="text-sm font-semibold">{selectedAdminData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Telefon
                        </dt>
                        <dd className="text-sm font-semibold">{selectedAdminData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Mobil
                        </dt>
                        <dd className="text-sm font-semibold">{selectedAdminData.mobile}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Adresse
                        </dt>
                        <dd className="text-sm font-semibold">{selectedAdminData.address}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Globe className="h-4 w-4" /> Webseite
                        </dt>
                        <dd className="text-sm font-semibold">
                          <a href={`https://${selectedAdminData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedAdminData.website}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Qualifikationen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Spezialisierungen</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAdminData.specializations.map((spec, idx) => (
                          <Badge key={idx} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Zertifizierungen</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAdminData.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Verwaltete Objekte</h3>
                  <Button size="sm" onClick={() => setAddPropertyOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Objekt zuweisen
                  </Button>
                </div>

                <div className="grid gap-4">
                  {selectedAdminData.properties.map((property) => (
                    <Card key={property.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-base">{property.name}</CardTitle>
                              <CardDescription>
                                {property.units} Einheiten • Verwaltung seit {property.adminSince}
                              </CardDescription>
                            </div>
                          </div>
                          {getContractStatusBadge(property.contractEnd)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Vertragsbeginn:</span>
                            <span className="ml-2 font-medium">{property.adminSince}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vertragsende:</span>
                            <span className="ml-2 font-medium">{property.contractEnd}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Vertrag anzeigen
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Verlängern
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Kommunikationshistorie</CardTitle>
                    <CardDescription>Alle E-Mails, Anrufe und Briefe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Typ</TableHead>
                          <TableHead>Betreff</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Richtung</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wegCommunications
                          .filter(comm => comm.administratorId === selectedAdminData.id)
                          .map((comm) => (
                            <TableRow key={comm.id}>
                              <TableCell>
                                {comm.type === "email" ? (
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{comm.subject}</TableCell>
                              <TableCell>{comm.date}</TableCell>
                              <TableCell>
                                {comm.direction === "incoming" ? (
                                  <Badge variant="secondary">Eingang</Badge>
                                ) : (
                                  <Badge variant="outline">Ausgang</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {'attachments' in comm && comm.attachments && (
                                  <Badge variant="outline" className="text-xs">
                                    {comm.attachments} Anhänge
                                  </Badge>
                                )}
                                {'duration' in comm && comm.duration && (
                                  <span className="text-xs text-muted-foreground">{comm.duration}</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="meetings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Eigentümerversammlungen</CardTitle>
                    <CardDescription>Anstehende und vergangene Versammlungen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wegMeetings
                        .filter(meeting => meeting.administratorId === selectedAdminData.id)
                        .map((meeting) => (
                          <Card key={meeting.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{meeting.title}</CardTitle>
                                  <CardDescription>
                                    {meeting.property} • {meeting.date} um {meeting.time}
                                  </CardDescription>
                                </div>
                                <Badge variant="default">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Geplant
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  {meeting.location}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Tagesordnung:</h4>
                                  <ol className="list-decimal list-inside text-sm text-muted-foreground">
                                    {meeting.agenda.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dokumente</CardTitle>
                    <CardDescription>Verträge, Protokolle und weitere Unterlagen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Noch keine Dokumente vorhanden</p>
                      <Button className="mt-4" variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Dokument hochladen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Add Administrator Dialog */}
            <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen WEG-Verwalter anlegen</DialogTitle>
                  <DialogDescription>
                    Fügen Sie einen neuen WEG-Verwalter hinzu
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
                  <Button type="submit">Verwalter anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Property Dialog */}
            <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Objekt zuweisen</DialogTitle>
                  <DialogDescription>
                    Weisen Sie diesem Verwalter ein Objekt zu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="property" className="text-right">
                      Objekt
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Objekt auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sev-linkstr">SEV Linkstr. 27</SelectItem>
                        <SelectItem value="sev-arbestr">SEV Arbestr. 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start" className="text-right">
                      Verwaltung ab
                    </Label>
                    <Input id="start" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end" className="text-right">
                      Vertragsende
                    </Label>
                    <Input id="end" type="date" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Zuweisen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Kein Verwalter ausgewählt</h3>
              <p className="text-sm text-muted-foreground">
                Wählen Sie einen WEG-Verwalter aus der Liste aus
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}