"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import {
  Mail,
  Send,
  Paperclip,
  User,
  Building2,
  FileText,
  AlertCircle,
  Clock,
  Euro,
  X,
} from "lucide-react"

// Email templates
const emailTemplates = {
  rentReminder: {
    id: "rentReminder",
    name: "Mietzahlung Erinnerung",
    subject: "Erinnerung: Mietzahlung für {month} {year}",
    body: `Sehr geehrte/r {tenant_name},

hiermit möchten wir Sie freundlich an die ausstehende Mietzahlung für {month} {year} erinnern.

Objektadresse: {property_address}
Fälliger Betrag: {amount} EUR
Fälligkeitsdatum: {due_date}

Bitte überweisen Sie den Betrag auf folgendes Konto:
{bank_details}

Sollte die Zahlung bereits erfolgt sein, betrachten Sie diese E-Mail als gegenstandslos.

Mit freundlichen Grüßen
{sender_name}
{company_name}`,
    variables: ["tenant_name", "month", "year", "property_address", "amount", "due_date", "bank_details", "sender_name", "company_name"]
  },
  contractRenewal: {
    id: "contractRenewal",
    name: "Vertragsverlängerung",
    subject: "Mietvertragsverlängerung - {property_address}",
    body: `Sehr geehrte/r {tenant_name},

Ihr Mietvertrag für die Wohnung {property_address} läuft am {contract_end_date} aus.

Wir würden uns freuen, das Mietverhältnis mit Ihnen fortzusetzen. Anbei finden Sie den Vorschlag zur Vertragsverlängerung.

Bitte teilen Sie uns bis zum {response_deadline} mit, ob Sie an einer Verlängerung interessiert sind.

Mit freundlichen Grüßen
{sender_name}
{company_name}`,
    variables: ["tenant_name", "property_address", "contract_end_date", "response_deadline", "sender_name", "company_name"]
  },
  maintenanceNotice: {
    id: "maintenanceNotice",
    name: "Wartungsankündigung",
    subject: "Wichtig: Wartungsarbeiten in {property_address}",
    body: `Sehr geehrte/r {tenant_name},

wir möchten Sie über anstehende Wartungsarbeiten in Ihrer Wohnung informieren.

Datum: {maintenance_date}
Uhrzeit: {maintenance_time}
Arbeiten: {maintenance_description}
Voraussichtliche Dauer: {duration}

Bitte stellen Sie sicher, dass der Zugang zur Wohnung gewährleistet ist.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
{sender_name}
{company_name}`,
    variables: ["tenant_name", "property_address", "maintenance_date", "maintenance_time", "maintenance_description", "duration", "sender_name", "company_name"]
  },
  moveInWelcome: {
    id: "moveInWelcome",
    name: "Willkommen (Einzug)",
    subject: "Herzlich Willkommen in {property_address}",
    body: `Sehr geehrte/r {tenant_name},

herzlich willkommen in Ihrer neuen Wohnung!

Wir freuen uns, Sie als neue/n Mieter/in begrüßen zu dürfen. Anbei finden Sie wichtige Informationen:

- Hausordnung
- Müllentsorgung: {waste_schedule}
- Notfallkontakte
- Ansprechpartner: {contact_person}

Bei Fragen oder Problemen melden Sie sich bitte jederzeit bei uns.

Wir wünschen Ihnen ein angenehmes Wohnen!

Mit freundlichen Grüßen
{sender_name}
{company_name}`,
    variables: ["tenant_name", "property_address", "waste_schedule", "contact_person", "sender_name", "company_name"]
  },
  documentShare: {
    id: "documentShare",
    name: "Dokument teilen",
    subject: "Dokument: {document_name}",
    body: `Sehr geehrte/r {tenant_name},

anbei erhalten Sie das angeforderte Dokument: {document_name}

Das Dokument steht Ihnen {access_duration} zur Verfügung.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
{sender_name}
{company_name}`,
    variables: ["tenant_name", "document_name", "access_duration", "sender_name", "company_name"]
  },
  customEmail: {
    id: "customEmail",
    name: "Eigene E-Mail",
    subject: "",
    body: "",
    variables: []
  }
}

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context?: {
    type: 'tenant' | 'property' | 'document' | 'payment'
    recipient?: {
      name: string
      email: string
    }
    recipients?: Array<{
      name: string
      email: string
    }>
    property?: {
      name: string
      address: string
    }
    tenant?: {
      name: string
      email: string
    }
    document?: {
      name: string
      type: string
    }
    payment?: {
      amount: number
      dueDate: string
      month: string
    }
  }
}

