# Kleiderspendenportal (IPWA01-01)

Dieses Projekt ist eine Fallstudien-Webanwendung zur Registrierung von Kleiderspenden. Spendende können zwischen persönlicher Übergabe an der Geschäftsstelle und Abholung wählen. Bei Abholung wird die Adresse clientseitig geprüft, inklusive PLZ-Präfix-Regel für das Einzugsgebiet. Nach erfolgreicher Registrierung zeigt die Anwendung eine Bestätigungsseite mit allen erfassten Daten an.

## Inhalt des Repositories

- `src/`: Vue-Komponenten, Formularlogik, Routing, Store und Styles
- `tests/`: automatisierte Unit- und Komponententests mit Vitest
- `docs/`: PDF-Dokumentation sowie Diagramme/Modelle
- `public/`: statische öffentliche Assets
- `Dockerfile`, `nginx.conf`: Container-Setup zur Auslieferung des Produktionsbuilds
- `test-report.xml`, `test-report.md`: Testnachweise aus dem automatisierten Testlauf

## Lokal testen

### Variante 1: VS Code Live Server

Wenn du die Anwendung über VS Code starten willst, nutze das Plugin `Live Server`.

Wichtig: Für die eigentliche Entwicklung sollte die App über Vite laufen, weil `.vue`-Dateien nicht direkt von einem einfachen Static Server verarbeitet werden.

1. Abhängigkeiten installieren:
   `npm ci`
2. Entwicklungsserver starten:
   `npm run dev`
3. Die in der Konsole angezeigte lokale URL im Browser öffnen (standardmäßig `http://127.0.0.1:5173/`)

Für einen reinen Static-Check mit Live Server zuerst den Produktionsbuild erzeugen:

1. `npm run build`
2. Den Inhalt von `dist/` mit dem VS Code Plugin `Live Server` ausliefern

### Variante 2: Docker

Die Anwendung kann auch als Produktionsbuild in einem Container gestartet werden.

1. Image bauen:
   `docker build -t kleiderspendenportal:review .`
2. Container starten:
   `docker run -d --name kleiderspendenportal-review -p 8080:80 kleiderspendenportal:review`
3. Im Browser öffnen:
   `http://127.0.0.1:8080/`

Wenn du im selben WLAN bist, kannst du die Anwendung auch über die lokale IP des Rechners auf dem Handy testen, z. B. `http://<deine-lokale-ip>:8080/`.

Container wieder stoppen:

1. `docker stop kleiderspendenportal-review`
2. `docker rm kleiderspendenportal-review`

## Automatisierte Prüfungen

- Tests ausführen: `npm test`
- JUnit-Testreport erzeugen: `npm run test:report`
- Linting ausführen: `npm run lint`
- Produktionsbuild erzeugen: `npm run build`
