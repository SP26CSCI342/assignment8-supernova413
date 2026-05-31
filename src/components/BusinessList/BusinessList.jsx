import './BusinessList.css';
import Business from '../Business/Business.jsx'

function BusinessList({ businesses }) {
    return (
        <div className="BusinessList">
            {businesses.map((business, index) => (
                <Business
                    key={index}
                    business={business}
                />
            ))}
        </div>
    );
}

export default BusinessList;