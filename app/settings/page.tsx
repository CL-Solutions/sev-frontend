"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Users,
  Database,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Einstellungen</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Unternehmen</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unternehmensdaten</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre Unternehmenseinstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Firmenname</Label>
                    <Input id="company-name" defaultValue="SEV Property Management GmbH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-id">Firmennummer</Label>
                    <Input id="company-id" defaultValue="HRB 123456" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="Musterstraße 123" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plz">PLZ</Label>
                    <Input id="plz" defaultValue="80333" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input id="city" defaultValue="München" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" defaultValue="089 123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="email" defaultValue="info@sev-property.de" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Änderungen speichern</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bankverbindung</CardTitle>
                <CardDescription>
                  Konfigurieren Sie Ihre Bankverbindung für automatische Zahlungszuordnung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank</Label>
                  <Input id="bank-name" defaultValue="Sparkasse München" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" defaultValue="DE89 3704 0044 0532 0130 00" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bic">BIC</Label>
                  <Input id="bic" defaultValue="COBADEFFXXX" />
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-sync">Automatische Synchronisation</Label>
                      <p className="text-sm text-muted-foreground">
                        Täglich um 6:00 Uhr Banktransaktionen abrufen
                      </p>
                    </div>
                    <Switch id="auto-sync" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-match">Automatische Zuordnung</Label>
                      <p className="text-sm text-muted-foreground">
                        Zahlungen automatisch Mietverträgen zuordnen
                      </p>
                    </div>
                    <Switch id="auto-match" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Bankverbindung speichern</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E-Mail Benachrichtigungen</CardTitle>
                <CardDescription>
                  Wählen Sie aus, worüber Sie per E-Mail informiert werden möchten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="payment-received">Zahlungseingang</Label>
                      <p className="text-sm text-muted-foreground">
                        Bei jeder erfolgreich zugeordneten Zahlung
                      </p>
                    </div>
                    <Switch id="payment-received" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="payment-overdue">Zahlungsverzug</Label>
                      <p className="text-sm text-muted-foreground">
                        Wenn Mietzahlungen überfällig sind
                      </p>
                    </div>
                    <Switch id="payment-overdue" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="contract-expiry">Vertragsablauf</Label>
                      <p className="text-sm text-muted-foreground">
                        30 Tage vor Vertragsende
                      </p>
                    </div>
                    <Switch id="contract-expiry" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="move-reminder">Ein- und Auszüge</Label>
                      <p className="text-sm text-muted-foreground">
                        7 Tage vor geplanten Ein- oder Auszügen
                      </p>
                    </div>
                    <Switch id="move-reminder" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungsempfänger</CardTitle>
                <CardDescription>
                  E-Mail-Adressen für Systembenachrichtigungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-email">Primäre E-Mail</Label>
                  <Input id="primary-email" type="email" defaultValue="verwaltung@sev-property.de" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-email">Sekundäre E-Mail (optional)</Label>
                  <Input id="secondary-email" type="email" placeholder="backup@sev-property.de" />
                </div>
                
                <div className="pt-4">
                  <Button>Einstellungen speichern</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benutzerverwaltung</CardTitle>
                <CardDescription>
                  Verwalten Sie Benutzer und deren Zugriffsrechte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Admin User</p>
                        <p className="text-sm text-muted-foreground">admin@sev-property.de</p>
                      </div>
                    </div>
                    <Badge>Administrator</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Property Manager</p>
                        <p className="text-sm text-muted-foreground">manager@sev-property.de</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Manager</Badge>
                  </div>
                  
                  <div className="pt-4">
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Neuen Benutzer hinzufügen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Systemeinstellungen</CardTitle>
                <CardDescription>
                  Allgemeine Systemkonfiguration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Select defaultValue="de">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zeitzone</Label>
                  <Select defaultValue="europe-berlin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-berlin">Europe/Berlin</SelectItem>
                      <SelectItem value="europe-vienna">Europe/Vienna</SelectItem>
                      <SelectItem value="europe-zurich">Europe/Zurich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="chf">CHF (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datensicherung</CardTitle>
                <CardDescription>
                  Automatische Backups und Datenexport
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-backup">Automatische Datensicherung</Label>
                    <p className="text-sm text-muted-foreground">
                      Täglich um 2:00 Uhr
                    </p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                
                <div className="pt-4 space-x-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup jetzt erstellen
                  </Button>
                  <Button variant="outline">
                    Daten exportieren
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}