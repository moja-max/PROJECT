import User from './models/User.js';
import Building from './models/Building.js';
import Inspection from './models/Inspection.js';

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Building.deleteMany({});
    await Inspection.deleteMany({});

    // Create sample users
    const admin = await User.create({
      fullName: 'Mwita Amani',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      department: 'Dar es Salaam Antiquities Dept.',
    });

    const inspector1 = await User.create({
      fullName: 'John Kimaro',
      email: 'inspector1@example.com',
      password: 'password',
      role: 'inspector',
      department: 'Dar es Salaam Antiquities Dept.',
    });

    const officer1 = await User.create({
      fullName: 'Ahmed Mbwana',
      email: 'officer1@example.com',
      password: 'password',
      role: 'officer',
      department: 'Dar es Salaam Antiquities Dept.',
    });

    // Create sample buildings
    const buildings = await Building.create([
      {
        registrationNumber: 'DSM-HB-001',
        name: 'Livingstone House',
        location: 'Stone Town, Plot 14A',
        historicalStyle: 'Colonial Gothic',
        yearBuilt: 1885,
        compositeScore: 1.3,
        status: 'critical',
        lastInspected: new Date('2026-04-28'),
      },
      {
        registrationNumber: 'DSM-HB-002',
        name: 'Old Customs House',
        location: 'Harbour Front, B-07',
        historicalStyle: 'Neo-Classical',
        yearBuilt: 1890,
        compositeScore: 1.8,
        status: 'critical',
        lastInspected: new Date('2026-04-25'),
      },
      {
        registrationNumber: 'DSM-HB-003',
        name: 'Azania Front Church',
        location: 'Ocean Road, C-02',
        historicalStyle: 'Gothic Revival',
        yearBuilt: 1895,
        compositeScore: 2.2,
        status: 'poor',
        lastInspected: new Date('2026-04-20'),
      },
      {
        registrationNumber: 'DSM-HB-004',
        name: 'Old Boma',
        location: 'Kivukoni, A-01',
        historicalStyle: 'Swahili-German',
        yearBuilt: 1888,
        compositeScore: 2.5,
        status: 'fair',
        lastInspected: new Date('2026-04-15'),
      },
      {
        registrationNumber: 'DSM-HB-005',
        name: 'Aga Khan Mosque',
        location: 'Mosque Street, D-09',
        historicalStyle: 'Indo-Islamic',
        yearBuilt: 1880,
        compositeScore: 3.6,
        status: 'good',
        lastInspected: new Date('2026-04-10'),
      },
      {
        registrationNumber: 'DSM-HB-006',
        name: 'State House Annex',
        location: 'Msasani Hill, E-04',
        historicalStyle: 'Colonial',
        yearBuilt: 1900,
        compositeScore: 3.9,
        status: 'good',
        lastInspected: new Date('2026-03-28'),
      },
      {
        registrationNumber: 'DSM-HB-007',
        name: 'Ismaili Centre',
        location: 'Upanga Road, F-12',
        historicalStyle: 'Modernist',
        yearBuilt: 1920,
        compositeScore: 4.2,
        status: 'excellent',
        lastInspected: new Date('2026-03-15'),
      },
    ]);

    // Create sample inspections
    await Inspection.create([
      {
        building: buildings[0]._id,
        inspector: inspector1._id,
        inspectionDate: new Date('2026-04-28'),
        elementRatings: {
          roof: 1,
          walls: 1,
          windows: 2,
          foundation: 1,
          interior: 1,
          services: 2,
        },
        compositeScore: 1.3,
        weatherConditions: 'Clear / Dry',
        generalNotes: 'Critical structural damage observed. Immediate attention required.',
        status: 'submitted',
      },
      {
        building: buildings[1]._id,
        inspector: inspector1._id,
        inspectionDate: new Date('2026-04-25'),
        elementRatings: {
          roof: 2,
          walls: 2,
          windows: 2,
          foundation: 1,
          interior: 2,
          services: 2,
        },
        compositeScore: 1.8,
        weatherConditions: 'Clear / Dry',
        generalNotes: 'Severe deterioration of foundation. Immediate action required.',
        status: 'submitted',
      },
    ]);

    console.log('✓ Database seeded successfully!');
    console.log('Demo user: admin@example.com / password');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;
