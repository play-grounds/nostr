import { h, html, Component, render } from '../js/spux.js'
import '../js/dior.js'

import ReconnectingWebSocket from 'https://cdn.skypack.dev/reconnecting-websocket'

var relay = 'wss://nostr.rocks/'
var relay = 'wss://nostr-pub.wellorder.net/'

const relays = di.data

const rws = []

function testRelay(num) {
  rws[num] = new ReconnectingWebSocket(relays[num].id)
  rws[num].addEventListener('open', () => {
    console.log('connected to', relay)
    relays[num].connected = true
    renderAll()
  })
}

for (let i = 0; i < relays.length; i++) {
  testRelay(i)
}

function renderAll() {
  render(
    html`
      <table>
        <thead>
          <tr>
            <th></th>
            <th>connect</th>
          </tr>
        </thead>

        ${relays.map(relay => {
      return html`
            <tr>
              <td style="text-align: right;"><b>${relay.id}</b></td>
              <td
                style="font-size: 50px; text-align: center; padding: 5px 35px; color: red;"
              >
                <span style="color:${relay.connected ? 'green' : 'red'}"
                  >•</span
                >
              </td>
            </tr>
          `
    })}
      </table>
    `,
    document.body
  )
}

renderAll()
