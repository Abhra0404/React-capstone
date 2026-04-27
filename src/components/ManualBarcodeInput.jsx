import { useState } from 'react';

export default function ManualBarcodeInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form className="manual" onSubmit={submit}>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter barcode (e.g. 737628064502)"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
        disabled={disabled}
      />
      <button className="btn btn--primary" type="submit" disabled={disabled || !value.trim()}>
        Look up
      </button>
    </form>
  );
}
