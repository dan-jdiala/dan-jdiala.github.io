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
      <a className="skip-link" href="#systems">
        Skip to projects
      </a>
      <StatusBar />
      <main>
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
