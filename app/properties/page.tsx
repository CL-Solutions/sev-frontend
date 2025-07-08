"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
  Building2,
  Plus,
  Search,
  Home,
  Users,
  Euro,
  Mail,
  FileText,
  Upload,
  Download,
  Eye,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for properties
const properties = [
  {
    id: "660",
    objNumber: "26", 
    name: "SEV Linkstr. 27",
    type: "WE", // Single apartment unit
    address: {
      street: "Linkerstraße 27",
      plz: "80933",
      city: "München",
    },
    totalRooms: 3, // This WE has 3 rooms
    occupiedRooms: 3, // All occupied
    monthlyRent: 825,
    yearBuilt: 1996,
    heatingType: "Öl-Zentralheizung",
    managementStart: "01.10.2021",
    client: "26",
    rentedAs: "apartment", // Rented as whole apartment
    owner: {
      id: "1",
      name: "Müller, Thomas",
      email: "thomas.mueller@email.de",
      managementFee: 50, // Fixed fee for 1 unit
    },
  },
  {
    id: "661",
    objNumber: "27",
    name: "SEV Arbestr. 1",
    type: "Mehrfamilienhaus", // Multi-family building
    address: {
      street: "Arbeiterstraße 1",
      plz: "80933",
      city: "München",
    },
    units: 3, // Has 3 WE units
    totalRooms: 9, // Total rooms across all WE
    occupiedRooms: 8,
    monthlyRent: 2385,
    yearBuilt: 1985,
    heatingType: "Gas-Zentralheizung",
    managementStart: "01.01.2020",
    client: "26",
    owner: {
      id: "2",
      name: "Schmidt, Andrea",
      email: "andrea.schmidt@email.de",
      managementFee: 150, // Fixed fee for 3 units
    },
  },
  {
    id: "662",
    objNumber: "28",
    name: "SEV Theaterstr. 1",
    type: "WE", // Single apartment unit
    address: {
      street: "Theaterstraße 1",
      plz: "80333",
      city: "München",
    },
    totalRooms: 4, // This WE has 4 rooms
    occupiedRooms: 3, // 3 occupied as WG
    monthlyRent: 1335,
    yearBuilt: 2001,
    heatingType: "Fernwärme",
    managementStart: "01.04.2022",
    client: "26",
    rentedAs: "wg", // Rented as WG (individual rooms)
    owner: {
      id: "1",
      name: "Müller, Thomas",
      email: "thomas.mueller@email.de",
      managementFee: 120, // Fixed fee for 3-person WG
    },
  },
]

// Mock tenant mapping for cross-references
const tenantMapping = {
  "Ochs, David": { id: "1", email: "david.ochs@email.de" },
  "Müller, Anna": { id: "2", email: "anna.mueller@email.de" },
  "Schmidt, Peter": { id: "3", email: "p.schmidt@email.de" },
  "Wagner, Maria": { id: "4", email: "m.wagner@email.de" },
  "Fischer, Tom": { id: "5", email: "tom.fischer@email.de" },
  "Weber, Klaus": { id: "6", email: "klaus.weber@email.de" },
  "Schulz, Lisa": { id: "7", email: "lisa.schulz@email.de" },
  "Becker, Hans": { id: "8", email: "hans.becker@email.de" },
}

