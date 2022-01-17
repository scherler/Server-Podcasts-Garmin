import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

// eslint-disable-next-line import/extensions
import { getHeaders, token } from './util/tokens';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class PodcastRelay extends LitElement {
  @property({ type: String }) backendUrl =
    'https://podcast-relay.herokuapp.com';

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--podcast-relay-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  fetchPodcasts = async () => {
    const headers = getHeaders();
    return fetch(`${this.backendUrl}/podcast`, { headers }).then(resp => {
      if (resp.status === 200) {
        resp.json().then(data => {
          this.content = data;
          console.log('dat', this.content);
        });
      }
    });
  };

  connect(event: any) {
    event.preventDefault();
    const form = this.shadowRoot?.getElementById('form_login');
    if (form) {
      const oData = new FormData(form as HTMLFormElement);
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      const request = new Request(`${this.backendUrl}/connect`, {
        headers,
        method: 'POST',
        body: oData,
      });
      fetch(request).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { token: sessionToken } = data;
            document.cookie = `session=${sessionToken}`;
            this.fetchPodcasts();
          });
        }
      });
    }
  }

  @state()
  private content: any[] | undefined;

  render() {
    if (token !== '' && !this.content) {
      this.fetchPodcasts();
    }
    const answer = html`
      <main>
        ${token === ''
          ? html`<h1>Login</h1>
        <p>
          <label class="error" style="display: none">
              Error in login or password
          </label>
          <form
            @submit=${this.connect}
            enctype="multipart/form-data" method="POST" id="form_login">
              <div class="login">
                  <label for="login">
                      <b>Login</b>
                  </label>
                  <input type="text" placeholder="Enter Username" name="login" required>
              </div>
              <div class="psw">
                  <label for="psw">
                      <b>Password</b>
                  </label>
                  <input type="password" placeholder="Enter Password" name="password" required>
              </div>
              <div>
                  <button type="submit">Connect</button>
              </div>
          </form>
        </p>`
          : html`
              ${this.content
                ? repeat(
                    this.content,
                    podcast => html`
                      <article>
                        <h3>${podcast.title}</h3>
                        <div class="flex justify-center">
                          <img
                            alt="podcast logo"
                            ${podcast.image_url}
                            style="width:100px;height:100px;"
                          />
                          <small> ${podcast.description} </small>
                        </div>
                      </article>
                    `
                  )
                : html`<div class="logo">
                    <img alt="open-wc logo" src=${logo} />
                  </div>`}
            `}
      </main>
    `;

    return answer;
  }
}
