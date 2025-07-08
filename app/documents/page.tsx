"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FolderOpen,
  FileText,
  Upload,
  Download,
  Share2,
  Search,
  FileImage,
  Archive,
  Eye,
  Link,
  Building2,
  Users,
  Clock,
  FolderArchive,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for documents
const documents = [
  {
    id: "DOC001",
    name: "Mietvertrag_Ochs_David.pdf",
    type: "contract",
    category: "Verträge",
    size: "2.4 MB",
    uploadDate: "15.04.2025",
    modifiedDate: "15.04.2025",
    property: "SEV Linkstr. 27",
    tenant: "Ochs, David",
    shared: true,
    sharedWith: ["Ochs, David"],
    tags: ["Hauptmietvertrag", "2025"],
  },
  {
    id: "DOC002",
    name: "Übergabeprotokoll_Einzug_Ochs.pdf",
    type: "protocol",
    category: "Protokolle",
    size: "5.8 MB",
    uploadDate: "15.04.2025",
    modifiedDate: "15.04.2025",
    property: "SEV Linkstr. 27",
    tenant: "Ochs, David",
    shared: false,
    sharedWith: [],
    tags: ["Einzug", "Übergabe"],
  },
  {
    id: "DOC003",
    name: "Nebenkostenabrechnung_2024.pdf",
    type: "invoice",
    category: "Abrechnungen",
    size: "1.2 MB",
    uploadDate: "01.01.2025",
    modifiedDate: "01.01.2025",
    property: "SEV Linkstr. 27",
    tenant: null,
    shared: false,
    sharedWith: [],
    tags: ["Nebenkosten", "2024"],
  },
  {
    id: "DOC004",
    name: "Grundriss_Arbestr_1.jpg",
    type: "image",
    category: "Objektunterlagen",
    size: "3.5 MB",
    uploadDate: "01.01.2020",
    modifiedDate: "01.01.2020",
    property: "SEV Arbestr. 1",
    tenant: null,
    shared: false,
    sharedWith: [],
    tags: ["Grundriss"],
  },
  {
    id: "DOC005",
    name: "Hausordnung_SEV.pdf",
    type: "document",
    category: "Allgemein",
    size: "450 KB",
    uploadDate: "01.01.2020",
    modifiedDate: "01.06.2023",
    property: null,
    tenant: null,
    shared: true,
    sharedWith: ["Alle Mieter"],
    tags: ["Hausordnung"],
  },
  {
    id: "DOC006",
    name: "Energieausweis_Theaterstr.pdf",
    type: "certificate",
    category: "Objektunterlagen",
    size: "890 KB",
    uploadDate: "01.04.2022",
    modifiedDate: "01.04.2022",
    property: "SEV Theaterstr. 1",
    tenant: null,
    shared: false,
    sharedWith: [],
    tags: ["Energieausweis"],
  },
]

// Document categories
const categories = [
  "Alle",
  "Verträge",
  "Protokolle",
  "Abrechnungen",
  "Objektunterlagen",
  "Allgemein",
  "Archiv",
]

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Alle")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.property?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tenant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "Alle" || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="h-4 w-4" />
      case "contract":
      case "protocol":
      case "invoice":
      case "certificate":
      case "document":
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar with categories */}
      <div className="w-64 border-r bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Dokumente</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {/* Upload button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Dokument hochladen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dokument hochladen</DialogTitle>
                  <DialogDescription>
                    Laden Sie ein neues Dokument in das System
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file">Datei auswählen</Label>
                    <Input id="file" type="file" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contracts">Verträge</SelectItem>
                        <SelectItem value="protocols">Protokolle</SelectItem>
                        <SelectItem value="invoices">Abrechnungen</SelectItem>
                        <SelectItem value="property">Objektunterlagen</SelectItem>
                        <SelectItem value="general">Allgemein</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="property">Objekt (optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Objekt zuordnen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="660">SEV Linkstr. 27</SelectItem>
                        <SelectItem value="661">SEV Arbestr. 1</SelectItem>
                        <SelectItem value="662">SEV Theaterstr. 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tenant">Mieter (optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Mieter zuordnen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ochs, David</SelectItem>
                        <SelectItem value="2">Müller, Anna</SelectItem>
                        <SelectItem value="3">Schmidt, Peter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Hochladen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Kategorien</p>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {category}
                </Button>
              ))}
            </div>

            {/* Quick filters */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Schnellfilter</p>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Geteilte Dokumente
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Kürzlich hinzugefügt
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FolderArchive className="mr-2 h-4 w-4" />
                Archivierte Dokumente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header with search and actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Dokumente suchen..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {selectedDocs.length > 0 && (
                <>
                  <Badge variant="secondary">{selectedDocs.length} ausgewählt</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Teilen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Herunterladen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="mr-2 h-4 w-4" />
                    Archivieren
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Documents table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedDocs.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDocs(filteredDocuments.map(d => d.id))
                        } else {
                          setSelectedDocs([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Objekt</TableHead>
                  <TableHead>Mieter</TableHead>
                  <TableHead>Größe</TableHead>
                  <TableHead>Hochgeladen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={() => toggleDocSelection(doc.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>
                      {doc.property ? (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{doc.property}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.tenant ? (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{doc.tenant}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      {doc.shared ? (
                        <Badge variant="outline" className="gap-1">
                          <Share2 className="h-3 w-3" />
                          Geteilt
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Privat</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Share dialog */}
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dokumente teilen</DialogTitle>
                <DialogDescription>
                  Wählen Sie aus, mit wem Sie die ausgewählten Dokumente teilen möchten
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Mieter auswählen</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tenant1" />
                      <label htmlFor="tenant1" className="text-sm">Ochs, David - SEV Linkstr. 27</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tenant2" />
                      <label htmlFor="tenant2" className="text-sm">Müller, Anna - SEV Arbestr. 1</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tenant3" />
                      <label htmlFor="tenant3" className="text-sm">Schmidt, Peter - SEV Theaterstr. 1</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tenant4" />
                      <label htmlFor="tenant4" className="text-sm">Wagner, Maria - SEV Rathausstr. 12</label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Freigabeoptionen</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="download" defaultChecked />
                      <label htmlFor="download" className="text-sm">Download erlauben</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="expiry" />
                      <label htmlFor="expiry" className="text-sm">Zugriff nach 30 Tagen entziehen</label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={() => setShareDialogOpen(false)}>
                  <Link className="mr-2 h-4 w-4" />
                  Link teilen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}