import { useEffect, useState } from 'react';
import { simulateFetch, ASSETS_BY_TENANT } from '../data/mockData';

// BUG: Child component fetches data on its own — causes a waterfall:
//   parent renders → child mounts → child fetches → content appears
// This should be lifted to the parent and passed as props (or prefetched).
// BUG: No AbortController — switching tenants leaves an in-flight fetch
//   that will call setAssets on an unmounted/different-tenant component.
// BUG: Images rendered without loading="lazy", width, or height —
//   all images eagerly loaded, no dimension hints for the browser,
//   causing cumulative layout shift.
export default function AssetGallery({ tenantId }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    simulateFetch(ASSETS_BY_TENANT[tenantId] ?? [], 700).then((data) => {
      setAssets(data);
      setLoading(false);
    });
  }, [tenantId]);

  if (loading) return <div className="gallery-loading"><span className="spinner" />Loading assets…</div>;

  return (
    <div className="asset-gallery">
      {assets.map((asset) => (
        <div key={asset.id} className="asset-card">
          <img src={asset.url} alt={asset.label} className="asset-img" />
          <div className="asset-meta">
            <span className="asset-label">{asset.label}</span>
            <span className="asset-size">{asset.size} KB</span>
          </div>
        </div>
      ))}
      {assets.length === 0 && <p className="empty-state">No assets for this tenant.</p>}
    </div>
  );
}
