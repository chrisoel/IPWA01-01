export const REFERENCE_POSTAL_CODE = '10115'

export const OFFICE_LOCATION_LABEL =
  'Geschäftsstelle, Musterstraße 1, 10115 Berlin'

export const DELIVERY_METHOD_LABELS = {
  office: 'Übergabe an der Geschäftsstelle',
  pickup: 'Abholung durch Sammelfahrzeug',
}

export const DELIVERY_METHOD_OPTIONS = [
  {
    value: 'office',
    emoji: '🏢',
    label: DELIVERY_METHOD_LABELS.office,
    hint: 'Sie bringen die Spende selbst zur Geschäftsstelle.',
  },
  {
    value: 'pickup',
    emoji: '🚚',
    label: DELIVERY_METHOD_LABELS.pickup,
    hint: 'Zusätzlich wird eine Abholadresse innerhalb des Einzugsgebiets benötigt.',
  },
]

export const CLOTHING_TYPES = [
  'Winterjacken',
  'Kinderkleidung',
  'Alltagskleidung',
  'Schuhe',
  'Decken & Schlafsäcke',
]

export const CRISIS_AREAS = [
  'Ukraine',
  'Sudan',
  'Gaza / Palästinensische Gebiete',
  'Syrien',
  'Afghanistan',
]
