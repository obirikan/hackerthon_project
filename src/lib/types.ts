export interface Merchant {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  brand_colors?: string[];
  whatsapp_number?: string;
}

export interface Item {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  price_minor: number;
  currency: string;
  image_urls: string[];
  in_stock: boolean;
}

export interface BasketItem {
  item_id: string;
  qty: number;
}

export interface BasketLine {
  item_id: string;
  name: string;
  qty: number;
  /** Unit price in minor units (API field: price_minor) */
  price_minor: number;
  line_total_minor: number;
  currency: string;
  image_url?: string;
  in_stock?: boolean;
}

export interface Basket {
  id: string;
  merchant_id: string;
  items: BasketLine[];
  total_minor: number;
  currency: string;
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
  merchant?: Merchant;
}

export interface CampaignSummary {
  id: string;
  title: string;
  copy_text?: string;
  image_urls?: string[];
  featured_item_ids?: string[];
}

export interface Campaign extends CampaignSummary {
  featured_items?: Item[];
}

export interface Team {
  slug: string;
  name: string;
  merchant: Merchant;
  contact?: string;
  registered: boolean;
}

export interface ApiError {
  error: string;
  message: string;
}
