import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from "./constants";
import { normalizeBasket } from "./normalize";
import type {
  ApiError,
  Basket,
  Campaign,
  CampaignSummary,
  Item,
  Merchant,
  Team,
} from "./types";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isGet = !init?.method || init.method === "GET";
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...(typeof window === "undefined" && isGet
      ? { next: { revalidate: 60 } }
      : { cache: isGet ? "default" : "no-store" }),
  });

  if (!res.ok) {
    let body: ApiError = {
      error: "request_failed",
      message: res.statusText,
    };
    try {
      body = await res.json();
    } catch {
      /* empty */
    }
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function getMerchants(): Promise<Merchant[]> {
  return apiFetch("/merchants");
}

export function getMerchant(slug = MERCHANT_SLUG): Promise<Merchant> {
  return apiFetch(`/merchants/${slug}`);
}

export function getItems(slug = MERCHANT_SLUG): Promise<Item[]> {
  return apiFetch(`/merchants/${slug}/items`);
}

export function getItem(itemId: string): Promise<Item> {
  return apiFetch(`/items/${itemId}`);
}

export function getCampaigns(
  slug = MERCHANT_SLUG,
  teamSlug = TEAM_SLUG,
): Promise<CampaignSummary[]> {
  return apiFetch(
    `/merchants/${slug}/campaigns?team_slug=${encodeURIComponent(teamSlug)}`,
  );
}

export function getCampaign(campaignId: string): Promise<Campaign> {
  return apiFetch(`/campaigns/${campaignId}`);
}

export async function getBasket(basketId: string): Promise<Basket> {
  const raw = await apiFetch<unknown>(`/baskets/${basketId}`, {
    cache: "no-store",
  });
  const basket = normalizeBasket(raw);
  if (!basket.id) {
    throw new Error("Invalid basket response from server");
  }
  return basket;
}

export function getTeam(slug = TEAM_SLUG): Promise<Team> {
  return apiFetch(`/teams/${slug}`);
}

export interface CreateBasketInput {
  merchant_id: string;
  items: { item_id: string; qty: number }[];
  team_slug: string;
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
}

export function createBasket(
  input: CreateBasketInput,
): Promise<{ id: string }> {
  return apiFetch("/baskets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface RegisterTeamInput {
  slug: string;
  name: string;
  merchant_id: string;
  contact?: string;
}

export function registerTeam(
  input: RegisterTeamInput,
): Promise<{ slug: string }> {
  return apiFetch("/teams", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface CreateCampaignInput {
  merchant_id: string;
  title: string;
  team_slug: string;
  copy_text?: string;
  image_urls?: string[];
  featured_item_ids?: string[];
}

export function createCampaign(
  input: CreateCampaignInput,
): Promise<{ id: string }> {
  return apiFetch("/campaigns", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/uploads`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as ApiError;
      message = body.message || message;
    } catch {
      /* empty */
    }
    throw new Error(message || "Upload failed");
  }

  const data = (await res.json()) as { url: string };
  if (data.url.startsWith("http")) return data.url;
  return `${API_BASE}${data.url.startsWith("/") ? data.url : `/${data.url}`}`;
}
