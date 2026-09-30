// src/utils/payoutFiles.js
// Payout files for She Model Tech paid projects: one upload pays everyone.
//  - PayPal Payouts (Business Tools > Make Payments > Payouts): no header row;
//    columns: email, amount, currency, reference ID, note, wallet (PAYPAL).
//  - Wise Business batch ("Send by email" template): recipients get a secure
//    Wise link to add their own bank details. Amounts are exact for the
//    recipient (amountCurrency "target").
// Only people who chose that method (with a payout email) are included.

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const amountOf = (e) => Number(e.amountPaid ?? e.amountDue ?? 0);

// entries: [[email, confirmationEntry]], payouts: { email: { method, email, country } }
export const buildPayoutFiles = (project, entries, payouts) => {
  const ref = (i) => `SMT-${String(project.id).slice(0, 6)}-${i + 1}`;
  const note = `She Model Tech: ${project.projectTitle || 'paid project'}`.slice(0, 120);
  const currency = project.payCurrency || 'USD';
  const due = entries.filter(([, e]) => e.status !== 'confirmed' && amountOf(e) > 0);
  const paypal = [];
  const wise = [];
  const manual = [];
  due.forEach(([memberEmail, e], i) => {
    const p = payouts[memberEmail];
    const to = p?.email;
    if (p?.method === 'PayPal' && to) paypal.push([to, amountOf(e).toFixed(2), currency, ref(i), note, 'PAYPAL']);
    else if (p?.method === 'Wise' && to) wise.push([e.memberName || memberEmail, to, ref(i), 'PRIVATE', 'target', amountOf(e).toFixed(2), currency, currency]);
    else manual.push({ name: e.memberName || memberEmail, email: memberEmail, amount: amountOf(e), method: p?.method || 'not given yet' });
  });
  const paypalCsv = paypal.map((r) => r.map(csvCell).join(',')).join('\n');
  const wiseCsv = [['name', 'recipientEmail', 'paymentReference', 'receiverType', 'amountCurrency', 'amount', 'sourceCurrency', 'targetCurrency'], ...wise]
    .map((r) => r.map(csvCell).join(',')).join('\n');
  const total = (rows, col) => rows.reduce((n, r) => n + Number(r[col]), 0);
  return {
    paypal: { rows: paypal.length, total: total(paypal, 1), csv: paypalCsv },
    wise: { rows: wise.length, total: total(wise, 5), csv: wiseCsv },
    manual,
  };
};

export const downloadCsv = (filename, text) => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
