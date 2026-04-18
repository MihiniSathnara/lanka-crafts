import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Chatbot from './components/Chatbot.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Spinner from './components/Spinner.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Home from './pages/Home.jsx';
import CraftList from './pages/CraftList.jsx';
import CraftDetail from './pages/CraftDetail.jsx';
import ArtistList from './pages/ArtistList.jsx';
import ArtistProfile from './pages/ArtistProfile.jsx';
import SriLankaMap from './pages/SriLankaMap.jsx';
import WorkshopBooking from './pages/WorkshopBooking.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import TouristDashboard from './pages/tourist/Dashboard.jsx';
import TouristProfile from './pages/tourist/Profile.jsx';
import TouristBookings from './pages/tourist/Bookings.jsx';
import TouristChats from './pages/tourist/Chats.jsx';

import ArtistDashboard from './pages/artist/Dashboard.jsx';
import ArtistProfilePage from './pages/artist/Profile.jsx';
import CraftManagement from './pages/artist/CraftManagement.jsx';
import Availability from './pages/artist/Availability.jsx';
import ArtistChats from './pages/artist/Chats.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crafts" element={<CraftList />} />
          <Route path="/crafts/:id" element={<CraftDetail />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/:id" element={<ArtistProfile />} />
          <Route path="/map" element={<SriLankaMap />} />
          <Route path="/workshops" element={<WorkshopBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute roles={['tourist']} />}>
            <Route path="/tourist/dashboard" element={<TouristDashboard />} />
            <Route path="/tourist/profile" element={<TouristProfile />} />
            <Route path="/tourist/bookings" element={<TouristBookings />} />
            <Route path="/tourist/chats" element={<TouristChats />} />
          </Route>

          <Route element={<ProtectedRoute roles={['artist']} />}>
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
            <Route path="/artist/profile" element={<ArtistProfilePage />} />
            <Route path="/artist/crafts" element={<CraftManagement />} />
            <Route path="/artist/availability" element={<Availability />} />
            <Route path="/artist/chats" element={<ArtistChats />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
