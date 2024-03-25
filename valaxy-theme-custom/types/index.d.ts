export namespace StarterTheme {
  export type Config = ThemeConfig
}

/**
 * Theme Config
 */
export interface ThemeConfig {
  pages: Page[]

  quickAccess: QuickAccess[]

  author: {
    slogan: string
  }

  announcement: {
    enable: boolean
    content: string
  }

  postBanner: string

  footer: Partial<{
    since: number
  }>
}

export interface Page {
  name: string
  url: string
}

export interface QuickAccess {
  name: string
  url: string
  icon: string
}

export type ThemeUserConfig = Partial<ThemeConfig>
