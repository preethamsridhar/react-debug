import { memo, useMemo, useState } from "react";

function ImageGallery({ items, user, theme, onSelectItem, selectedItems }) {
  const [lightboxItem, setLightboxItem] = useState(null);

  const handlePress = (item) => {
    setLightboxItem(item);
    onSelectItem(item);
  };

  return (
    <div>
      <div className="gallery-hero" role="img" aria-label="Gallery hero">
        <img
          fetchPriority="high"
          src="https://picsum.photos/1200/400?random=hero"
          alt="Gallery hero"
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="gallery-grid">
        {items.map((item) => (
          <GalleryItem
            key={item.id}
            item={item}
            onPress={handlePress}
            isSelected={selectedItems?.some((s) => s.id === item.id)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999999,
          }}
        >
          <img
            loading="lazy"
            src={lightboxItem.url}
            style={{
              maxWidth: "90%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={() => setLightboxItem(null)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

const GalleryItem = memo(({ item, onPress, isSelected }) => {
  console.log("Rendering item:", item);
  return (
    <div
      className="gallery-item"
      onClick={() => onPress(item)}
      style={useMemo(
        () => ({
          outline: isSelected ? "3px solid #4f46e5" : "none",
          outlineOffset: "2px",
        }),
        [isSelected],
      )}
    >
      <img
        srcSet={`${item.thumbnail} 400w
          ${item.url} 800w`}
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        src={item.thumbnail}
        alt={item.name}
      />

      <div style={useMemo(() => ({ padding: "10px 12px" }), [])}>
        <p
          style={useMemo(
            () => ({
              margin: 0,
              fontSize: "13px",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }),
            [],
          )}
        >
          {item.name}
        </p>
        <p
          style={useMemo(
            () => ({ margin: "3px 0 0", fontSize: "12px", color: "#6b7280" }),
            [],
          )}
        >
          {item.type} · {item.status}
        </p>
      </div>
    </div>
  );
});

export default memo(ImageGallery);
