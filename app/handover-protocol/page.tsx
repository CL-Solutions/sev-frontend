"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Camera,
  Check,
  AlertCircle,
  Mail,
  Signature,
  Home,
  Key,
  Zap,
  ChevronRight,
  Save,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for properties and tenants
const properties = [
  { id: "660", name: "SEV Linkstr. 27 - WE 1", tenant: "Ochs, David" },
  { id: "661", name: "SEV Arbestr. 1 - WE 2", tenant: "Müller, Anna" },
  { id: "662", name: "SEV Theaterstr. 1 - Zimmer 3", tenant: "Wagner, Maria" },
]

// Types
type FieldType = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

type SectionWithFields = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FieldType[];
}

// Protocol sections
const protocolSections = {
  general: {
    title: "Allgemeine Informationen",
    icon: Home,
    fields: [
      { id: "moveInDate", label: "Einzugsdatum", type: "date", required: true },
      { id: "previousTenant", label: "Vormieter", type: "text" },
      { id: "presentPeople", label: "Anwesende Personen", type: "textarea", required: true },
    ]
  },
  keys: {
    title: "Schlüsselübergabe",
    icon: Key,
    fields: [
      { id: "apartmentKeys", label: "Wohnungsschlüssel", type: "number", required: true },
      { id: "mailboxKeys", label: "Briefkastenschlüssel", type: "number", required: true },
      { id: "basementKeys", label: "Kellerschlüssel", type: "number" },
      { id: "otherKeys", label: "Sonstige Schlüssel", type: "textarea" },
    ]
  },
  meters: {
    title: "Zählerstände",
    icon: Zap,
    fields: [
      { id: "electricityMeter", label: "Stromzähler", type: "text", required: true },
      { id: "waterMeterCold", label: "Wasserzähler (Kalt)", type: "text", required: true },
      { id: "waterMeterWarm", label: "Wasserzähler (Warm)", type: "text" },
      { id: "heatingMeter", label: "Heizungszähler", type: "text" },
    ]
  },
  rooms: {
    title: "Raumzustand",
    icon: Home,
    rooms: [
      { id: "entrance", name: "Eingang/Flur" },
      { id: "livingRoom", name: "Wohnzimmer" },
      { id: "bedroom", name: "Schlafzimmer" },
      { id: "kitchen", name: "Küche" },
      { id: "bathroom", name: "Badezimmer" },
      { id: "balcony", name: "Balkon/Terrasse" },
    ],
    conditions: [
      { id: "walls", label: "Wände" },
      { id: "floor", label: "Boden" },
      { id: "ceiling", label: "Decke" },
      { id: "windows", label: "Fenster" },
      { id: "doors", label: "Türen" },
      { id: "heating", label: "Heizung" },
      { id: "electrical", label: "Elektrik" },
    ],
    states: [
      { value: "good", label: "Gut", color: "green" },
      { value: "acceptable", label: "Akzeptabel", color: "yellow" },
      { value: "defective", label: "Mangelhaft", color: "red" },
      { value: "na", label: "N/A", color: "gray" },
    ]
  },
  defects: {
    title: "Mängel & Vereinbarungen",
    icon: AlertCircle,
    fields: [
      { id: "existingDefects", label: "Vorhandene Mängel", type: "textarea" },
      { id: "agreements", label: "Vereinbarungen", type: "textarea" },
      { id: "repairDeadline", label: "Frist für Reparaturen", type: "date" },
    ]
  },
}

