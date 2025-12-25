'use client'

import * as React from 'react'
import { BlocksTableSelectionBlock } from '@/components/blocks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, Activity, Component } from 'lucide-react'

export default function AnalyticsPage() {
  const [selectedBlocks, setSelectedBlocks] = React.useState<string[]>([])
  const [selectedData, setSelectedData] = React.useState<any[]>([])

  const handleSelectionChange = (ids: string[], data: any[]) => {
    setSelectedBlocks(ids)
    setSelectedData(data)
    console.log('Selected IDs:', ids)
    console.log('Selected Data:', data)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select blocks and components to analyze their performance and usage
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Components</CardTitle>
              <Component className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Blocks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-xs text-muted-foreground">+8.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">+4.2% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Blocks Summary */}
      {selectedBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Selected Blocks Analysis
            </CardTitle>
            <CardDescription>
              Analyzing {selectedBlocks.length} selected block{selectedBlocks.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedData.map((block) => (
                  <Badge key={block.id} variant="secondary" className="text-sm">
                    {block.name}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Average Views</div>
                  <div className="text-2xl font-bold mt-2">2,345</div>
                  <p className="text-xs text-muted-foreground mt-1">per block</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Engagement Rate</div>
                  <div className="text-2xl font-bold mt-2">76%</div>
                  <p className="text-xs text-muted-foreground mt-1">across selected</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Load Time</div>
                  <div className="text-2xl font-bold mt-2">1.2s</div>
                  <p className="text-xs text-muted-foreground mt-1">average</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button size="sm" variant="outline">
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocks Selection Table */}
      <Card>
        <CardHeader>
          <CardTitle>Select Blocks for Analysis</CardTitle>
          <CardDescription>
            Choose blocks and components to analyze their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlocksTableSelectionBlock
            collection="components"
            columns={['name', 'type', 'category', 'status']}
            limit={10}
            showStatusTabs={true}
            selectionMode="multiple"
            maxSelection={10}
            onSelectionChange={handleSelectionChange}
            defaultSelectedIds={[]}
            showSelectionSummary={true}
            selectionMessage={(count, max) =>
              `${count} of ${max} blocks selected for analysis`
            }
            syncUrl={true}
            urlGroup="analytics"
          />
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Select Blocks</h4>
            <p className="text-sm text-muted-foreground">
              Use the table above to select up to 10 blocks you want to analyze. You can filter by
              type, category, and status.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. View Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Once you select blocks, their aggregated analytics will appear in the summary card
              above.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Generate Reports</h4>
            <p className="text-sm text-muted-foreground">
              Click "Generate Report" to create a detailed analytics report for the selected blocks.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">4. Export Data</h4>
            <p className="text-sm text-muted-foreground">
              Export your analytics data to CSV or JSON format for further analysis or reporting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

