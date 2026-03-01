import { describe, expect, it } from 'vitest'
import { RouterLinkStub, mount } from '@vue/test-utils'

import AppFooter from '../src/components/AppFooter.vue'
import AppHeader from '../src/components/AppHeader.vue'
import LegalView from '../src/views/LegalView.vue'

describe('layout and legal views', () => {
  // TEST-ID: T-AUTO-01
  // REQ: FA-01, FA-02, QA-03
  it('renders header with logo, title and global navigation links', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Kleiderspendenportal')
    expect(wrapper.text()).toContain('Registrierung von Kleiderspenden')

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links).toHaveLength(3)
    expect(links.map((link) => link.props('to'))).toEqual([
      '/',
      '/',
      '/bestaetigung',
    ])
    expect(wrapper.text()).toContain('Registrierung')
    expect(wrapper.text()).toContain('Bestätigung')
    expect(wrapper.text()).not.toContain('Impressum')
    expect(wrapper.text()).not.toContain('Datenschutz')
  })

  // TEST-ID: T-AUTO-02
  // REQ: FA-03, QA-03
  it('renders footer with legal hints and links', () => {
    const wrapper = mount(AppFooter, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Öffentliche Registrierung von Kleiderspenden')
    expect(wrapper.text()).toContain('Dieses Produkt ist eine Fallstudie.')

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links).toHaveLength(2)
    expect(links.map((link) => link.props('to'))).toEqual([
      '/impressum',
      '/datenschutz',
    ])
  })

  // TEST-ID: T-AUTO-03
  // REQ: FA-03, QA-03
  it('renders imprint page content', () => {
    const wrapper = mount(LegalView, {
      props: { pageKey: 'imprint' },
    })

    expect(wrapper.text()).toContain('Impressum')
    expect(wrapper.text()).toContain('Anbieter')
    expect(wrapper.text()).toContain('Musterstraße 1, 10115 Berlin')
  })

  // TEST-ID: T-AUTO-04
  // REQ: FA-03, QA-03
  it('renders privacy page content', () => {
    const wrapper = mount(LegalView, {
      props: { pageKey: 'privacy' },
    })

    expect(wrapper.text()).toContain('Datenschutz')
    expect(wrapper.text()).toContain('Session Storage')
    expect(wrapper.text()).toContain('Speicherdauer')
  })

})