export default function HandoverProtocolPage() {
  const [selectedProperty, setSelectedProperty] = useState("")
  const [currentSection, setCurrentSection] = useState("general")
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [roomConditions, setRoomConditions] = useState<Record<string, string>>({})
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const sections = Object.keys(protocolSections)
  const currentSectionIndex = sections.indexOf(currentSection)
  const progress = ((currentSectionIndex + 1) / sections.length) * 100

  const handleInputChange = (fieldId: string, value: unknown) => {
    setFormData({ ...formData, [fieldId]: value })
  }

  const handleRoomConditionChange = (roomId: string, conditionId: string, value: string) => {
    setRoomConditions({
      ...roomConditions,
      [`${roomId}_${conditionId}`]: value
    })
  }

  const handleNext = () => {
    const nextIndex = currentSectionIndex + 1
    if (nextIndex < sections.length) {
      setCurrentSection(sections[nextIndex])
    } else {
      setShowSignatureDialog(true)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentSectionIndex - 1
    if (prevIndex >= 0) {
      setCurrentSection(sections[prevIndex])
    }
  }

  const handleSendProtocol = async () => {
    setIsSending(true)
    // Simulate sending
    setTimeout(() => {
      setIsSending(false)
      setShowSignatureDialog(false)
      // Reset form or redirect
    }, 2000)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <FileText className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Digitales Übergabeprotokoll</h1>
        </div>
        <Badge variant="outline">Entwurf</Badge>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Property Selection */}
          {!selectedProperty ? (
            <Card>
              <CardHeader>
                <CardTitle>Neues Übergabeprotokoll erstellen</CardTitle>
                <CardDescription>
                  Wählen Sie die Wohnung und den Mieter für das Übergabeprotokoll
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Wohnung & Mieter</Label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wohnung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((prop) => (
                        <SelectItem key={prop.id} value={prop.id}>
                          {prop.name} - {prop.tenant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  disabled={!selectedProperty}
                  onClick={() => setCurrentSection("general")}
                >
                  Protokoll starten
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fortschritt</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {/* Section Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sections.map((section, index) => {
                  const SectionIcon = protocolSections[section as keyof typeof protocolSections].icon
                  const isActive = section === currentSection
                  const isCompleted = index < currentSectionIndex
                  
                  return (
                    <Button
                      key={section}
                      variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentSection(section)}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <SectionIcon className="h-4 w-4" />
                      )}
                      {protocolSections[section as keyof typeof protocolSections].title}
                    </Button>
                  )
                })}
              </div>

              {/* Current Section Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(protocolSections[currentSection as keyof typeof protocolSections].icon, { className: "h-5 w-5" })}
                    {protocolSections[currentSection as keyof typeof protocolSections].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentSection === "rooms" ? (
                    // Special handling for rooms section
                    <div className="space-y-6">
                      {protocolSections.rooms.rooms.map((room) => (
                        <div key={room.id} className="space-y-3">
                          <h4 className="font-medium">{room.name}</h4>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {protocolSections.rooms.conditions.map((condition) => (
                              <div key={condition.id} className="space-y-2">
                                <Label>{condition.label}</Label>
                                <Select
                                  value={roomConditions[`${room.id}_${condition.id}`] || ""}
                                  onValueChange={(value) => 
                                    handleRoomConditionChange(room.id, condition.id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Zustand wählen" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {protocolSections.rooms.states.map((state) => (
                                      <SelectItem key={state.value} value={state.value}>
                                        <span className="flex items-center gap-2">
                                          <div className={`h-2 w-2 rounded-full bg-${state.color}-500`} />
                                          {state.label}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label>Anmerkungen zu {room.name}</Label>
                            <Textarea
                              placeholder="Besondere Anmerkungen..."
                              value={(formData[`${room.id}_notes`] as string) || ""}
                              onChange={(e) => handleInputChange(`${room.id}_notes`, e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Regular fields
                    'fields' in protocolSections[currentSection as keyof typeof protocolSections] && 
                    (protocolSections[currentSection as keyof typeof protocolSections] as SectionWithFields).fields?.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.id}
                            value={(formData[field.id] as string) || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                          />
                        ) : (
                          <Input
                            id={field.id}
                            type={field.type}
                            value={(formData[field.id] as string) || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                          />
                        )}
                      </div>
                    ))
                  )}

                  {/* Photo Upload Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Fotos hinzufügen</Label>
                      <Button size="sm" variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Foto aufnehmen
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Placeholder for photos */}
                      <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSectionIndex === 0}
                >
                  Zurück
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {}}>
                    <Save className="mr-2 h-4 w-4" />
                    Zwischenspeichern
                  </Button>
                  <Button onClick={handleNext}>
                    {currentSectionIndex === sections.length - 1 ? (
                      <>
                        Zur Unterschrift
                        <Signature className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Weiter
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Protokoll abschließen</DialogTitle>
            <DialogDescription>
              Bitte prüfen Sie das Protokoll und unterschreiben Sie digital
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Zusammenfassung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objekt:</span>
                  <span>{properties.find(p => p.id === selectedProperty)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mieter:</span>
                  <span>{properties.find(p => p.id === selectedProperty)?.tenant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Datum:</span>
                  <span>{new Date().toLocaleDateString('de-DE')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Signature Areas */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Unterschrift Vermieter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Button variant="outline" size="sm">
                      <Signature className="mr-2 h-4 w-4" />
                      Unterschreiben
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Unterschrift Mieter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Button variant="outline" size="sm">
                      <Signature className="mr-2 h-4 w-4" />
                      Unterschreiben
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox id="agreement" />
              <label htmlFor="agreement" className="text-sm">
                Ich bestätige, dass alle Angaben korrekt sind und das Protokoll vollständig ausgefüllt wurde.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
              Zurück zur Bearbeitung
            </Button>
            <Button onClick={handleSendProtocol} disabled={isSending}>
              {isSending ? (
                <>Wird gesendet...</>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Protokoll per E-Mail senden
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}