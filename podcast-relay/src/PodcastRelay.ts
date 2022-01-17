import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

// eslint-disable-next-line import/extensions
import { getHeaders, token } from './util/tokens';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class PodcastRelay extends LitElement {
  @property({ type: String }) backendUrl =
    'https://podcast-relay.herokuapp.com';

  protected createRenderRoot() {
    return this;
  }

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
                ? html`<div class="p-3">
                    <div class="flex justify-between">
                      <h3>Podcast List</h3>
                      <div class="actions flex">
                        <div class="action cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <div
                          class="action cursor-pointer"
                          @click=${this.fetchPodcasts}
                          @keydown=${this.fetchPodcasts}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    ${repeat(
                      this.content,
                      podcast => html`
                        <article class="p-3">
                          <h3>${podcast.title}</h3>
                          <div class="flex">
                            <img
                              class="pr-3"
                              alt="podcast logo"
                              src=${podcast.image_url}
                              style="width:100px;height:100px;"
                            />
                            <small> ${podcast.description} </small>
                          </div>
                          <ul>
                            ${repeat(
                              podcast.episodes,
                              (episode: any) => html`
                                <li>${episode.title}</li>
                              `
                            )}
                          </ul>
                        </article>
                      `
                    )}
                  </div>`
                : html`<div class="logo">
                    <img alt="open-wc logo" src=${logo} />
                  </div>`}
            `}
      </main>
    `;

    return answer;
  }
}
