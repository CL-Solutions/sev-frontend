"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Euro,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data for demonstration
const stats = {
  totalProperties: 12,
  totalUnits: 48,
  occupiedUnits: 45,
  totalTenants: 45,
  monthlyRentExpected: 38500,
  monthlyRentCollected: 31200,
  overduePayments: 7,
}

const paymentStatus = {
  paid: 35,
  partial: 3,
  overdue: 7,
  upcoming: 0,
}

const recentTransactions = [
  { id: 1, tenant: "Ochs, David", property: "Linkstr. 27", amount: 825, status: "paid", date: "08.01.2025" },
  { id: 2, tenant: "Müller, Anna", property: "Arbestr. 1", amount: 735, status: "paid", date: "08.01.2025" },
  { id: 3, tenant: "Schmidt, Peter", property: "Theaterstr. 1", amount: 650, status: "partial", date: "07.01.2025" },
  { id: 4, tenant: "Wagner, Maria", property: "Rathausstr. 12", amount: 890, status: "overdue", date: "01.01.2025" },
  { id: 5, tenant: "Fischer, Thomas", property: "Bahnhofstr. 5", amount: 720, status: "paid", date: "06.01.2025" },
]


export default function DashboardPage() {
  const collectionRate = (stats.monthlyRentCollected / stats.monthlyRentExpected) * 100

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <Button variant="outline" size="sm">
          <CreditCard className="mr-2 h-4 w-4" />
          Bank synchronisieren
        </Button>
      </header>
      
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objekte</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {stats.occupiedUnits} von {stats.totalUnits} Einheiten vermietet
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mieter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
              <p className="text-xs text-muted-foreground">
                Aktive Mietverträge
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erwartete Miete</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats.monthlyRentExpected)}
              </div>
              <p className="text-xs text-muted-foreground">
                Diesen Monat
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zahlungsquote</CardTitle>
              {collectionRate >= 90 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
              <Progress value={collectionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Zahlungsstatus Januar 2025</CardTitle>
            <CardDescription>Übersicht über alle Mietzahlungen diesen Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bezahlt</p>
                  <p className="text-2xl font-bold">{paymentStatus.paid}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Teilzahlung</p>
                  <p className="text-2xl font-bold">{paymentStatus.partial}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Überfällig</p>
                  <p className="text-2xl font-bold">{paymentStatus.overdue}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ausstehend</p>
                  <p className="text-2xl font-bold">{paymentStatus.upcoming}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Letzte Transaktionen</CardTitle>
              <CardDescription>Automatisch erkannte Zahlungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{transaction.tenant}</p>
                      <p className="text-xs text-muted-foreground">{transaction.property}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                      </span>
                      <Badge
                        variant={
                          transaction.status === 'paid' ? 'default' :
                          transaction.status === 'partial' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {transaction.status === 'paid' ? 'Bezahlt' :
                         transaction.status === 'partial' ? 'Teilzahlung' :
                         'Überfällig'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expiring Contracts */}
          <Card>
            <CardHeader>
              <CardTitle>Auslaufende Verwaltungsverträge</CardTitle>
              <CardDescription>Verträge die bald erneuert werden müssen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weber, Klaus</p>
                      <p className="text-xs text-muted-foreground">2 Objekte • 150€/Monat Gebühr</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="gap-1">
                      <Clock className="h-3 w-3" />
                      1 Monat
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">bis 28.02.2025</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Schmidt, Andrea</p>
                      <p className="text-xs text-muted-foreground">1 Objekt • 150€/Monat Gebühr</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="gap-1">
                      <Clock className="h-3 w-3" />
                      4 Monate
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">bis 31.05.2025</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Anstehende Ereignisse</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Einzug: Neuer Mieter</p>
                        <p className="text-xs text-muted-foreground">Linkstr. 27 - WE 3</p>
                      </div>
                      <Badge variant="outline">15.04.2025</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}