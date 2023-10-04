import { html, render } from '../js/standalone.module.js'
import Navbar from '../js/navbar2.js'

const links = [
  {
    '@id': 'https://github.com/ursuscamp/nomen/blob/master/docs/SPEC.md',
    label: 'Profile'
  }
]

// Use `let` instead of `const` to allow reassignment.
let profile = localStorage.currentUserProfile ? JSON.parse(localStorage.currentUserProfile) : null

const renderApp = (profileToRender) => {
  render(html`<${Navbar} links=${links} />
  <pre>
    ${profileToRender ? JSON.stringify(profileToRender, null, 2) : 'No profile available'}
  </pre>
  `, document.body)
}

// Initial render
renderApp(profile)

setInterval(() => {
  const newProfile = localStorage.currentUserProfile ? JSON.parse(localStorage.currentUserProfile) : null
  if (JSON.stringify(newProfile) !== JSON.stringify(profile)) {
    profile = newProfile
    renderApp(profile)
  }
}, 1000) // Check every 1000ms (1s)
