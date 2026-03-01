import { describe, expect, it } from 'vitest'

import {
  buildRegistrationPayload,
  canSelectDonationDetails,
  getPostalPrefix,
  isPickupAddressComplete,
  isPostalCodeFormatValid,
  normalizeInput,
  isPickupPostalInArea,
  validateRegistrationForm,
} from '../src/features/registration/formLogic'

const referencePostalCode = '10115'

function createBaseForm(overrides = {}) {
  return {
    deliveryMethod: 'office',
    clothingType: 'Winterjacken',
    crisisArea: 'Ukraine',
    pickupAddress: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
    },
    ...overrides,
  }
}

describe('formLogic', () => {
  // TEST-ID: T-AUTO-39
  // REQ: QA-06, QA-10
  it('normalizes input values robustly', () => {
    expect(normalizeInput('  Test  ')).toBe('Test')
    expect(normalizeInput(123)).toBe('123')
    expect(normalizeInput(null)).toBe('')
    expect(normalizeInput(undefined)).toBe('')
  })

  // TEST-ID: T-AUTO-23
  // REQ: FA-08, QA-06
  it('returns the first two postal code digits', () => {
    expect(getPostalPrefix('10115')).toBe('10')
    expect(getPostalPrefix(' 44139 ')).toBe('44')
    expect(getPostalPrefix('9')).toBe('9')
    expect(getPostalPrefix('')).toBe('')
  })

  // TEST-ID: T-AUTO-24
  // REQ: FA-08, QA-06
  it('validates postal code format with boundary cases', () => {
    expect(isPostalCodeFormatValid('10115')).toBe(true)
    expect(isPostalCodeFormatValid(' 10115 ')).toBe(true)
    expect(isPostalCodeFormatValid('1011')).toBe(false)
    expect(isPostalCodeFormatValid('101150')).toBe(false)
    expect(isPostalCodeFormatValid('10A15')).toBe(false)
    expect(isPostalCodeFormatValid('')).toBe(false)
  })

  // TEST-ID: T-AUTO-25
  // REQ: FA-08, QA-06
  it('detects pickup postal code inside the office area', () => {
    expect(isPickupPostalInArea('10999', referencePostalCode)).toBe(true)
    expect(isPickupPostalInArea(' 10999 ', ' 10115 ')).toBe(true)
    expect(isPickupPostalInArea('44139', referencePostalCode)).toBe(false)
    expect(isPickupPostalInArea('10A99', referencePostalCode)).toBe(false)
  })

  // TEST-ID: T-AUTO-14
  // REQ: FA-07, QA-06
  it('detects whether pickup address is complete including whitespace-only inputs', () => {
    expect(
      isPickupAddressComplete({
        street: 'Musterweg',
        houseNumber: '1',
        postalCode: '10115',
        city: 'Berlin',
      }),
    ).toBe(true)

    expect(
      isPickupAddressComplete({
        street: '   ',
        houseNumber: '1',
        postalCode: '10115',
        city: 'Berlin',
      }),
    ).toBe(false)
    expect(isPickupAddressComplete(null)).toBe(false)
  })

  // TEST-ID: T-AUTO-09
  // REQ: FA-06, QA-10
  it('allows donation details immediately for office handover', () => {
    const form = createBaseForm({ deliveryMethod: 'office' })
    expect(canSelectDonationDetails(form, referencePostalCode)).toBe(true)
  })

  // TEST-ID: T-AUTO-17
  // REQ: FA-07, FA-08, QA-06
  it('blocks donation details for pickup until address is complete and postal code valid', () => {
    const incompletePickupForm = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Testweg',
        houseNumber: '',
        postalCode: '10115',
        city: 'Berlin',
      },
    })
    const outsideAreaPickupForm = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Testweg',
        houseNumber: '1',
        postalCode: '44139',
        city: 'Dortmund',
      },
    })
    const validPickupForm = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Testweg',
        houseNumber: '1',
        postalCode: '10999',
        city: 'Berlin',
      },
    })

    expect(
      canSelectDonationDetails(incompletePickupForm, referencePostalCode),
    ).toBe(false)
    expect(
      canSelectDonationDetails(outsideAreaPickupForm, referencePostalCode),
    ).toBe(false)
    expect(canSelectDonationDetails(validPickupForm, referencePostalCode)).toBe(
      true,
    )
  })

  // TEST-ID: T-AUTO-10
  // REQ: FA-06, QA-06
  it('validates office form successfully without pickup address', () => {
    const result = validateRegistrationForm(createBaseForm(), {
      referencePostalCode,
    })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  // TEST-ID: T-AUTO-18
  // REQ: FA-07, FA-08, QA-06
  it('accepts valid pickup form including matching postal prefix', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Musterweg',
        houseNumber: '12',
        postalCode: '10999',
        city: 'Berlin',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  // TEST-ID: T-AUTO-06
  // REQ: FA-05, FA-06, QA-02, QA-06
  it('returns required-field errors for empty form', () => {
    const form = createBaseForm({
      deliveryMethod: '',
      clothingType: '',
      crisisArea: '',
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(false)
    expect(result.errors.deliveryMethod).toBeTruthy()
    expect(result.errors.clothingType).toBeTruthy()
    expect(result.errors.crisisArea).toBeTruthy()
  })

  // TEST-ID: T-AUTO-19
  // REQ: FA-07, FA-08, QA-06
  it('validates pickup address fields and postal code format', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: '',
        houseNumber: '',
        postalCode: '1234',
        city: '',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(false)
    expect(result.errors['pickupAddress.street']).toBeTruthy()
    expect(result.errors['pickupAddress.houseNumber']).toBeTruthy()
    expect(result.errors['pickupAddress.postalCode']).toContain(
      'genau 5 Ziffern',
    )
    expect(result.errors['pickupAddress.city']).toBeTruthy()
  })

  // TEST-ID: T-AUTO-20
  // REQ: FA-07, QA-06
  it('treats whitespace-only pickup address inputs as missing', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: '   ',
        houseNumber: '   ',
        postalCode: '   ',
        city: '   ',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(false)
    expect(result.errors['pickupAddress.street']).toContain('Straße')
    expect(result.errors['pickupAddress.houseNumber']).toContain('Hausnummer')
    expect(result.errors['pickupAddress.postalCode']).toContain('Postleitzahl')
    expect(result.errors['pickupAddress.city']).toContain('Ort')
  })

  // TEST-ID: T-AUTO-26
  // REQ: FA-08, QA-06
  it('rejects pickup postal code outside the office area with explanation', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Ring',
        houseNumber: '2',
        postalCode: '44139',
        city: 'Dortmund',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(false)
    expect(result.errors['pickupAddress.postalCode']).toContain('Einzugsgebiet')
    expect(result.errors['pickupAddress.postalCode']).toContain('10')
  })

  // TEST-ID: T-AUTO-27
  // REQ: FA-08, QA-06
  it('prioritizes postal format error before area check', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Ring',
        houseNumber: '2',
        postalCode: '10A9X',
        city: 'Berlin',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(false)
    expect(result.errors['pickupAddress.postalCode']).toContain('genau 5 Ziffern')
    expect(result.errors['pickupAddress.postalCode']).not.toContain('Einzugsgebiet')
  })

  // TEST-ID: T-AUTO-28
  // REQ: FA-08, QA-06
  it('trims pickup postal code before validation and area check', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: 'Ring',
        houseNumber: '2',
        postalCode: ' 10999 ',
        city: 'Berlin',
      },
    })

    const result = validateRegistrationForm(form, { referencePostalCode })

    expect(result.isValid).toBe(true)
  })

  // TEST-ID: T-AUTO-32
  // REQ: FA-10, QA-07
  it('builds confirmation payload for office handover', () => {
    const now = new Date('2026-02-26T12:34:00.000Z')
    const form = createBaseForm({
      deliveryMethod: 'office',
      pickupAddress: {
        street: 'X',
        houseNumber: '1',
        postalCode: '10115',
        city: 'Berlin',
      },
    })

    const payload = buildRegistrationPayload(form, {
      officeLocationLabel: 'Geschäftsstelle, Musterstraße 1, 10115 Berlin',
      deliveryMethodLabels: {
        office: 'Übergabe an der Geschäftsstelle',
        pickup: 'Abholung durch Sammelfahrzeug',
      },
      now,
    })

    expect(payload.deliveryMethod).toBe('office')
    expect(payload.pickupAddress).toBeNull()
    expect(payload.location).toContain('Geschäftsstelle')
    expect(payload.timestamp).toBe('2026-02-26T12:34:00.000Z')
  })

  // TEST-ID: T-AUTO-33
  // REQ: FA-10, QA-07
  it('builds confirmation payload for pickup with normalized address', () => {
    const form = createBaseForm({
      deliveryMethod: 'pickup',
      pickupAddress: {
        street: ' Testweg ',
        houseNumber: ' 3a ',
        postalCode: ' 10999 ',
        city: ' Berlin ',
      },
    })

    const payload = buildRegistrationPayload(form, {
      officeLocationLabel: 'irrelevant',
      deliveryMethodLabels: {
        office: 'Übergabe an der Geschäftsstelle',
        pickup: 'Abholung durch Sammelfahrzeug',
      },
      now: new Date('2026-02-26T10:00:00.000Z'),
    })

    expect(payload.pickupAddress).toEqual({
      street: 'Testweg',
      houseNumber: '3a',
      postalCode: '10999',
      city: 'Berlin',
    })
    expect(payload.location).toBe('Testweg 3a, 10999 Berlin')
  })

  // TEST-ID: T-AUTO-34
  // REQ: FA-10, QA-07
  it('builds localized timestamp fields for payload', () => {
    const payload = buildRegistrationPayload(createBaseForm(), {
      officeLocationLabel: 'Geschäftsstelle, Musterstraße 1, 10115 Berlin',
      deliveryMethodLabels: {
        office: 'Übergabe an der Geschäftsstelle',
        pickup: 'Abholung durch Sammelfahrzeug',
      },
      now: new Date('2026-02-26T10:00:00.000Z'),
      locale: 'de-DE',
    })

    expect(typeof payload.date).toBe('string')
    expect(typeof payload.time).toBe('string')
    expect(payload.date.length).toBeGreaterThan(0)
    expect(payload.time.length).toBeGreaterThan(0)
  })
})
