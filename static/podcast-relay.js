(function (tslib, lit, decorators_js, repeat_js) {
  'use strict';

  class PodcastRelay extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.backendUrl = '';
          this.token = '';
      }
      createRenderRoot() {
          return this;
      }
      render() {
          return this.token === '' ? lit.html `
    <p @mylogin=${this._loginListener}>
    <podcast-relay-login
    backendUrl=${this.backendUrl}
    ></podcast-relay-login>
  </p>
     ` : lit.html `<podcast-relay-podcasts
     backendUrl=${this.backendUrl}
     token=${this.token}
     ></podcast-relay-podcasts>`;
      }
      _loginListener(e) {
          this.token = e.detail.token;
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelay.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelay.prototype, "token", void 0);

  const getHeaders = (useToken) => {
      var _a, _b, _c;
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Authorization', useToken || ((_c = (_b = (_a = document.cookie) === null || _a === void 0 ? void 0 : _a.split('; ')) === null || _b === void 0 ? void 0 : _b.find(row => row.startsWith('session='))) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || '');
      return headers;
  };

  const fetchPodcasts = async (backendUrl, headers = getHeaders(), callback) => fetch(`${backendUrl}/podcast`, { headers })
      .then(resp => {
      if (resp.status === 200) {
          resp.json().then(callback);
      }
  });
  const fetchPodcast = async (backendUrl, headers = getHeaders(), callback) => fetch(`${backendUrl}/podcast`, { headers })
      .then(resp => {
      if (resp.status === 200) {
          resp.json().then(callback);
      }
  });
  const fetchSearch = async (url, headers = getHeaders(), callback) => fetch(url, { headers })
      .then(resp => {
      if (resp.status === 200) {
          resp.json().then(callback);
      }
  });
  async function postData(url = '', data, token) {
      // Default options are marked with *
      const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
              'Authorization': token
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: data // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
  }
  async function post(url = '', token) {
      // Default options are marked with *
      const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
              'Authorization': token
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      return response.json(); // parses JSON response into native JavaScript objects
  }

  class PodcastRelayPodcastsHeader extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.backendUrl = '';
          this.token = '';
          this.showAdd = true;
          this.toggleAdd = () => {
              this.showAdd = !this.showAdd;
          };
          this.add = (event) => {
              event.preventDefault();
              const form = document.getElementById('form_rss');
              const rss = document.getElementById('rss');
              const data = new FormData(form);
              postData(`${this.backendUrl}/podcast/add`, data, this.token).then(() => {
                  this._dispatchRefetch();
                  rss.value = '';
                  this.toggleAdd();
              });
          };
      }
      createRenderRoot() {
          return this;
      }
      _dispatchRefetch() {
          const options = {
              bubbles: true,
              composed: true
          };
          this.dispatchEvent(new CustomEvent('refetch', options));
      }
      search(event) {
          event.preventDefault();
          const form = document.getElementById('form_search');
          const formDate = new FormData(form);
          const options = {
              detail: {
                  name: formDate.get('search')
              },
              bubbles: true,
              composed: true
          };
          this.dispatchEvent(new CustomEvent('search', options));
      }
      ;
      render() {
          return lit.html `
      <header class="bg-white shadow">
        <div class="mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Podcast List</h1>
          <div class="actions flex items-center">
            ${this.showAdd ? lit.html `<div class="pr-2 flex">
            <form id="form_search" class="flex" @submit=${this.search}>

<button class="pr-2 cursor-pointer hover:text-blue-500" type="submit">
<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <title>Click to search or hit enter on the input box</title>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
</button>
<label for="search" class="sr-only">RSS URL</label>
<input
id="search"
name="search"
type="text"
required
class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
placeholder="Search"
/></form>
              <form id="form_rss" class="flex pl-2" @submit=${this.add}>

                <button class="pr-2 cursor-pointer hover:text-blue-500" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <title>Click to add url or hit enter on the input box</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
</svg>
                </button>
                <label for="rss" class="sr-only">RSS URL</label>
                <input
                id="rss"
                name="rss"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="RSS URL"
                />
              </form>
            </div>` : lit.html ``}
            <div
            @click=${this.toggleAdd}
            @keydown=${this.toggleAdd}
            class="pr-2 action cursor-pointer hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
              <title>Toggle add dialog</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div
              class="action cursor-pointer hover:text-blue-500"
              @click=${this._dispatchRefetch}
              @keydown=${this._dispatchRefetch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
              <title>Refresh listing</title>
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>`;
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcastsHeader.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcastsHeader.prototype, "token", void 0);
  tslib.__decorate([
      decorators_js.state()
  ], PodcastRelayPodcastsHeader.prototype, "showAdd", void 0);

  class PodcastRelayNavigation extends lit.LitElement {
      createRenderRoot() {
          return this;
      }
      render() {
          return lit.html `<nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img
                  class="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                  <a
                    href="#"
                    class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                    aria-current="page"
                    >Podcast List</a
                  >
                </div>
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button
                type="button"
                class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <!--
              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
                <svg
                  class="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <!--
              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
                <svg
                  class="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="md:hidden" id="mobile-menu">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a
              href="#"
              class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
              >Podcast List</a
            >
          </div>
        </div>
      </nav>`;
      }
  }

  class PodcastRelayLogin extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.backendUrl = '';
      }
      createRenderRoot() {
          return this;
      }
      connect(event) {
          event.preventDefault();
          const form = document.getElementById('form_login');
          if (form) {
              const oData = new FormData(form);
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
                          headers.append('Authorization', sessionToken);
                          document.cookie = `session=${sessionToken}; path=/; max-age=3600`;
                          this._dispatchLogin(sessionToken);
                      });
                  }
              });
          }
      }
      render() {
          return lit.html ` <main
    class="relative z-10  text-sm text-center text-gray-600 py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form
      @submit=${this.connect}
          enctype="multipart/form-data"
          method="POST"
          id="form_login"
      class="mt-8 space-y-6" action="#">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              name="login"
              required
              id="email-address" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
    </main>`;
      }
      _dispatchLogin(token) {
          if (token) {
              const options = {
                  detail: { token },
                  bubbles: true,
                  composed: true
              };
              this.dispatchEvent(new CustomEvent('mylogin', options));
          }
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayLogin.prototype, "backendUrl", void 0);

  const logo = new URL('../../assets/open-wc-logo.svg', (document.currentScript && document.currentScript.src || new URL('podcast-relay.js', document.baseURI).href)).href;
  class PodcastRelayPodcasts extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.backendUrl = '';
          this.token = '';
          this.search = (name) => {
              console.log('search', name);
              fetchSearch(`${this.backendUrl}/search?name=${name}`, getHeaders(this.token), data => {
                  console.log(data);
              });
          };
          this.fetchPods = (headers = getHeaders()) => {
              fetchPodcasts(this.backendUrl, headers, data => {
                  this.content = data.sort((a, b) => a.id + b.id);
                  console.log('dat', this.content);
              });
          };
      }
      createRenderRoot() {
          return this;
      }
      render() {
          if (this.token !== '' && !this.content) {
              this.fetchPods(getHeaders(this.token));
          }
          return lit.html `
    <podcast-relay-navigation></podcast-relay-navigation>

      <podcast-relay-header
      @search=${this.searchListener}
      @refetch=${this._listener}
      backendUrl=${this.backendUrl}
      token=${this.token}
      ></podcast-relay-header>
      <main class="dark:bg-slate-800 bg-slate-800 ">
        ${this.content
            ? lit.html `<div px-5>
  ${repeat_js.repeat(this.content, podcast => lit.html `<podcast-relay-podcast
      @refetch=${this._listener}
      backendUrl=${this.backendUrl}
      token=${this.token}
      podcastJson=${encodeURIComponent(JSON.stringify(podcast))}
    ></podcast-relay-podcast>`)}
        </div>
      </main>`
            : lit.html `<div class="logo">
              <img alt="open-wc logo" src=${logo} />
            </div>`}
      </main> `;
      }
      _listener() {
          this.fetchPods(getHeaders(this.token));
      }
      searchListener(event) {
          const { name } = event.detail;
          console.log(name);
          this.search(name);
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcasts.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcasts.prototype, "token", void 0);
  tslib.__decorate([
      decorators_js.state()
  ], PodcastRelayPodcasts.prototype, "content", void 0);

  class PodcastRelayPodcast extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.podcastJson = '{}';
          this.backendUrl = '';
          this.token = '';
          this.showEpisodes = true;
          this.podcast = {};
          this.toggleEpisodes = () => {
              this.showEpisodes = !this.showEpisodes;
          };
          this.fetchPod = async (headers = getHeaders()) => {
              fetchPodcast(`${this.backendUrl}/podcast/${this.podcast.id}?refresh=true`, headers, (data) => {
                  this.podcastJson = JSON.stringify(data);
              });
          };
      }
      createRenderRoot() {
          return this;
      }
      render() {
          this.podcast = JSON.parse(decodeURIComponent(this.podcastJson));
          const { podcast } = this;
          const episodes = podcast.episodes.sort((a, b) => a.id + b.id);
          return lit.html ` <div class=" shadow-md border-3 border-black-400 rounded-xl">
    <figure class="md:flex">
      <img class="pl-5 w-24 h-24 md:w-48 md:h-48 my-auto md:rounded-none rounded-full mx-auto" src=${podcast.image_url || podcast.image}
        alt="podcast logo" width="384" height="512">
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <figcaption class="flex justify-between font-medium">
          <div>
            <div class="text-sky-500 dark:text-sky-400">
              ${podcast.title}
            </div>
            <div class="text-slate-700 dark:text-slate-500">
              ${podcast.publisher}
            </div>
          </div>
          <div class="relative inline-block text-left">
            <podcast-dropdown @refetchpod=${this._listener} podcast=${podcast.id} backendUrl=${this.backendUrl}
              token=${this.token}></podcast-dropdown>
          </div>
        </figcaption>
        <blockquote class="hidden md:block">
          <p class="text-lg font-medium">${podcast.description} </p>
        </blockquote>
      </div>
    </figure>
    <ul class="flex justify-between pl-4">
      <li class="p-2 border-3 cursor-pointer border-indigo-500 rounded-lg" @click=${this.toggleEpisodes}
        @keydown=${this.toggleEpisodes}>Episodes</li>
    </ul>
    ${this.showEpisodes ? lit.html `
    <ul class="pl-1">
      ${repeat_js.repeat(episodes, (episode) => lit.html `<podcast-relay-podcasts-row @refetchpod=${this._listener} token=${this.token}
        backendUrl=${this.backendUrl} episodeJson=${JSON.stringify(episode)}></podcast-relay-podcasts-row>`)}
    </ul> ` : lit.html ``}
  </div>`;
      }
      // eslint-disable-next-line class-methods-use-this
      _listener() {
          this.fetchPod(getHeaders(this.token));
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcast.prototype, "podcastJson", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcast.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcast.prototype, "token", void 0);
  tslib.__decorate([
      decorators_js.state()
  ], PodcastRelayPodcast.prototype, "showEpisodes", void 0);
  tslib.__decorate([
      decorators_js.state()
  ], PodcastRelayPodcast.prototype, "podcast", void 0);

  class PodcastRelayPodcastsRow extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.episodeJson = '';
          this.backendUrl = '';
          this.token = '';
          this.sync = (id, url) => {
              const data = new FormData();
              data.append('ids', id);
              postData(`${this.backendUrl}/${url}`, data, this.token).then(() => {
                  this._dispatchRefetch();
              });
          };
          this.setSync = (id) => {
              this.sync(id, 'episode/sync_watch');
          };
          this.setUnSync = (id) => {
              this.sync(id, 'episode/not_sync_watch');
          };
          this.showEpisodes = false;
          this.toggleEpisodes = () => {
              this.showEpisodes = !this.showEpisodes;
          };
      }
      createRenderRoot() {
          return this;
      }
      render() {
          const episode = JSON.parse(this.episodeJson);
          return lit.html ` <li class="border-3 shadow-xl border-black bg-grey m-5 px-2">${episode.title}

<div class="flex items-center justify-between">
<div class="flex items-center py-2">
<div class="pr-2 cursor-pointer hover:text-blue-500"
@click=${this.toggleEpisodes}
@keydown=${this.toggleEpisodes}>
${this.showEpisodes ? lit.html `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<title>Hide descriptions</title>
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>` : lit.html `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<title>Show descriptions</title>
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
</svg>`}
</div>
        <audio controls preload="none" id=${episode.id}>
                        <source src=${episode.audio_url} type="audio/mp3"/>
                        Your browser dose not Support the audio Tag
                    </audio>
  </div>
  <div class="flex">
                      <div class="cursor-pointer hover:text-blue-500">
                        ${episode.sync_watch > 0 ? lit.html `<svg
                        @click=${() => this.sync(episode.id, 'episode/not_sync_watch')}
@keydown=${() => this.sync(episode.id, 'episode/not_sync_watch')}
                        xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <title>Remove from sync to device</title>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
</svg>` : lit.html `<svg
@click=${() => this.sync(episode.id, 'episode/sync_watch')}
@keydown=${() => this.sync(episode.id, 'episode/sync_watch')}
xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <title>Sync to device</title>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
</svg>`}
                      </div>
                      <div class="pl-3 cursor-pointer hover:text-blue-500">
                       ${episode.readed > 0 ? lit.html `<svg
@click=${() => this.sync(episode.id, 'episode/not_readed')}
@keydown=${() => this.sync(episode.id, 'episode/not_readed')}
                       xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Mark as unread</title>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>` : lit.html `<svg
@click=${() => this.sync(episode.id, 'episode/readed')}
@keydown=${() => this.sync(episode.id, 'episode/readed')}
xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<title>Mark as read</title>
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
</svg>`}
                      </div>
                      <div class="pl-3 cursor-pointer hover:text-blue-500 ">
                       ${episode.queue > -1 ? lit.html `<svg
@click=${() => this.sync(episode.id, 'episode/remove_from_queue')}
@keydown=${() => this.sync(episode.id, 'episode/remove_from_queue')}
                       xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Remove from queue</title>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>` : lit.html `<svg
@click=${() => this.sync(episode.id, 'episode/queue')}
@keydown=${() => this.sync(episode.id, 'episode/queue')}
xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<title>Add to queue</title>
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>`}
                      </div>
                    </div>
            </div>
            ${this.showEpisodes ? lit.html `<p>${episode.description}</p>` : lit.html ``}
        </li> `;
      }
      _dispatchRefetch() {
          const options = {
              bubbles: true,
              composed: true
          };
          this.dispatchEvent(new CustomEvent('refetchpod', options));
      }
  }
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcastsRow.prototype, "episodeJson", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcastsRow.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], PodcastRelayPodcastsRow.prototype, "token", void 0);
  tslib.__decorate([
      decorators_js.state()
  ], PodcastRelayPodcastsRow.prototype, "showEpisodes", void 0);

  class Dropdown extends lit.LitElement {
      constructor() {
          super(...arguments);
          this.showMenu = false;
          this.backendUrl = '';
          this.podcast = '';
          this.token = '';
          this.toggle = () => {
              this.showMenu = !this.showMenu;
          };
          this.removeEpisode = () => {
              post(`${this.backendUrl}/podcast/${this.podcast}/remove`, this.token).then(() => {
                  this._dispatchRefetch();
              });
          };
      }
      createRenderRoot() {
          return this;
      }
      render() {
          return lit.html `
    <svg
    class="h-6 w-6 cursor-pointer hover:text-blue-500"
    @click=${this.toggle}
    @keydown=${this.toggle}
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
</svg>


  <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
  ${this.showMenu ? lit.html `<div class="transform opacity-100 scale-100 transition ease-out duration-100 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
    <div @click=${this._dispatchRefetchPod}  class="py-1 flex items-center px-4  cursor-pointer hover:text-blue-500" role="none">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
</svg>
      <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
      <span class="text-gray-700 block text-sm pl-2" role="menuitem" tabindex="-1" id="menu-item-0">Refresh podcast</span>
    </div>
    <div @click=${this.removeEpisode} class="py-1 flex items-center px-4  cursor-pointer hover:text-blue-500" role="none">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>
      <span class="text-gray-700 block pl-2 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Delete podcast</span>
    </div>
  </div>
</div>` : lit.html ``}`;
      }
      _dispatchRefetchPod() {
          const options = {
              bubbles: true,
              composed: true
          };
          this.toggle();
          this.dispatchEvent(new CustomEvent('refetchpod', options));
      }
      _dispatchRefetch() {
          const options = {
              bubbles: true,
              composed: true
          };
          this.toggle();
          this.dispatchEvent(new CustomEvent('refetch', options));
      }
  }
  tslib.__decorate([
      decorators_js.state()
  ], Dropdown.prototype, "showMenu", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], Dropdown.prototype, "backendUrl", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], Dropdown.prototype, "podcast", void 0);
  tslib.__decorate([
      decorators_js.property({ type: String })
  ], Dropdown.prototype, "token", void 0);

  customElements.define('podcast-relay', PodcastRelay);
  customElements.define('podcast-relay-header', PodcastRelayPodcastsHeader);
  customElements.define('podcast-relay-navigation', PodcastRelayNavigation);
  customElements.define('podcast-relay-login', PodcastRelayLogin);
  customElements.define('podcast-relay-podcasts', PodcastRelayPodcasts);
  customElements.define('podcast-relay-podcast', PodcastRelayPodcast);
  customElements.define('podcast-relay-podcasts-row', PodcastRelayPodcastsRow);
  customElements.define('podcast-dropdown', Dropdown);

})(tslib, lit, decorators_js, repeat_js);
