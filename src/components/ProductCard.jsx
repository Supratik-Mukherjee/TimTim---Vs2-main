import React from 'react';
import useStorageUrl from '../hooks/useStorageUrl';

export default function ProductCard({ p, onClick, onQuickAdd, formatPrice }) {
  const resolvedUrl = useStorageUrl(p.imageUrl);
  
  return (
    <div className="prod-card reveal in" onClick={onClick}>
      <div className="prod-thumb">
        {p.badges && p.badges.map(b => (
          <span className={`prod-badge ${b}`} key={b}>
            {b === 'sale' ? 'Sale' : b === 'new' ? 'New' : 'Popular'}
          </span>
        ))}
        <div
          className={`prod-thumb-inner ${resolvedUrl || p.imageUrl ? '' : (p.bg || 'c-wax')}`}
          style={resolvedUrl ? { backgroundImage: `url('${resolvedUrl}')`, backgroundSize: 'cover' } : {}}
        >
          {!resolvedUrl && !p.imageUrl && (p.emoji || '📦')}
        </div>
        <button 
          className="quick-add" 
          aria-label="Add to cart" 
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(e);
          }}
        >
          +
        </button>
      </div>
      <div className="prod-body">
        <p className="prod-cat">{p.cat}</p>
        <h3 className="prod-name">{p.shortName || p.name}</h3>
        <div className="prod-prices">
          <span className="prod-price">
            {p.weightTiers && p.weightTiers.length > 0 
              ? `from ${formatPrice(p.price)}` 
              : formatPrice(p.price)}
          </span>
          {p.originalPrice && <span className="prod-orig">{formatPrice(p.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
}