// Mock units data with hierarchical structure
const units = {
  "660": [ // Single WE - rented as whole apartment
    { number: "Zimmer 1", tenant: "Ochs, David", rent: 275, size: 25, moveIn: "15.04.2025", moveOut: "31.05.2025" },
    { number: "Zimmer 2", tenant: "Ochs, David", rent: 275, size: 25, moveIn: "15.04.2025", moveOut: "31.05.2025" },
    { number: "Zimmer 3", tenant: "Ochs, David", rent: 275, size: 25, moveIn: "15.04.2025", moveOut: "31.05.2025" },
  ],
  "661": [ // Mehrfamilienhaus - has multiple WE units
    { 
      id: "661-WE1",
      number: "WE 1", 
      type: "unit",
      rooms: [
        { number: "Zimmer 1", tenant: "Müller, Anna", rent: 245, size: 22, moveIn: "01.01.2023" },
        { number: "Zimmer 2", tenant: "Müller, Anna", rent: 245, size: 22, moveIn: "01.01.2023" },
        { number: "Zimmer 3", tenant: "Müller, Anna", rent: 245, size: 21, moveIn: "01.01.2023" },
      ],
      totalRent: 735,
      totalSize: 65,
      rentedAs: "apartment"
    },
    { 
      id: "661-WE2",
      number: "WE 2", 
      type: "unit",
      rooms: [
        { number: "Zimmer 1", tenant: "Schmidt, Peter", rent: 220, size: 18, moveIn: "01.06.2022" },
        { number: "Zimmer 2", tenant: "Schmidt, Peter", rent: 220, size: 18, moveIn: "01.06.2022" },
        { number: "Zimmer 3", tenant: "Schmidt, Peter", rent: 210, size: 14, moveIn: "01.06.2022" },
      ],
      totalRent: 650,
      totalSize: 50,
      rentedAs: "apartment"
    },
    { 
      id: "661-WE3",
      number: "WE 3", 
      type: "unit",
      rooms: [
        { number: "Zimmer 1", tenant: "Frei", rent: 250, size: 30, moveIn: null },
        { number: "Zimmer 2", tenant: "Fischer, Tom", rent: 300, size: 25, moveIn: "01.03.2024" },
        { number: "Zimmer 3", tenant: "Weber, Klaus", rent: 400, size: 35, moveIn: "01.02.2024" },
      ],
      totalRent: 1000,
      totalSize: 90,
      rentedAs: "wg" // Rented as WG - individual rooms
    },
  ],
  "662": [ // Single WE - rented as WG (individual rooms)
    { number: "Zimmer 1", tenant: "Wagner, Maria", rent: 445, size: 30, moveIn: "01.03.2021" },
    { number: "Zimmer 2", tenant: "Becker, Hans", rent: 445, size: 32, moveIn: "01.05.2021" },
    { number: "Zimmer 3", tenant: "Schulz, Lisa", rent: 445, size: 28, moveIn: "01.07.2021" },
    { number: "Zimmer 4", tenant: "Frei", rent: 400, size: 25, moveIn: null },
  ],
}