export function EmailDialog({ open, onOpenChange, context }: EmailDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [ccRecipients, setCcRecipients] = useState("")
  const [isSending, setIsSending] = useState(false)
  
  // Initialize recipients from context
  const initialRecipients = context?.recipients || 
    (context?.recipient ? [context.recipient] : 
    (context?.tenant ? [{ name: context.tenant.name, email: context.tenant.email }] : []))
  
  const [recipients, setRecipients] = useState(initialRecipients)
  
  // Update recipients when context changes
  useEffect(() => {
    const newRecipients = context?.recipients || 
      (context?.recipient ? [context.recipient] : 
      (context?.tenant ? [{ name: context.tenant.name, email: context.tenant.email }] : []))
    setRecipients(newRecipients)
  }, [context])
  
  // Function to remove a recipient
  const removeRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter(r => r.email !== emailToRemove))
  }

  // Auto-select template based on context
  const suggestedTemplates = {
    tenant: ['moveInWelcome', 'rentReminder', 'contractRenewal'],
    property: ['maintenanceNotice', 'rentReminder'],
    document: ['documentShare'],
    payment: ['rentReminder'],
  }

  // Fill template with context data
  const fillTemplate = (templateId: string) => {
    const template = emailTemplates[templateId as keyof typeof emailTemplates]
    if (!template) return

    let filledSubject = template.subject
    let filledBody = template.body

    // Auto-fill based on context
    // For multiple recipients, use the first one for personalization
    const primaryRecipient = recipients[0] || {}
    const replacements = {
      tenant_name: primaryRecipient.name || context?.tenant?.name || context?.recipient?.name || '{Mieter Name}',
      property_address: context?.property?.address || '{Adresse}',
      property_name: context?.property?.name || '{Objekt}',
      document_name: context?.document?.name || '{Dokument}',
      amount: context?.payment?.amount?.toString() || '{Betrag}',
      due_date: context?.payment?.dueDate || '{Fälligkeitsdatum}',
      month: context?.payment?.month || new Date().toLocaleDateString('de-DE', { month: 'long' }),
      year: new Date().getFullYear().toString(),
      sender_name: 'Max Mustermann', // Would come from user profile
      company_name: 'SEV Property Management GmbH',
      bank_details: 'IBAN: DE89 3704 0044 0532 0130 00\nBIC: COBADEFFXXX',
      contact_person: 'Max Mustermann (Tel: 089 123456789)',
      access_duration: '30 Tage',
      waste_schedule: 'Montag: Restmüll, Mittwoch: Papier, Freitag: Bio',
    }

    // Replace variables
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g')
      filledSubject = filledSubject.replace(regex, value)
      filledBody = filledBody.replace(regex, value)
    })

    setSubject(filledSubject)
    setBody(filledBody)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (templateId !== 'customEmail') {
      fillTemplate(templateId)
    } else {
      setSubject("")
      setBody("")
    }
  }

  const handleSend = async () => {
    setIsSending(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    onOpenChange(false)
    // Reset form
    setSelectedTemplate("")
    setSubject("")
    setBody("")
    setAttachments([])
    setCcRecipients("")
  }

  // Check if we have any valid recipients
  const hasValidRecipients = recipients.length > 0 && recipients.some(r => r.email)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail senden
          </DialogTitle>
          <DialogDescription>
            Wählen Sie eine Vorlage oder erstellen Sie eine eigene E-Mail
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {/* Recipients */}
            <div className="space-y-2">
              <Label>Empfänger</Label>
              <div className="space-y-2">
                {recipients.map((recipient, index) => (
                  <div key={`${recipient.email}-${index}`} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{recipient.name}</p>
                      <p className="text-xs text-muted-foreground">{recipient.email}</p>
                    </div>
                    {recipients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(recipient.email)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {context?.type && index === 0 && (
                      <Badge variant="outline">
                        {context.type === 'tenant' && <User className="mr-1 h-3 w-3" />}
                        {context.type === 'property' && <Building2 className="mr-1 h-3 w-3" />}
                        {context.type === 'document' && <FileText className="mr-1 h-3 w-3" />}
                        {context.type === 'payment' && <Euro className="mr-1 h-3 w-3" />}
                        {context.type}
                      </Badge>
                    )}
                  </div>
                ))}
                {recipients.length === 0 && (
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg text-center">
                    Keine Empfänger ausgewählt
                  </div>
                )}
              </div>
            </div>

            {/* CC Recipients */}
            <div className="space-y-2">
              <Label htmlFor="cc">CC (optional)</Label>
              <Input
                id="cc"
                placeholder="weitere@email.de, andere@email.de"
                value={ccRecipients}
                onChange={(e) => setCcRecipients(e.target.value)}
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>E-Mail Vorlage</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Vorlage auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {context?.type && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        Empfohlene Vorlagen
                      </div>
                      {suggestedTemplates[context.type]?.map((templateId) => (
                        <SelectItem key={templateId} value={templateId}>
                          <div className="flex items-center gap-2">
                            {templateId === 'rentReminder' && <Clock className="h-4 w-4" />}
                            {templateId === 'documentShare' && <FileText className="h-4 w-4" />}
                            {templateId === 'maintenanceNotice' && <AlertCircle className="h-4 w-4" />}
                            {emailTemplates[templateId as keyof typeof emailTemplates].name}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="my-1 border-t" />
                    </>
                  )}
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Alle Vorlagen
                  </div>
                  {Object.values(emailTemplates).map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Betreff</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="E-Mail Betreff eingeben..."
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Nachricht</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="E-Mail Nachricht eingeben..."
                className="min-h-[200px]"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Anhänge</Label>
              <Card className="p-4">
                <div className="space-y-2">
                  {context?.document && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="attach-doc"
                        defaultChecked
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAttachments([...attachments, context.document?.name || ''])
                          } else {
                            setAttachments(attachments.filter(a => a !== context.document?.name))
                          }
                        }}
                      />
                      <label htmlFor="attach-doc" className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        {context.document.name}
                      </label>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Weitere Anhänge hinzufügen
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSend} disabled={!hasValidRecipients || !subject || !body || isSending}>
            {isSending ? (
              <>Wird gesendet...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                E-Mail senden
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}