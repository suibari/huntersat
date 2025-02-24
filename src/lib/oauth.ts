import { PUBLIC_NODE_ENV, PUBLIC_URL } from '$env/static/public';
import { browser } from '$app/environment';
import { BrowserOAuthClient, OAuthSession } from '@atproto/oauth-client-browser';
import { openDB } from 'idb';
import { Agent } from '@atproto/api';

const url = PUBLIC_URL || `http://127.0.0.1:5173`;
const enc = encodeURIComponent;

class OAuthManager {
  private client: BrowserOAuthClient | null = null;
  private session: OAuthSession | null = null;
  private agent: Agent | null = null;

  get currentSession(): OAuthSession | null {
    return this.session;
  }

  get currentAgent(): Agent | null {
    return this.agent;
  }

  async init(provider?: string): Promise<void> {
    if (!browser || this.client !== null) return;

    this.client = new BrowserOAuthClient({
      handleResolver: provider || "https://bsky.social",
      clientMetadata: {
        client_id:
          PUBLIC_NODE_ENV === "production" ? `${url}/client-metadata.json` :
          PUBLIC_NODE_ENV === "preview" ? `${url}/client-metadata-preview.json` :
          `http://localhost?redirect_uri=${enc(`${url}/api/callback`)}&scope=${enc('atproto transition:generic')}`,
        redirect_uris: [`${url}/api/callback`],
        scope: "atproto transition:generic",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        dpop_bound_access_tokens: true,
      },
    });

    try {
      const row = await this.getFromIndexedDB();
      if (row?.did) {
        this.session = await this.client.restore(row.did, false);
        this.agent = new Agent(this.session);
        console.log(`[INFO] OAuth client refleshed`);
      } else {
        // 未ログイン
        await this.client.init();
        console.log(`[INFO] OAuth client initialized`);
      }
    } catch (error) {
      await this.client.init();
      console.error("OAuth client initialization failed:", error);
    }
  }

  async login(provider: string, handle: string): Promise<void> {
    if (!browser) return;

    const pbd = provider || "https://bsky.social";

    try {
      localStorage.setItem('provider', pbd);
      await this.init(pbd);
      if (this.client) {
        const authUrl = await this.client.signIn(handle, { prompt: 'login', ui_locales: 'ja-JP' });
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error(`failed to log-in: ${error}`);
    }
  }

  async logout(did: string): Promise<void> {
    if (!browser) return;

    try {
      await this.client?.revoke(did);

      // 外部DBを使う場合ここでdelete
      console.log(`[INFO] successful log-out`);
    } catch (error) {
      console.error(`failed to log-out: ${error}`);
    }
  }

  async handleCallback(): Promise<void> {
    if (!browser) return;

    // state取得
    const param = new URLSearchParams(window.location.hash);
    localStorage.setItem('oauth_state', param.get('state') || "");

    const row = await this.getFromIndexedDB();
    if (row) {
      const { expiresAt, did } = row;
      if (did && this.client) {
        this.session = await this.client.restore(did);

        // 外部DBを使う場合ここでinsert
      }
    }
  }

  private async getFromIndexedDB(): Promise<{expiresAt: string | null, did: string | null} | null> {
    const result = {
      did: null,
      expiresAt: null,
    };

    const handle = localStorage.getItem('handle');
    // const state = localStorage.getItem('oauth_state');

    try {
      const db = await openDB('@atproto-oauth-client', 1);

      // did
      const storeDid = db.transaction('handleCache', 'readonly').objectStore('handleCache');
      if (handle) {
        const row = await storeDid.get(handle);
        result.did = row.value;
        result.expiresAt = row.expireAt;
      }

      // state expireAt
      // const storeState = db.transaction('state', 'readonly').objectStore('state');
      // if (state) {
      //   const row = await storeState.get(state);
      //   result.expiresAt = row.expiresAt;
      // }

      return result;
    } catch (error) {
      console.error('Failed to retrieve DID from IndexedDB:', error);
      return null;
    }
  }
}

export const oauthManager = new OAuthManager();