function PropertiesPageContent() {
  const searchParams = useSearchParams()
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailContext, setEmailContext] = useState<{
    type: 'tenant' | 'property' | 'document' | 'payment';
    property?: {
      name: string;
      address: string;
    };
    recipients: Array<{
      name: string;
      email: string;
    }>;
  } | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  // Check for property ID in URL parameters
  useEffect(() => {
    const propertyId = searchParams.get('id')
    if (propertyId && properties.find(p => p.id === propertyId)) {
      setSelectedProperty(propertyId)
    }
  }, [searchParams])

  // Helper function to render tenant name with link
  const renderTenantLink = (tenantName: string) => {
    if (tenantName === "Frei") return <span className="text-muted-foreground">Frei</span>
    
    const tenantInfo = tenantMapping[tenantName as keyof typeof tenantMapping]
    if (tenantInfo) {
      return (
        <Link 
          href={`/tenants?id=${tenantInfo.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {tenantName}
        </Link>
      )
    }
    return tenantName
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedPropertyData = properties.find((p) => p.id === selectedProperty)

  return (
    <div className="flex h-screen">
      {/* Properties List */}
      <div className="w-96 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold flex-1">Objekte</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Neues Objekt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Objekt anlegen</DialogTitle>
                  <DialogDescription>
                    Fügen Sie ein neues Verwaltungsobjekt hinzu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="obj-name" className="text-right">
                      Name
                    </Label>
                    <Input id="obj-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="obj-street" className="text-right">
                      Straße
                    </Label>
                    <Input id="obj-street" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="obj-plz" className="text-right">
                      PLZ
                    </Label>
                    <Input id="obj-plz" className="col-span-1" />
                    <Label htmlFor="obj-city" className="text-right">
                      Ort
                    </Label>
                    <Input id="obj-city" className="col-span-1" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Objekt anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Objekte suchen..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-2">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedProperty === property.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedProperty(property.id)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{property.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {property.address.street}, {property.address.plz} {property.address.city}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {property.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Home className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {property.type === "Mehrfamilienhaus" 
                        ? `${property.units} WE / ${property.occupiedRooms}/${property.totalRooms} Zimmer`
                        : property.type === "WE"
                        ? `${property.occupiedRooms}/${property.totalRooms} Zimmer`
                        : `${property.occupiedRooms}/${property.totalRooms} Zimmer`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3 text-muted-foreground" />
                    <span>{property.monthlyRent.toLocaleString('de-DE')}€/Monat</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="flex-1 overflow-auto">
        {selectedPropertyData ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{selectedPropertyData.name}</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Get all tenants for this property
                    const propertyTenants = []
                    const propertyUnits = units[selectedPropertyData.id as keyof typeof units]
                    
                    if (propertyUnits) {
                      if (selectedPropertyData.type === "Mehrfamilienhaus") {
                        // Multi-family building - collect tenants from all units
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        propertyUnits.forEach((unit: any) => {
                          if ('rentedAs' in unit && unit.rentedAs === "apartment" && unit.rooms[0].tenant !== "Frei") {
                            // Apartment rental - add once
                            const tenantInfo = tenantMapping[unit.rooms[0].tenant as keyof typeof tenantMapping]
                            if (tenantInfo) {
                              propertyTenants.push({
                                name: unit.rooms[0].tenant,
                                email: tenantInfo.email
                              })
                            }
                          } else if ('rentedAs' in unit && unit.rentedAs === "wg") {
                            // WG - add each tenant
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            unit.rooms.forEach((room: any) => {
                              if (room.tenant !== "Frei") {
                                const tenantInfo = tenantMapping[room.tenant as keyof typeof tenantMapping]
                                if (tenantInfo) {
                                  propertyTenants.push({
                                    name: room.tenant,
                                    email: tenantInfo.email
                                  })
                                }
                              }
                            })
                          }
                        })
                      } else {
                        // Single unit
                        if (selectedPropertyData.rentedAs === "apartment" && 'tenant' in propertyUnits[0] && propertyUnits[0]?.tenant !== "Frei") {
                          const tenantInfo = tenantMapping[propertyUnits[0].tenant as keyof typeof tenantMapping]
                          if (tenantInfo) {
                            propertyTenants.push({
                              name: propertyUnits[0].tenant,
                              email: tenantInfo.email
                            })
                          }
                        } else if (selectedPropertyData.rentedAs === "wg") {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          propertyUnits.forEach((room: any) => {
                            if (room.tenant !== "Frei") {
                              const tenantInfo = tenantMapping[room.tenant as keyof typeof tenantMapping]
                              if (tenantInfo) {
                                propertyTenants.push({
                                  name: room.tenant,
                                  email: tenantInfo.email
                                })
                              }
                            }
                          })
                        }
                      }
                    }
                    
                    setEmailContext({
                      type: 'property',
                      property: {
                        name: selectedPropertyData.name,
                        address: `${selectedPropertyData.address.street}, ${selectedPropertyData.address.plz} ${selectedPropertyData.address.city}`,
                      },
                      recipients: propertyTenants
                    })
                    setEmailDialogOpen(true)
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  E-Mail senden
                </Button>
              </div>
              <p className="text-muted-foreground">
                {selectedPropertyData.address.street}, {selectedPropertyData.address.plz} {selectedPropertyData.address.city}
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="units">Einheiten</TabsTrigger>
                <TabsTrigger value="finances">Finanzen</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Vermietungsstand</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedPropertyData.type === "Mehrfamilienhaus" 
                          ? `${selectedPropertyData.units} WE`
                          : selectedPropertyData.type === "WE"
                          ? `${selectedPropertyData.occupiedRooms}/${selectedPropertyData.totalRooms} Zimmer`
                          : `${selectedPropertyData.occupiedRooms}/${selectedPropertyData.totalRooms}`
                        }
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedPropertyData.type === "Mehrfamilienhaus"
                          ? `${selectedPropertyData.occupiedRooms}/${selectedPropertyData.totalRooms} Zimmer vermietet`
                          : selectedPropertyData.type === "WE" && selectedPropertyData.rentedAs === "apartment"
                          ? "Als Wohnung vermietet"
                          : selectedPropertyData.type === "WE" && selectedPropertyData.rentedAs === "wg"
                          ? "Als WG vermietet"
                          : `${((selectedPropertyData.occupiedRooms / selectedPropertyData.totalRooms) * 100).toFixed(0)}% vermietet`
                        }
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Monatliche Mieteinnahmen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedPropertyData.monthlyRent.toLocaleString('de-DE')}€
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(selectedPropertyData.monthlyRent * 12).toLocaleString('de-DE')}€ jährlich
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Verwaltung seit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedPropertyData.managementStart.split('.')[2]}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Seit {selectedPropertyData.managementStart}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Objektinformationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Objektnummer</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.objNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Objekttyp</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.type}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Baujahr</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.yearBuilt}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Heizungsart</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.heatingType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Mandant</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.client}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {selectedPropertyData.type === "Mehrfamilienhaus" ? "Anzahl WE / Zimmer" : "Anzahl Zimmer"}
                        </dt>
                        <dd className="text-sm font-semibold">
                          {selectedPropertyData.type === "Mehrfamilienhaus" 
                            ? `${selectedPropertyData.units} WE / ${selectedPropertyData.totalRooms} Zimmer`
                            : `${selectedPropertyData.totalRooms} Zimmer`
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Eigentümer</dt>
                        <dd className="text-sm font-semibold">
                          <Link 
                            href={`/owners?id=${selectedPropertyData.owner.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedPropertyData.owner.name}
                          </Link>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Verwaltungsgebühr</dt>
                        <dd className="text-sm font-semibold">{selectedPropertyData.owner.managementFee.toLocaleString('de-DE')}€/Monat</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="units" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Wohneinheiten & Zimmer</h3>
                  <div className="flex gap-2">
                    <Link href="/handover-protocol">
                      <Button size="sm" variant="outline">
                        <FileText className="mr-1 h-4 w-4" />
                        Übergabeprotokoll
                      </Button>
                    </Link>
                    <Button size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      Neue Einheit
                    </Button>
                  </div>
                </div>
                
                {selectedPropertyData.type === "Mehrfamilienhaus" ? (
                  // Multi-family building with multiple WE units
                  <div className="space-y-4">
                    {units[selectedPropertyData.id as keyof typeof units]?.map((unit) => (
                      <Card key={'id' in unit ? unit.id : unit.number}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {unit.number}
                              {'rentedAs' in unit && (
                                <Badge variant={unit.rentedAs === "apartment" ? "default" : "secondary"} className="ml-2">
                                  {unit.rentedAs === "apartment" ? "Wohnung" : "WG"}
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {'totalRent' in unit ? `${unit.totalRent}€` : `${unit.rent}€`} / {'totalSize' in unit ? `${unit.totalSize}m²` : `${unit.size}m²`}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {'rentedAs' in unit && unit.rentedAs === "apartment" && 'rooms' in unit ? (
                            // Show as single entry for apartment rental
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">{renderTenantLink(unit.rooms[0].tenant)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {unit.rooms.length} Zimmer • {'totalSize' in unit ? unit.totalSize : 0}m² • Seit {unit.rooms[0].moveIn}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">{'totalRent' in unit ? unit.totalRent : 0}€</p>
                                <Badge variant="default">Vermietet</Badge>
                              </div>
                            </div>
                          ) : (
                            // Show individual rooms for WG
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Zimmer</TableHead>
                                  <TableHead>Mieter</TableHead>
                                  <TableHead>Miete</TableHead>
                                  <TableHead>Größe</TableHead>
                                  <TableHead>Einzug</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {'rooms' in unit ? unit.rooms.map((room, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium">{room.number}</TableCell>
                                    <TableCell>{renderTenantLink(room.tenant)}</TableCell>
                                    <TableCell>{room.rent}€</TableCell>
                                    <TableCell>{room.size}m²</TableCell>
                                    <TableCell>{room.moveIn || "-"}</TableCell>
                                    <TableCell>
                                      {room.tenant === "Frei" ? (
                                        <Badge variant="secondary">Frei</Badge>
                                      ) : 'moveOut' in room && room.moveOut ? (
                                        <Badge variant="outline">Kündigung</Badge>
                                      ) : (
                                        <Badge variant="default">Vermietet</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )) : (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                      <p className="text-sm text-muted-foreground">Keine Zimmer verfügbar</p>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // Single WE - show rooms directly
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Zimmerübersicht
                        {selectedPropertyData.rentedAs && (
                          <Badge 
                            variant={selectedPropertyData.rentedAs === "apartment" ? "default" : "secondary"} 
                            className="ml-2"
                          >
                            {selectedPropertyData.rentedAs === "apartment" ? "Als Wohnung vermietet" : "Als WG vermietet"}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPropertyData.rentedAs === "apartment" ? (
                        // Show as single entry for apartment rental
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">
                              {(() => {
                                const propertyUnits = units[selectedPropertyData.id as keyof typeof units];
                                if (Array.isArray(propertyUnits) && propertyUnits.length > 0) {
                                  const firstUnit = propertyUnits[0];
                                  if ('tenant' in firstUnit) {
                                    return renderTenantLink(firstUnit.tenant);
                                  } else if ('rooms' in firstUnit && firstUnit.rooms.length > 0) {
                                    return renderTenantLink(firstUnit.rooms[0].tenant);
                                  }
                                }
                                return "Kein Mieter";
                              })()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPropertyData.totalRooms} Zimmer • 
                              {(() => {
                                const propertyUnits = units[selectedPropertyData.id as keyof typeof units];
                                if (Array.isArray(propertyUnits)) {
                                  return propertyUnits.reduce((sum, unit) => {
                                    if ('size' in unit) return sum + unit.size;
                                    if ('totalSize' in unit) return sum + unit.totalSize;
                                    return sum;
                                  }, 0);
                                }
                                return 0;
                              })()}m² • 
                              Seit {(() => {
                                const propertyUnits = units[selectedPropertyData.id as keyof typeof units];
                                if (Array.isArray(propertyUnits) && propertyUnits.length > 0) {
                                  const firstUnit = propertyUnits[0];
                                  if ('moveIn' in firstUnit) return firstUnit.moveIn;
                                  if ('rooms' in firstUnit && firstUnit.rooms.length > 0) {
                                    return firstUnit.rooms[0].moveIn;
                                  }
                                }
                                return "-";
                              })()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{selectedPropertyData.monthlyRent}€</p>
                            <Badge variant="default">Vermietet</Badge>
                          </div>
                        </div>
                      ) : (
                        // Show individual rooms for WG
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Zimmer</TableHead>
                              <TableHead>Mieter</TableHead>
                              <TableHead>Miete</TableHead>
                              <TableHead>Größe</TableHead>
                              <TableHead>Einzug</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              const propertyUnits = units[selectedPropertyData.id as keyof typeof units];
                              if (!Array.isArray(propertyUnits)) return null;
                              
                              // Check if units have rooms property or are rooms themselves
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const allRooms: any[] = [];
                              propertyUnits.forEach((unit) => {
                                if ('rooms' in unit && Array.isArray(unit.rooms)) {
                                  allRooms.push(...unit.rooms);
                                } else if ('tenant' in unit && 'number' in unit) {
                                  allRooms.push(unit);
                                }
                              });
                              
                              return allRooms.map((room, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{room.number}</TableCell>
                                  <TableCell>{renderTenantLink(room.tenant)}</TableCell>
                                  <TableCell>{room.rent}€</TableCell>
                                  <TableCell>{room.size}m²</TableCell>
                                  <TableCell>{room.moveIn || "-"}</TableCell>
                                  <TableCell>
                                    {room.tenant === "Frei" ? (
                                      <Badge variant="secondary">Frei</Badge>
                                    ) : 'moveOut' in room && room.moveOut ? (
                                      <Badge variant="outline">Kündigung</Badge>
                                    ) : (
                                      <Badge variant="default">Vermietet</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ));
                            })()}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="finances" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Finanzübersicht</CardTitle>
                      <CardDescription>Monatliche Einnahmen und Ausgaben</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Mieteinnahmen (Soll)</span>
                          <span className="text-sm font-bold text-green-600">
                            +{selectedPropertyData.monthlyRent.toLocaleString('de-DE')}€
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Verwaltungsgebühr (Fixbetrag)</span>
                          <span className="text-sm font-bold text-red-600">
                            -{selectedPropertyData.owner.managementFee.toLocaleString('de-DE')}€
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Hausgeld</span>
                          <span className="text-sm font-bold text-red-600">-250€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Instandhaltungsrücklage</span>
                          <span className="text-sm font-bold text-red-600">-150€</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Auszahlung an Eigentümer</span>
                          <span className="text-sm font-bold">
                            {(selectedPropertyData.monthlyRent - selectedPropertyData.owner.managementFee - 400).toLocaleString('de-DE')}€
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Eigentümer-Details</CardTitle>
                      <CardDescription>Verwaltungsinformationen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Eigentümer</p>
                          <Link 
                            href={`/owners?id=${selectedPropertyData.owner.id}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedPropertyData.owner.name}
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Verwaltungsgebühr</p>
                          <p className="text-sm font-semibold">{selectedPropertyData.owner.managementFee.toLocaleString('de-DE')}€/Monat (fix)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Monatliche Auszahlung</p>
                          <p className="text-sm font-semibold">
                            {(selectedPropertyData.monthlyRent - selectedPropertyData.owner.managementFee).toLocaleString('de-DE')}€
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Jährliche Auszahlung</p>
                          <p className="text-sm font-semibold">
                            {((selectedPropertyData.monthlyRent - selectedPropertyData.owner.managementFee) * 12).toLocaleString('de-DE')}€
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Zusätzliche Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Bankverbindung</dt>
                        <dd className="text-sm font-semibold">IBAN: DE89 3704 0044 0532 0130 00</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Steuernummer</dt>
                        <dd className="text-sm font-semibold">143/123/12345</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">WEG-Verwalter</dt>
                        <dd className="text-sm font-semibold">Hausverwaltung München GmbH</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Letzte Abrechnung</dt>
                        <dd className="text-sm font-semibold">31.12.2023</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {/* Document Categories */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Objektdokumente</CardTitle>
                        <CardDescription>Alle Dokumente zum Objekt {selectedPropertyData.name}</CardDescription>
                      </div>
                      <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Dokument hochladen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Exposé */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('expose') 
                              ? prev.filter(f => f !== 'expose')
                              : [...prev, 'expose']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('expose') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Exposé</span>
                            <Badge variant="secondary" className="text-xs">2</Badge>
                          </div>
                        </div>
                        {expandedFolders.includes('expose') && (
                          <div className="mt-3 ml-6 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Expose_Linkstr_27.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Teilungserklärung */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('teilungserklaerung') 
                              ? prev.filter(f => f !== 'teilungserklaerung')
                              : [...prev, 'teilungserklaerung']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('teilungserklaerung') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Teilungserklärung</span>
                            <Badge variant="secondary" className="text-xs">1</Badge>
                          </div>
                        </div>
                        {expandedFolders.includes('teilungserklaerung') && (
                          <div className="mt-3 ml-6 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Teilungserklaerung_2021.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Grundriss */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('grundriss') 
                              ? prev.filter(f => f !== 'grundriss')
                              : [...prev, 'grundriss']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('grundriss') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Grundriss</span>
                            <Badge variant="secondary" className="text-xs">3</Badge>
                          </div>
                        </div>
                        {expandedFolders.includes('grundriss') && (
                          <div className="mt-3 ml-6 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Grundriss_EG.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Grundriss_1OG.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Abrechnungen */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('abrechnungen') 
                              ? prev.filter(f => f !== 'abrechnungen')
                              : [...prev, 'abrechnungen']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('abrechnungen') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Abrechnungen</span>
                            <Badge variant="secondary" className="text-xs">12</Badge>
                          </div>
                        </div>
                        {expandedFolders.includes('abrechnungen') && (
                          <div className="mt-3 ml-6 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Jahresabrechnung_2024.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Nebenkostenabrechnung_2024.pdf</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Grundbuchauszug */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('grundbuch') 
                              ? prev.filter(f => f !== 'grundbuch')
                              : [...prev, 'grundbuch']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('grundbuch') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Grundbuchauszug</span>
                            <Badge variant="secondary" className="text-xs">1</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Versicherungsnachweis */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('versicherung') 
                              ? prev.filter(f => f !== 'versicherung')
                              : [...prev, 'versicherung']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('versicherung') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Versicherungsnachweis</span>
                            <Badge variant="secondary" className="text-xs">2</Badge>
                          </div>
                        </div>
                      </div>

                      {/* WEG Protokolle */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('weg-protokolle') 
                              ? prev.filter(f => f !== 'weg-protokolle')
                              : [...prev, 'weg-protokolle']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('weg-protokolle') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">WEG Protokolle</span>
                            <Badge variant="secondary" className="text-xs">8</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Flurkarte/Lageplan */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('flurkarte') 
                              ? prev.filter(f => f !== 'flurkarte')
                              : [...prev, 'flurkarte']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('flurkarte') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Flurkarte/Lageplan</span>
                            <Badge variant="secondary" className="text-xs">1</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Energieausweis */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('energieausweis') 
                              ? prev.filter(f => f !== 'energieausweis')
                              : [...prev, 'energieausweis']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('energieausweis') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Energieausweis</span>
                            <Badge variant="secondary" className="text-xs">1</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Sonstige Unterlagen (Objekt) */}
                      <div className="border rounded-lg p-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedFolders(prev => 
                            prev.includes('sonstige') 
                              ? prev.filter(f => f !== 'sonstige')
                              : [...prev, 'sonstige']
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {expandedFolders.includes('sonstige') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Sonstige Unterlagen (Objekt)</span>
                            <Badge variant="secondary" className="text-xs">5</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tenant Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mieterdokumente</CardTitle>
                    <CardDescription>Dokumente der aktuellen Mieter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(() => {
                        // Get current tenants for this property
                        const currentTenants = []
                        const propertyUnits = units[selectedPropertyData.id as keyof typeof units]
                        
                        if (propertyUnits) {
                          if (selectedPropertyData.type === "Mehrfamilienhaus") {
                            // Multi-family building - collect tenants from all units
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            propertyUnits.forEach((unit: any) => {
                              if ('rentedAs' in unit && unit.rentedAs === "apartment" && unit.rooms[0].tenant !== "Frei") {
                                currentTenants.push({
                                  name: unit.rooms[0].tenant,
                                  unit: `WE ${'id' in unit ? unit.id.split('.').pop() : unit.number}`
                                })
                              } else if ('rentedAs' in unit && unit.rentedAs === "wg") {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                unit.rooms.forEach((room: any) => {
                                  if (room.tenant !== "Frei") {
                                    currentTenants.push({
                                      name: room.tenant,
                                      unit: `WE ${'id' in unit ? unit.id.split('.').pop() : unit.number} - Zimmer ${room.id || room.number}`
                                    })
                                  }
                                })
                              }
                            })
                          } else {
                            // Single unit
                            if (selectedPropertyData.rentedAs === "apartment" && 'tenant' in propertyUnits[0] && propertyUnits[0]?.tenant !== "Frei") {
                              currentTenants.push({
                                name: propertyUnits[0].tenant,
                                unit: "Gesamte Wohnung"
                              })
                            } else if (selectedPropertyData.rentedAs === "wg") {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              propertyUnits.forEach((room: any) => {
                                if (room.tenant !== "Frei") {
                                  currentTenants.push({
                                    name: room.tenant,
                                    unit: `Zimmer ${room.id}`
                                  })
                                }
                              })
                            }
                          }
                        }

                        // If no current tenants, show empty state
                        if (currentTenants.length === 0) {
                          return (
                            <div className="text-center py-4 text-muted-foreground">
                              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Keine aktuellen Mieter</p>
                            </div>
                          )
                        }

                        // Show tenant folders
                        return currentTenants.map((tenant, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setExpandedFolders(prev => 
                                prev.includes(`tenant-${idx}`) 
                                  ? prev.filter(f => f !== `tenant-${idx}`)
                                  : [...prev, `tenant-${idx}`]
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {expandedFolders.includes(`tenant-${idx}`) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <FolderOpen className="h-4 w-4 text-green-600" />
                                <div>
                                  <span className="font-medium">{tenant.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">({tenant.unit})</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">4</Badge>
                              </div>
                            </div>
                            {expandedFolders.includes(`tenant-${idx}`) && (
                              <div className="mt-3 ml-6 space-y-2">
                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Mietvertrag_{tenant.name.replace(/[, ]/g, '_')}.pdf</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Selbstauskunft_{tenant.name.replace(/[, ]/g, '_')}.pdf</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Uebergabeprotokoll_{tenant.name.replace(/[, ]/g, '_')}.pdf</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Kaution_Bestaetigung_{tenant.name.replace(/[, ]/g, '_')}.pdf</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload/Management Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dokumentenverwaltung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Ziehen Sie Dateien per Drag & Drop in die jeweilige Kategorie</p>
                      <p>• Maximale Dateigröße: 50 MB pro Dokument</p>
                      <p>• Unterstützte Formate: PDF, JPG, PNG, DOC, DOCX</p>
                      <p>• Dokumente werden verschlüsselt gespeichert</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Kein Objekt ausgewählt</h3>
              <p className="text-sm text-muted-foreground">
                Wählen Sie ein Objekt aus der Liste aus, um Details anzuzeigen
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Email Dialog */}
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        context={emailContext || undefined}
      />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  )
}