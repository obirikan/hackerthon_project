"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createCampaign, getItems, uploadImage } from "@/lib/api";
import { MERCHANT_SLUG, TEAM_SLUG } from "@/lib/constants";
import { getErrorMessage, resolveImageUrl } from "@/lib/format";
import type { Item } from "@/lib/types";

export function CampaignCreateForm() {
  const [title, setTitle] = useState("");
  const [copyText, setCopyText] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  }, []);

  function toggleFeatured(itemId: string) {
    setFeaturedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const full = trimmed.startsWith("http")
      ? trimmed
      : `${process.env.NEXT_PUBLIC_API_BASE ?? "https://api-hackathon.codedematrixtech.com"}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
    if (!imageUrls.includes(full)) setImageUrls((prev) => [...prev, full]);
    setUrlInput("");
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(getErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { id } = await createCampaign({
        merchant_id: MERCHANT_SLUG,
        title: title.trim(),
        team_slug: TEAM_SLUG,
        copy_text: copyText.trim() || undefined,
        image_urls: imageUrls.length ? imageUrls : undefined,
        featured_item_ids: featuredIds.length ? featuredIds : undefined,
      });
      setCreatedId(id);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create campaign"));
    } finally {
      setSubmitting(false);
    }
  }

  if (createdId) {
    return (
      <div className="mx-auto max-w-lg border border-brand-silver/20 p-8 text-center">
        <p className="section-label mb-4">Published</p>
        <h2 className="font-display text-3xl text-brand-cream">Campaign live</h2>
        <p className="mt-4 text-sm text-brand-silver/60">
          ID: <span className="font-mono text-brand-silver">{createdId}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/campaigns/${createdId}`} className="btn-primary">
            View campaign
          </Link>
          <Link href="/campaigns" className="btn-ghost">
            All campaigns
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreatedId(null);
            setTitle("");
            setCopyText("");
            setImageUrls([]);
            setFeaturedIds([]);
          }}
          className="mt-6 text-[11px] uppercase tracking-widest text-brand-silver/50 hover:text-brand-silver"
        >
          Create another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">
      <div>
        <label htmlFor="title" className="section-label mb-2 block">
          Title *
        </label>
        <input
          id="title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Summer tailoring edit"
          required
        />
      </div>

      <div>
        <label htmlFor="copy" className="section-label mb-2 block">
          Copy
        </label>
        <textarea
          id="copy"
          className="input-field min-h-[120px] resize-y"
          value={copyText}
          onChange={(e) => setCopyText(e.target.value)}
          placeholder="Campaign description for shoppers…"
        />
      </div>

      <div>
        <p className="section-label mb-4">Images</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="btn-ghost cursor-pointer text-center sm:flex-1">
            {uploading ? "Uploading…" : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            className="input-field flex-1"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste image URL / path"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <button type="button" onClick={addUrl} className="btn-ghost shrink-0 px-4">
            Add
          </button>
        </div>
        {imageUrls.length > 0 && (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {imageUrls.map((url) => (
              <li key={url} className="group relative aspect-[4/3] bg-brand-navy-light">
                <Image
                  src={resolveImageUrl(url)}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((u) => u !== url))
                  }
                  className="absolute right-1 top-1 bg-brand-navy/90 px-2 py-0.5 text-[10px] uppercase text-brand-silver hover:text-brand-cream"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="section-label mb-4">Featured products</p>
        {loadingItems ? (
          <p className="text-sm text-brand-silver/50">Loading inventory…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-brand-silver/50">No products available.</p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto border border-brand-silver/15 p-4">
            {items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={featuredIds.includes(item.id)}
                    onChange={() => toggleFeatured(item.id)}
                    className="accent-brand-silver"
                  />
                  <span className="flex-1 text-brand-cream">{item.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-silver/40">
                    {item.in_stock ? "In stock" : "Sold out"}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-brand-silver/15 pt-6 text-xs text-brand-silver/40">
        <p>Merchant: {MERCHANT_SLUG}</p>
        <p>Team slug: {TEAM_SLUG}</p>
      </div>

      {error && (
        <p className="text-sm text-red-300/90" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="btn-primary w-full"
      >
        {submitting ? "Publishing…" : "Publish campaign"}
      </button>
    </form>
  );
}
