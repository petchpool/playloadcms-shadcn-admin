'use client'

import { cn } from '@/lib/utils'
import { LayoutSection } from '../core/layout-section'
import { HeaderSection } from '../core/header-section'
import { Main } from '../core/main'
import { Footer } from './footer'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { MenuButton } from '../components/menu-button'
import { NavMobile } from './nav/nav-mobile'
import { NavDesktop } from './nav/nav-desktop'
import { AppSidebar } from './nav/app-sidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
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
        <LayoutSection
          headerSection={
            <HeaderSection
              className={header?.className}
              slots={{
                leftArea: (
                  <>
                    {/* Mobile Nav Toggle */}
                    <MenuButton onClick={mobileNavOpen.onTrue} className="mr-2 -ml-1 md:hidden" />
                    <NavMobile
                      data={navData}
                      open={mobileNavOpen.value}
                      onClose={mobileNavOpen.onFalse}
                    />
                    {/* Sidebar Toggle for Desktop */}
                    {sidebarEnabled && <SidebarTrigger className="hidden md:flex mr-2" />}
                    {/* Logo */}
                    <Logo />
                  </>
                ),
                rightArea: (
                  <>
                    {/* Desktop Nav */}
                    <NavDesktop data={navData} className="hidden md:mr-6 md:flex" />
                    <div className="flex items-center gap-2">
                      {/* Settings button can be added here */}
                      <Button variant="ghost" size="sm">
                        Settings
                      </Button>
                      <Button variant="default" size="sm">
                        Sign In
                      </Button>
                    </div>
                  </>
                ),
              }}
            />
          }
          footerSection={homePage ? <Footer variant="home" /> : <Footer />}
          className={className}
        >
          <Main>{children}</Main>
        </LayoutSection>
      </SidebarInset>
    </SidebarProvider>
  )
}
