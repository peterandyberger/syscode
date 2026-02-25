const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';
const COUNT = 1000;

const ids = [];

console.log(`Running ${COUNT} iterations...`);
const start = Date.now();

for (let i = 1; i <= COUNT; i++) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `Student ${i}`, email: `load_${i}@test.com` }),
  });
  const student = await res.json();
  ids.push(student.id);

  await fetch(`${BASE_URL}/students/${student.id}/with-address`);

  if (i % 100 === 0) console.log(`  ${i}/${COUNT}`);
}

console.log(`Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
console.log(`Avg per iteration: ${((Date.now() - start) / COUNT).toFixed(1)}ms`);

console.log('Cleaning up...');
for (const id of ids) {
  await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' });
}
