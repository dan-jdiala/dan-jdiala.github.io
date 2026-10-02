import { Capabilities } from './components/Capabilities'
import { EducationPanel } from './components/EducationPanel'
import { EventLog } from './components/EventLog'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { StatusBar } from './components/StatusBar'
import { Systems } from './components/Systems'
import { TelemetryTiles } from './components/TelemetryTiles'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <StatusBar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <TelemetryTiles />
        <Systems />
        <EventLog />
        <Capabilities />
        <EducationPanel />
      </main>
      <Footer />
    </>
  )
}
