import React, { useMemo } from 'react';

function Vendor({ name, href }) {
  return (
    <a className="vendor" href={href} target="_blank" rel="noreferrer">
      <span className="vendor-mark">{name.slice(0, 1)}</span>
      <span className="vendor-name">{name}</span>
    </a>
  );
}

export default function VendorRow({ vendors }) {
  const data = useMemo(
    () =>
      vendors ?? [
        { name: 'Microsoft', href: 'https://www.microsoft.com/' },
        { name: 'Fortinet', href: 'https://www.fortinet.com/' },
        { name: 'Sophos', href: 'https://www.sophos.com/' },
        { name: 'Veeam', href: 'https://www.veeam.com/' },
        { name: 'Apple', href: 'https://www.apple.com/' },
        { name: 'Cloudflare', href: 'https://www.cloudflare.com/' },
      ],
    [vendors]
  );

  return (
    <div className="vendor-row" aria-label="Technology partners">
      {data.map((v) => (
        <Vendor key={v.name} name={v.name} href={v.href} />
      ))}
    </div>
  );
}

