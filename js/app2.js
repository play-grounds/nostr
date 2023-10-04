import { html, render } from '../js/standalone.module.js'
import Navbar from '../js/navbar2.js'

const links = [
  {
    '@id':
      'https://github.com/ursuscamp/nomen/blob/master/docs/SPEC.md',
    label: 'Profile'
  }
]
let profile = localStorage.currentUserProfile

if (profile) {
  profile = JSON.parse(profile)
}

render(html`<${Navbar} links=${links} />


<pre>
 ${JSON.stringify(profile, null, 2)}
</pre>

`, document.body)
