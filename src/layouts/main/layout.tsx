'use client'

import { cn } from '@/lib/utils'
import { LayoutSection } from '../core/layout-section'
import { Main } from '../core/main'
import { Footer } from './footer'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { MenuButton } from '../components/menu-button'
import { NavMobile } from './nav/nav-mobile'
import { NavDesktop } from './nav/nav-desktop'
import { AppSidebar } from './nav/app-sidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { useBoolean } from '@/hooks/use-boolean'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export type MainLayoutProps = {
  className?: string
  children: React.ReactNode
  header?: {
    className?: string
  }
  sidebar?: {
    enabled?: boolean
    defaultCollapsed?: boolean
  }
  data?: {
    nav?: any[]
    sidebarNav?: any[]
    header?: any
    footer?: any
    sidebar?: any
  }
}

export function MainLayout({ className, children, header, sidebar, data }: MainLayoutProps) {
  const pathname = usePathname()
  const mobileNavOpen = useBoolean()
  const homePage = pathname === '/'
  const sidebarEnabled = sidebar?.enabled ?? true

  const navData = data?.nav || []
  const sidebarNavData = data?.sidebarNav || navData

  // Debug logging
  useEffect(() => {
    console.log('🔍 MainLayout sidebar state:', {
      sidebarEnabled,
      sidebarNavDataLength: sidebarNavData.length,
      sidebarNavData,
      sidebarConfig: sidebar,
    })
  }, [sidebarEnabled, sidebarNavData, sidebar])

  return (
    <SidebarProvider defaultOpen={!sidebar?.defaultCollapsed}>
      {sidebarEnabled && <AppSidebar data={sidebarNavData} />}
      <SidebarInset>
        {/* Header with Breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              {sidebarEnabled && <SidebarTrigger className="-ml-1" />}
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  {!homePage && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {pathname.split('/').filter(Boolean).pop() || 'Page'}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Nav Toggle */}
              <MenuButton onClick={mobileNavOpen.onTrue} className="md:hidden" />
              <NavMobile
                data={navData}
                open={mobileNavOpen.value}
                onClose={mobileNavOpen.onFalse}
              />
              {/* Desktop Nav */}
              <NavDesktop data={navData} className="hidden md:mr-2 md:flex" />
              {/* Action Buttons */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Settings
              </Button>
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <Main className="flex-1">{children}</Main>
          {homePage ? <Footer variant="home" /> : <Footer />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
