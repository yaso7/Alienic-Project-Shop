const { prisma } = require('./lib/prisma');

async function testConnection() {
  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Test if mysteryBox table exists
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mystery_boxes'`;
    console.log('Mystery boxes table exists:', tables.length > 0);
    
    // Test enum types
    const enums = await prisma.$queryRaw`SELECT typname FROM pg_type WHERE typname = 'bundle_size_enum'`;
    console.log('Bundle size enum exists:', enums.length > 0);
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
