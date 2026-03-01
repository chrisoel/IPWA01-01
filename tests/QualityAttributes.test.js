import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()

describe('quality attribute coverage', () => {
  // TEST-ID: T-AUTO-35
  // REQ: QA-01, QA-04
  it('uses responsive layout and overflow-safe styling for core views', () => {
    const registrationViewSource = readFileSync(
      path.join(projectRoot, 'src/views/RegistrationView.vue'),
      'utf8',
    )
    const stylesSource = readFileSync(
      path.join(projectRoot, 'src/styles.css'),
      'utf8',
    )

    expect(registrationViewSource).toContain('class="row g-4 align-items-start"')
    expect(registrationViewSource).toContain('class="col-12 col-xl-7"')
    expect(registrationViewSource).toContain('class="col-12 col-xl-5"')
    expect(stylesSource).toContain('font-size: clamp(')
    expect(stylesSource).toContain('overflow-wrap: anywhere;')
  })

  // TEST-ID: T-AUTO-36
  // REQ: QA-05
  it('keeps interactive controls keyboard-accessible through semantic elements and focus styles', () => {
    const registrationFormSource = readFileSync(
      path.join(projectRoot, 'src/components/RegistrationForm.vue'),
      'utf8',
    )
    const stylesSource = readFileSync(
      path.join(projectRoot, 'src/styles.css'),
      'utf8',
    )

    expect(registrationFormSource).toContain('type="button"')
    expect(registrationFormSource).toContain('type="submit"')
    expect(registrationFormSource).toContain('for="pickupStreet"')
    expect(registrationFormSource).toContain('for="clothingType"')
    expect(stylesSource).toContain('.delivery-method-card:focus-visible')
    expect(stylesSource).toContain('.nav-link:focus-visible')
    expect(stylesSource).toContain('.footer-shell a:focus-visible')
  })

  // TEST-ID: T-AUTO-37
  // REQ: QA-08
  it('uses a standard Vue and Vite setup for broad modern-browser delivery', () => {
    const viteConfigSource = readFileSync(
      path.join(projectRoot, 'vite.config.js'),
      'utf8',
    )
    const mainSource = readFileSync(path.join(projectRoot, 'src/main.js'), 'utf8')

    expect(viteConfigSource).toContain("import vue from '@vitejs/plugin-vue'")
    expect(viteConfigSource).toContain('plugins: [vue()]')
    expect(mainSource).toContain("import { createApp } from 'vue'")
    expect(mainSource).toContain("import 'bootstrap/dist/css/bootstrap.min.css'")
    expect(mainSource).toContain(
      "import 'bootstrap/dist/js/bootstrap.bundle.min.js'",
    )
  })

  // TEST-ID: T-AUTO-38
  // REQ: QA-09
  it('builds production assets within a conservative bundle-size budget', () => {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'pipe',
    })

    const assetsDir = path.join(projectRoot, 'dist/assets')
    const assetFiles = readdirSync(assetsDir)
    const cssFile = assetFiles.find((file) => file.endsWith('.css'))
    const jsFile = assetFiles.find((file) => file.endsWith('.js'))

    expect(cssFile).toBeTruthy()
    expect(jsFile).toBeTruthy()

    const cssSize = statSync(path.join(assetsDir, cssFile)).size
    const jsSize = statSync(path.join(assetsDir, jsFile)).size

    expect(cssSize).toBeLessThan(300_000)
    expect(jsSize).toBeLessThan(250_000)
  })
})
