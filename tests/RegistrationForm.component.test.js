import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import RegistrationForm from '../src/components/RegistrationForm.vue'
import { useRegistrationStore } from '../src/stores/registrationStore'

const pushMock = vi.fn()
const STORAGE_KEY = 'kleiderspendenportal:last-registration'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

function getDeliveryButtons(wrapper) {
  return wrapper.findAll('button.delivery-method-card')
}

async function selectDeliveryMethod(wrapper, method) {
  const buttons = getDeliveryButtons(wrapper)
  const target = buttons.find(
    (button) =>
      button.attributes('aria-pressed') === 'false' &&
      button.text().includes(method),
  )
  await target.trigger('click')
}

async function fillPickupAddress(wrapper, values) {
  if (values.street !== undefined) {
    await wrapper.find('#pickupStreet').setValue(values.street)
  }
  if (values.houseNumber !== undefined) {
    await wrapper.find('#pickupHouseNumber').setValue(values.houseNumber)
  }
  if (values.postalCode !== undefined) {
    await wrapper.find('#pickupPostalCode').setValue(values.postalCode)
  }
  if (values.city !== undefined) {
    await wrapper.find('#pickupCity').setValue(values.city)
  }
}

describe('RegistrationForm component flow', () => {
  beforeEach(() => {
    pushMock.mockReset()
    window.sessionStorage.clear()
    useRegistrationStore().clearRegistration()
  })

  // TEST-ID: T-AUTO-05
  // REQ: FA-04, FA-05, QA-02
  it('shows only delivery selection initially', () => {
    const wrapper = mount(RegistrationForm)

    expect(wrapper.text()).toContain('Übergabeweg wählen')
    expect(wrapper.find('#clothingType').exists()).toBe(false)
    expect(wrapper.find('#crisisArea').exists()).toBe(false)
    expect(wrapper.find('#pickupStreet').exists()).toBe(false)
    expect(wrapper.text()).toContain(
      'Bitte wählen Sie zuerst einen Übergabeweg',
    )
  })

  // TEST-ID: T-AUTO-08
  // REQ: FA-06, QA-02
  it('shows donation fields immediately for office handover', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Geschäftsstelle')

    expect(wrapper.find('#pickupStreet').exists()).toBe(false)
    expect(wrapper.find('#clothingType').exists()).toBe(true)
    expect(wrapper.find('#crisisArea').exists()).toBe(true)
    expect(wrapper.text()).toContain('Registrierung abschließen')
  })

  // TEST-ID: T-AUTO-11
  // REQ: QA-02
  it('highlights visible required fields before user completes them', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Geschäftsstelle')

    expect(wrapper.find('#clothingType').classes()).toContain('is-pending-required')
    expect(wrapper.find('#crisisArea').classes()).toContain('is-pending-required')
  })

  // TEST-ID: T-AUTO-16
  // REQ: FA-07, FA-08, QA-06
  it('requires valid pickup address before showing donation fields for pickup', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Abholung')

    expect(wrapper.find('#pickupStreet').exists()).toBe(true)
    expect(wrapper.find('#clothingType').exists()).toBe(false)
    expect(wrapper.find('#crisisArea').exists()).toBe(false)

    await wrapper.find('#pickupStreet').setValue('Musterweg')
    await wrapper.find('#pickupHouseNumber').setValue('12')
    await wrapper.find('#pickupCity').setValue('Dortmund')
    await wrapper.find('#pickupPostalCode').setValue('44')

    expect(wrapper.find('#pickupPostalCode').classes()).toContain('is-invalid')
    expect(wrapper.find('#clothingType').exists()).toBe(false)
    expect(wrapper.find('#crisisArea').exists()).toBe(false)

    await wrapper.find('#pickupPostalCode').setValue('10999')

    expect(wrapper.find('#clothingType').exists()).toBe(true)
    expect(wrapper.find('#crisisArea').exists()).toBe(true)
    expect(wrapper.text()).toContain('Registrierung abschließen')
  })

  // TEST-ID: T-AUTO-15
  // REQ: FA-07, QA-02
  it('shows pending highlight on pickup address inputs before completion', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Abholung')

    expect(wrapper.find('#pickupStreet').classes()).toContain('is-pending-required')
    expect(wrapper.find('#pickupHouseNumber').classes()).toContain('is-pending-required')
    expect(wrapper.find('#pickupPostalCode').classes()).toContain('is-pending-required')
    expect(wrapper.find('#pickupCity').classes()).toContain('is-pending-required')
  })

  // TEST-ID: T-AUTO-07
  // REQ: FA-05, QA-02, QA-06
  it('shows validation errors on submit when required fields are missing', async () => {
    const wrapper = mount(RegistrationForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Bitte wählen Sie einen Übergabeweg.')
    expect(pushMock).not.toHaveBeenCalled()
  })

  // TEST-ID: T-AUTO-12
  // REQ: FA-06, QA-02, QA-06
  it('shows and clears select field validation errors after correction', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Geschäftsstelle')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Bitte wählen Sie eine Art der Kleidung aus.')
    expect(wrapper.text()).toContain('Bitte wählen Sie ein Krisengebiet aus.')
    expect(wrapper.find('#clothingType').classes()).toContain('is-invalid')
    expect(wrapper.find('#crisisArea').classes()).toContain('is-invalid')

    await wrapper.find('#clothingType').setValue('Winterjacken')
    await wrapper.find('#crisisArea').setValue('Ukraine')

    expect(wrapper.find('#clothingType').classes()).not.toContain('is-invalid')
    expect(wrapper.find('#crisisArea').classes()).not.toContain('is-invalid')
    expect(wrapper.find('#clothingType').classes()).not.toContain('is-pending-required')
    expect(wrapper.find('#crisisArea').classes()).not.toContain('is-pending-required')
  })

  // TEST-ID: T-AUTO-29
  // REQ: FA-08, QA-02, QA-06
  it('shows and clears pickup postal validation error after correction', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Abholung')
    await fillPickupAddress(wrapper, {
      street: 'Musterweg',
      houseNumber: '12',
      postalCode: '44139',
      city: 'Dortmund',
    })
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Abholung nicht möglich')
    expect(wrapper.find('#pickupPostalCode').classes()).toContain('is-invalid')
    expect(wrapper.find('#clothingType').exists()).toBe(false)

    await wrapper.find('#pickupPostalCode').setValue('10999')

    expect(wrapper.find('#pickupPostalCode').classes()).not.toContain('is-invalid')
    expect(wrapper.find('#clothingType').exists()).toBe(true)
    expect(wrapper.find('#crisisArea').exists()).toBe(true)
  })

  // TEST-ID: T-AUTO-21
  // REQ: FA-07, QA-06
  it('resets pickup address values when switching from pickup to office and back', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Abholung')
    await fillPickupAddress(wrapper, {
      street: 'Musterweg',
      houseNumber: '12',
      postalCode: '10999',
      city: 'Berlin',
    })

    await selectDeliveryMethod(wrapper, 'Geschäftsstelle')
    expect(wrapper.find('#pickupStreet').exists()).toBe(false)

    await selectDeliveryMethod(wrapper, 'Abholung')
    expect(wrapper.find('#pickupStreet').element.value).toBe('')
    expect(wrapper.find('#pickupHouseNumber').element.value).toBe('')
    expect(wrapper.find('#pickupPostalCode').element.value).toBe('')
    expect(wrapper.find('#pickupCity').element.value).toBe('')
    expect(wrapper.find('#clothingType').exists()).toBe(false)
  })

  // TEST-ID: T-AUTO-13
  // REQ: FA-06, FA-09, FA-10, QA-07
  it('submits office flow successfully and navigates to confirmation', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Geschäftsstelle')
    await wrapper.find('#clothingType').setValue('Winterjacken')
    await wrapper.find('#crisisArea').setValue('Ukraine')
    await wrapper.find('form').trigger('submit.prevent')

    expect(pushMock).toHaveBeenCalledWith({ name: 'confirmation' })

    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    const saved = JSON.parse(raw)
    expect(saved.deliveryMethod).toBe('office')
    expect(saved.pickupAddress).toBeNull()
    expect(saved.clothingType).toBe('Winterjacken')
    expect(saved.crisisArea).toBe('Ukraine')
  })

  // TEST-ID: T-AUTO-22
  // REQ: FA-07, FA-08, FA-09, FA-10, QA-07
  it('submits pickup flow successfully after address gate and saves normalized data', async () => {
    const wrapper = mount(RegistrationForm)

    await selectDeliveryMethod(wrapper, 'Abholung')
    await fillPickupAddress(wrapper, {
      street: ' Musterweg ',
      houseNumber: ' 12a ',
      postalCode: ' 10999 ',
      city: ' Berlin ',
    })

    await wrapper.find('#clothingType').setValue('Schuhe')
    await wrapper.find('#crisisArea').setValue('Syrien')
    await wrapper.find('form').trigger('submit.prevent')

    expect(pushMock).toHaveBeenCalledWith({ name: 'confirmation' })

    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY))
    expect(saved.deliveryMethod).toBe('pickup')
    expect(saved.pickupAddress).toEqual({
      street: 'Musterweg',
      houseNumber: '12a',
      postalCode: '10999',
      city: 'Berlin',
    })
    expect(saved.location).toBe('Musterweg 12a, 10999 Berlin')
  })
})
