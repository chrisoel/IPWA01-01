// REQ: FA-05 bis FA-08 und FA-10 in zentraler Formularlogik; QA-02/QA-06 durch klare Regeln und Fehlertexte; QA-07 durch konsistenten Payload; QA-10 durch gekapselte Fachlogik
export const POSTAL_CODE_REGEX = /^\d{5}$/

export function normalizeInput(value) {
  // REQ: QA-06 robuste Vorverarbeitung von Eingaben; QA-10 wiederverwendbare Hilfsfunktion
  return String(value ?? '').trim()
}

export function getPostalPrefix(postalCode) {
  // REQ: FA-08 Vergleichsbasis fuer die ersten zwei PLZ-Ziffern; QA-06 einheitliche Pruefregel
  return normalizeInput(postalCode).slice(0, 2)
}

export function isPostalCodeFormatValid(postalCode) {
  // REQ: FA-08 PLZ muss formal gueltig sein; QA-06 eindeutige technische Vorpruefung
  return POSTAL_CODE_REGEX.test(normalizeInput(postalCode))
}

export function isPickupPostalInArea(postalCode, referencePostalCode) {
  // REQ: FA-08 Einzugsgebiet ueber PLZ-Praefix pruefen; QA-06 konsistente Ablehnungslogik
  const normalizedPostalCode = normalizeInput(postalCode)
  if (!isPostalCodeFormatValid(normalizedPostalCode)) {
    return false
  }

  return (
    getPostalPrefix(normalizedPostalCode) ===
    getPostalPrefix(referencePostalCode)
  )
}

export function isPickupAddressComplete(pickupAddress) {
  // REQ: FA-07 Vollstaendigkeit der Abholadresse; QA-06 Pflichtfeldpruefung fuer Abholungen
  if (!pickupAddress) {
    return false
  }

  return ['street', 'houseNumber', 'postalCode', 'city'].every((key) =>
    Boolean(normalizeInput(pickupAddress[key])),
  )
}

export function canSelectDonationDetails(form, referencePostalCode) {
  // REQ: FA-06 Spendenangaben fuer Geschaeftsstelle sofort; FA-07 Spendenangaben bei Abholung erst nach Adressfreigabe; QA-10 gekapselte Zustandslogik
  const deliveryMethod = form?.deliveryMethod

  if (!deliveryMethod) {
    return false
  }

  if (deliveryMethod === 'office') {
    return true
  }

  if (deliveryMethod !== 'pickup') {
    return false
  }

  return (
    isPickupAddressComplete(form.pickupAddress) &&
    isPickupPostalInArea(form.pickupAddress?.postalCode, referencePostalCode)
  )
}

function addError(errors, key, message) {
  // REQ: QA-06 spezifische Fehlermeldungen sammeln; QA-10 wiederverwendbarer Fehlermechanismus
  errors[key] = message
}

export function validateRegistrationForm(form, { referencePostalCode }) {
  // REQ: FA-05 Uebergabeweg erzwingen; FA-06/FA-07 erforderliche Formularfelder pruefen; FA-08 PLZ-Regel validieren; QA-02 verstaendliche Rueckmeldungen; QA-06 clientseitiges Blockieren ungueltiger Eingaben
  const errors = {}
  const referencePostalPrefix = getPostalPrefix(referencePostalCode)

  if (!form?.deliveryMethod) {
    addError(errors, 'deliveryMethod', 'Bitte wählen Sie einen Übergabeweg.')
  }

  if (!form?.clothingType) {
    addError(
      errors,
      'clothingType',
      'Bitte wählen Sie eine Art der Kleidung aus.',
    )
  }

  if (!form?.crisisArea) {
    addError(errors, 'crisisArea', 'Bitte wählen Sie ein Krisengebiet aus.')
  }

  if (form?.deliveryMethod === 'pickup') {
    const pickupAddress = form.pickupAddress ?? {}

    if (!normalizeInput(pickupAddress.street)) {
      addError(
        errors,
        'pickupAddress.street',
        'Bitte geben Sie eine Straße ein.',
      )
    }

    if (!normalizeInput(pickupAddress.houseNumber)) {
      addError(
        errors,
        'pickupAddress.houseNumber',
        'Bitte geben Sie eine Hausnummer ein.',
      )
    }

    const postalCode = normalizeInput(pickupAddress.postalCode)
    if (!postalCode) {
      addError(
        errors,
        'pickupAddress.postalCode',
        'Bitte geben Sie eine Postleitzahl ein.',
      )
    } else if (!isPostalCodeFormatValid(postalCode)) {
      addError(
        errors,
        'pickupAddress.postalCode',
        'Die Postleitzahl muss aus genau 5 Ziffern bestehen.',
      )
    } else if (!isPickupPostalInArea(postalCode, referencePostalCode)) {
      addError(
        errors,
        'pickupAddress.postalCode',
        `Abholung nicht möglich: Die ersten zwei Ziffern der PLZ müssen ${referencePostalPrefix} sein, da Abholungen nur im Einzugsgebiet der Geschäftsstelle angeboten werden.`,
      )
    }

    if (!normalizeInput(pickupAddress.city)) {
      addError(errors, 'pickupAddress.city', 'Bitte geben Sie einen Ort ein.')
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function buildLocationLabel(form, officeLocationLabel) {
  // REQ: FA-10 korrekten Ort fuer die Bestaetigung ableiten; QA-07 konsistente Ortsdarstellung
  if (form.deliveryMethod !== 'pickup') {
    return officeLocationLabel
  }

  const { street, houseNumber, postalCode, city } = form.pickupAddress
  return `${normalizeInput(street)} ${normalizeInput(houseNumber)}, ${normalizeInput(postalCode)} ${normalizeInput(city)}`
}

export function buildRegistrationPayload(
  form,
  {
    officeLocationLabel,
    deliveryMethodLabels,
    now = new Date(),
    locale = 'de-DE',
  },
) {
  // REQ: FA-10 geforderte Bestaetigungsdaten inklusive Zeitstempel aufbauen; QA-07 Anzeigeformat direkt aus validierten Eingaben erzeugen
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })

  const pickupAddress =
    form.deliveryMethod === 'pickup'
      ? {
          street: normalizeInput(form.pickupAddress.street),
          houseNumber: normalizeInput(form.pickupAddress.houseNumber),
          postalCode: normalizeInput(form.pickupAddress.postalCode),
          city: normalizeInput(form.pickupAddress.city),
        }
      : null

  return {
    deliveryMethod: form.deliveryMethod,
    deliveryMethodLabel: deliveryMethodLabels[form.deliveryMethod],
    clothingType: form.clothingType,
    crisisArea: form.crisisArea,
    pickupAddress,
    timestamp: now.toISOString(),
    date: dateFormatter.format(now),
    time: timeFormatter.format(now),
    location: buildLocationLabel(form, officeLocationLabel),
  }
}
