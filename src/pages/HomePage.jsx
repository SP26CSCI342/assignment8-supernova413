import SearchBar from '../components/SearchBar/SearchBar.jsx';
import BusinessList from '../components/BusinessList/BusinessList.jsx'
import Subscription from '../components/Subscription/Subscription.jsx';
import Footer from '../components/Footer/Footer.jsx';
import searchBusinesses from '../util/yelp';
import { useState } from "react";
import './HomePage.css';

function HomePage() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const searchYelp = async (term, location, sortBy) => {
    setLoading(true);
    setError(null)
    try {
        const data = await searchBusinesses(term, location, sortBy);
        setBusinesses(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="HomePage">
        <SearchBar searchYelp={searchYelp} />

        {loading && <p className="HomePage-status">Loading...</p>}
        {error   && <p className="HomePage-status HomePage-status--error">{error}</p>}
        {!loading && !error && <BusinessList businesses={businesses}  />}

        <Subscription />
        <Footer />
    </div> 
  );
}

export default HomePage;
