import '@fontsource/comfortaa'
import '@fontsource/kaushan-script'
import '@fontsource/oswald'
import '@/style/tailwind.css'

import { throwIfNull } from '@/utils'

/**
 * Represents references to DOM elements used in the application.
 */
type DomReferences = Readonly<{
  /** Reference to the main application container element. */
  app: HTMLElement
  /** Reference to the dark mode toggle element. */
  darkModeToggle: HTMLInputElement
  /** Reference to the about section element. */
  sectionAbout: HTMLElement
}>

class App {
  public readonly domRefs: DomReferences

  /**
   * Creates a new instance of the application.
   */
  constructor() {
    this.domRefs = this.initDomRefs()

    this.initialize()
  }

  /**
   * Initializes the DOM references for the application.
   * @throws Error - will throw an error if any of the DOM elements are not found.
   * @returns An object containing references to DOM elements.
   */
  private initDomRefs(): DomReferences {
    const app = throwIfNull(document.querySelector<HTMLElement>('#app'), 'App element not found')
    const darkModeToggle = throwIfNull(document.querySelector<HTMLInputElement>('#dark-mode-toggle'), 'Dark mode toggle element not found') // prettier-ignore
    const sectionAbout = throwIfNull(document.querySelector<HTMLElement>('#about'), 'About section element not found')

    return Object.freeze({
      app,
      darkModeToggle,
      sectionAbout,
    })
  }

  private initialize(): void {
    // Set initial theme
    this.setTheme(document.documentElement.dataset.theme === 'dark')

    this.bindEvents()
  }

  private bindEvents(): void {
    this.domRefs.darkModeToggle.addEventListener('change', () => {
      this.handleDarkModeToggle()
    })
  }

  private handleDarkModeToggle(): void {
    const isDarkMode = this.domRefs.darkModeToggle.checked

    this.setTheme(isDarkMode)
  }

  private setTheme(isDarkMode: boolean): void {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'
    localStorage.theme = isDarkMode ? 'dark' : 'light'

    const iconElement = this.domRefs.darkModeToggle.parentNode?.parentNode?.querySelector('i')
    if (iconElement) {
      iconElement.classList.replace(isDarkMode ? 'fa-sun' : 'fa-moon', isDarkMode ? 'fa-moon' : 'fa-sun')
      this.domRefs.darkModeToggle.checked = isDarkMode
    }

    // Update image sources
    this.domRefs.sectionAbout.querySelectorAll('img').forEach((img) => {
      img.src = img.src.replace(isDarkMode ? 'light' : 'dark', isDarkMode ? 'dark' : 'light')
    })
  }
}

new App()
