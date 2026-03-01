import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RouterLinkStub, mount } from '@vue/test-utils'

import ConfirmationView from '../src/views/ConfirmationView.vue'
import { useRegistrationStore } from '../src/stores/registrationStore'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

function createRegistration(overrides = {}) {
  return {
    deliveryMethod: 'office',
    deliveryMethodLabel: 'Übergabe an der Geschäftsstelle',
    clothingType: 'Winterjacken',
    crisisArea: 'Ukraine',
    pickupAddress: null,
    timestamp: '2026-02-26T10:00:00.000Z',
    date: '26.02.2026',
    time: '11:00',
    location: 'Geschäftsstelle, Musterstraße 1, 10115 Berlin',
    ...overrides,
  }
}

describe('ConfirmationView', () => {
  beforeEach(() => {
    pushMock.mockReset()
    window.sessionStorage.clear()
    useRegistrationStore().clearRegistration()
  })

  // TEST-ID: T-AUTO-30
  // REQ: FA-09, FA-10, QA-07
  it('renders all required confirmation data after successful registration', () => {
    useRegistrationStore().saveRegistration(createRegistration())

    const wrapper = mount(ConfirmationView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Registrierung erfolgreich abgeschlossen')
    expect(wrapper.text()).toContain('Übergabeweg')
    expect(wrapper.text()).toContain('Art der Kleidung')
    expect(wrapper.text()).toContain('Krisengebiet')
    expect(wrapper.text()).toContain('Datum')
    expect(wrapper.text()).toContain('Uhrzeit')
    expect(wrapper.text()).toContain('Ort')
    expect(wrapper.text()).toContain('Winterjacken')
    expect(wrapper.text()).toContain('Ukraine')
    expect(wrapper.text()).toContain('26.02.2026')
    expect(wrapper.text()).toContain('11:00')
    expect(wrapper.text()).toContain('Geschäftsstelle, Musterstraße 1, 10115 Berlin')
  })

  // TEST-ID: T-AUTO-31
  // REQ: FA-10, QA-07
  it('renders pickup address block when pickup data is present', () => {
    useRegistrationStore().saveRegistration(
      createRegistration({
        deliveryMethod: 'pickup',
        deliveryMethodLabel: 'Abholung durch Sammelfahrzeug',
        pickupAddress: {
          street: 'Musterweg',
          houseNumber: '12a',
          postalCode: '10999',
          city: 'Berlin',
        },
        location: 'Musterweg 12a, 10999 Berlin',
      }),
    )

    const wrapper = mount(ConfirmationView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Abholadresse')
    expect(wrapper.text()).toContain('Musterweg 12a')
    expect(wrapper.text()).toContain('10999 Berlin')
  })

})
