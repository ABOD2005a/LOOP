const bcrypt = require('bcryptjs');

async function testPasswords() {
  console.log('Testing bcrypt password hashing...\n');
  
  // Test 1: test@gmail.com / test1234
  const hash1 = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const password1 = 'test1234';
  const result1 = await bcrypt.compare(password1, hash1);
  console.log('Test 1: test@gmail.com');
  console.log(`Password: ${password1}`);
  console.log(`Hash: ${hash1}`);
  console.log(`Match: ${result1}`);
  console.log('---\n');
  
  // Test 2: admin@example.com / admin123
  const hash2 = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const password2 = 'admin123';
  const result2 = await bcrypt.compare(password2, hash2);
  console.log('Test 2: admin@example.com');
  console.log(`Password: ${password2}`);
  console.log(`Hash: ${hash2}`);
  console.log(`Match: ${result2}`);
  console.log('---\n');
  
  // Generate fresh hashes
  console.log('Generating FRESH hashes for your database:\n');
  
  const freshHash1 = await bcrypt.hash('test1234', 10);
  console.log('For test@gmail.com with password test1234:');
  console.log(`UPDATE admin SET password = '${freshHash1}' WHERE gmail = 'test@gmail.com';\n`);
  
  const freshHash2 = await bcrypt.hash('admin123', 10);
  console.log('For admin@example.com with password admin123:');
  console.log(`UPDATE admin SET password = '${freshHash2}' WHERE gmail = 'admin@example.com';\n`);
}

testPasswords().catch(console.error);