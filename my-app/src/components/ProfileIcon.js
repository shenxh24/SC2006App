// components/ProfileIcon.js
import defaultProfilePic from '../assets/default-profile.png';

function ProfileIcon({ user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    
    return (
      <div className="relative">
        <img 
          onClick={() => setShowDropdown(!showDropdown)}
          /* ... */
        />
        {showDropdown && (
          <div className="dropdown-menu">
            <button>Profile</button>
            <button onClick={signOut}>Logout</button>
          </div>
        )}
      </div>
    );
  }