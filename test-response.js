const fetch = require('node:fetch');

async function testResponse() {
  try {
    const response = await fetch('http://localhost:3000/facturas');
    const data = await response.json();
    
    console.log('=== ESTRUCTURA DE LA RESPUESTA ===');
    console.log('Keys en respuesta:', Object.keys(data));
    
    if (data.facturas && data.facturas.length > 0) {
      console.log('\n=== PRIMERA FACTURA ===');
      const firstFactura = data.facturas[0];
      console.log('Keys en factura:', Object.keys(firstFactura));
      
      console.log('\n=== CAMPO _id ===');
      console.log('_id:', firstFactura._id);
      console.log('Tipo de _id:', typeof firstFactura._id);
      
      console.log('\n=== CAMPOS NO DESEADOS ===');
      console.log('Tiene __v?', '__v' in firstFactura);
      console.log('Tiene buffer?', 'buffer' in firstFactura);
      
      if (firstFactura._id && typeof firstFactura._id === 'object') {
        console.log('Propiedades de _id:', Object.keys(firstFactura._id));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testResponse();