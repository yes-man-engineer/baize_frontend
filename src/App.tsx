import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import IdeaWall from './pages/IdeaWall'
import FailureArchive from './pages/FailureArchive'
import FailureDetail from './pages/FailureDetail'
import DataInsights from './pages/DataInsights'
import Community from './pages/Community'
import Submit from './pages/Submit'
import About from './pages/About'
import OngoingProjects from './pages/OngoingProjects'
import IdeaDetail from './pages/IdeaDetail'

export default function App() {
  return (
    <Layout fullBleedHero>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ideas" element={<IdeaWall />} />
        <Route path="/ideas/:id" element={<IdeaDetail />} />
        <Route path="/failures" element={<FailureArchive />} />
        <Route path="/failures/:slug" element={<FailureDetail />} />
        <Route path="/ongoing" element={<OngoingProjects />} />
        <Route path="/insights" element={<DataInsights />} />
        <Route path="/community" element={<Community />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}
