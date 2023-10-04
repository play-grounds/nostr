import { html, Component } from '../js/standalone.module.js';

function setCurrentUser(user) {
  localStorage.setItem('currentUser', user);
}

async function getCurrentUser() {
  var currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    return currentUser;
  } else {
    currentUser = await window.nostr.getPublicKey();
    currentUser = 'nostr:pubkey:' + currentUser;
    setCurrentUser(currentUser);
    return currentUser;
  }
}

async function currentUserProfile() {
  var user = await getCurrentUser();
  if (!user) {
    return null;
  }

  if (localStorage.getItem('currentUserProfile')) {
    return JSON.parse(localStorage.getItem('currentUserProfile'));
  }

  var cacheUri = 'https://nostr.social';

  console.log('currentUserProfile', user)

  if (!user) {
    return null;
  }
  try {
    const response = await fetch(`${cacheUri}/.well-known/nostr/pubkey/${user?.replace('nostr:pubkey:', '')}/index.json`);
    const data = await response.json();

    localStorage.setItem('currentUserProfile', JSON.stringify(data));
    return data

  } catch (error) {
    console.error('Error:', error);
  }
}

class Navbar2 extends Component {
  state = { user: null, menuOpen: false };

  login = async () => {
    // Logic to log in user and set user state
    const userKey = await getCurrentUser();
    if (userKey) {
      const userProfile = await currentUserProfile();
      if (userProfile && userProfile.mainEntity) {
        this.setState({ user: userProfile.mainEntity });
      }
    }
  };

  logout = () => {
    // Logic to log out user and clear user state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserProfile');
    this.setState({ user: null });
  };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render({ links = [] }) {
    const styles = {
      menuButton: {
        fontSize: '24px',
        cursor: 'pointer',
        display: 'none',
        '@media (max-width: 768px)': {
          display: 'block',
        }
      },
      ul: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: this.state.menuOpen ? 'block' : 'flex',
        '@media (max-width: 768px)': {
          display: this.state.menuOpen ? 'block' : 'none',
        }
      },
      nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
        backgroundColor: '#6A1B9A', // Deep purple
      },
      ul: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center', // Center the menu items
        flex: 1, // Take up as much space as possible
      },
      userSection: {
        display: 'flex',
        alignItems: 'center',
      },
      brand: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '24px',
      },
      ul: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
      },
      li: {
        margin: '0 10px',
      },
      a: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: '500',
        '&:hover': {
          color: '#D1C4E9', // Light purple
        }
      },

      button: {
        backgroundColor: '#AB47BC', // Medium purple
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: '500',
        width: '200px', // Fixed width
        textAlign: 'center', // Center the text
        overflow: 'hidden', // Hide overflowed content
        whiteSpace: 'nowrap', // Prevent wrapping
        textOverflow: 'ellipsis', // Add ellipsis for overflowed content
        '&:hover': {
          backgroundColor: '#9C27B0', // Slightly darker purple
        }
      },

      userGreeting: {
        marginRight: '20px',
        color: 'white',
        fontSize: '18px',
        fontWeight: '500',
      }
    };

    var [brandLink, ...navLinks] = links; // Destructure to get brand and nav links


    brandLink = brandLink || { label: "menu" }

    return html`
      <nav style=${styles.nav}>
        <a href=${brandLink['@id']} style=${styles.brand}>${brandLink.label}</a>
        <div style=${styles.menuButton} onClick=${this.toggleMenu}>Menu</div>
        <ul style=${styles.ul}>
          ${navLinks.map(link => html`
            <li style=${styles.li}><a href=${link['@id']} style=${styles.a}>${link.label}</a></li>
          `)}
        </ul>
        <div style=${styles.userSection}>
          ${this.state.user ? (
        html`
              <button onClick=${this.logout} style=${styles.button}>${this.state.user.name}</button>
            `
      ) : (
        html`<button onClick=${this.login} style=${styles.button}>Login</button>`
      )}
        </div>
      </nav>
      `;

  }
}

export default Navbar2;
