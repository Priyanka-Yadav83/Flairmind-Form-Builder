import React, { useState } from 'react';

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className="border rounded p-3" aria-labelledby={title}>
      <header className="flex items-center justify-between">
        <h3 id={title} className="font-semibold">{title}</h3>
        <button type="button" onClick={() => setOpen((s) => !s)} aria-expanded={open} className="text-sm underline">
          {open ? 'Collapse' : 'Expand'}
        </button>
      </header>
      <div className={`mt-3 ${open ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  );
};

export default Section;
