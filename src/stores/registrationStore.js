import { reactive } from 'vue'

// REQ: FA-09 Daten fuer Weiterleitung zur Bestaetigungsseite vorhalten; FA-10 vollstaendige Registrierungsdaten speichern; QA-07 unveraenderte Datenausgabe vorbereiten; QA-10 gekapselte Persistenzlogik
const STORAGE_KEY = 'kleiderspendenportal:last-registration'

function loadRegistration() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistRegistration(data) {
  if (typeof window === 'undefined') {
    return
  }

  if (!data) {
    window.sessionStorage.removeItem(STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const state = reactive({
  lastRegistration: loadRegistration(),
})

export function useRegistrationStore() {
  return {
    state,
    saveRegistration(payload) {
      state.lastRegistration = payload
      persistRegistration(payload)
    },
    clearRegistration() {
      state.lastRegistration = null
      persistRegistration(null)
    },
  }
}
