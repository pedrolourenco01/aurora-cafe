import https from 'https';

https.get('https://vancelib.vercel.app/components-registry.json', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Total components:', data.length);
      const s33 = data.filter(c => 
        (c.category && c.category.toLowerCase().includes('scroll') && (c.title.includes('33') || c.id == 33 || c.number == 33)) ||
        (c.title && c.title.toLowerCase().includes('33'))
      );
      console.log('Scroll 33 found:', JSON.stringify(s33, null, 2));

      // If not found, list all Scroll Animation items
      if (s33.length === 0) {
        const scrollItems = data.filter(c => c.category && c.category.toLowerCase().includes('scroll'));
        console.log('Scroll items count:', scrollItems.length);
        console.log('First 10 scroll items:', scrollItems.slice(0, 10).map(c => ({ id: c.id, title: c.title, category: c.category, zipUrl: c.zipUrl })));
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Body start:', body.slice(0, 200));
    }
  });
});
