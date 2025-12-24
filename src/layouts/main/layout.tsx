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
import { NavSidebar } from './nav/nav-sidebar'
import { SidebarToggleButton } from './nav/sidebar-toggle-button'
import { useBoolean } from '@/hooks/use-boolean'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
  }
}

export function MainLayout({
  className,
  children,
  header,
  sidebar,
  data,
}: MainLayoutProps) {
  const pathname = usePathname()
  const mobileNavOpen = useBoolean()
  const homePage = pathname === '/'
  const sidebarEnabled = sidebar?.enabled ?? true
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    sidebar?.defaultCollapsed ?? false,
  )

  const navData = data?.nav || []
  const sidebarNavData = data?.sidebarNav || navData

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true')
    }
  }, [])

  // Save sidebar state to localStorage
  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          className={header?.className}
          slots={{
            leftArea: (
              <>
                {/* Mobile Nav Toggle */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  className="mr-2 -ml-1 md:hidden"
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                />
                {/* Logo */}
                <Logo />
              </>
            ),
            rightArea: (
              <>
                {/* Desktop Nav */}
                <NavDesktop
                  data={navData}
                  className="hidden md:mr-6 md:flex"
                />
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
      sidebarSection={
        sidebarEnabled ? (
          <>
            <NavSidebar
              data={sidebarNavData}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={handleToggleSidebar}
            />
            <SidebarToggleButton
              isCollapsed={sidebarCollapsed}
              onClick={handleToggleSidebar}
            />
          </>
        ) : null
      }
      footerSection={homePage ? <Footer variant="home" /> : <Footer />}
      className={cn(
        sidebarEnabled && 'transition-[padding-left] duration-200',
        sidebarEnabled && !sidebarCollapsed && 'lg:pl-[300px]',
        sidebarEnabled && sidebarCollapsed && 'lg:pl-[88px]',
        className,
      )}
    >
      <Main>{children}</Main>
    </LayoutSection>
  )
}

