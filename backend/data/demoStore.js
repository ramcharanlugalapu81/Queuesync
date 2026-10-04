export const demoServices = [
  { id: 1, name: 'Academic Certificates', category: 'Registrar office', description: 'Request transcripts, enrollment letters, and degree certificates.', location: 'Central Registrar · Window 04', prefix: 'A', icon: 'school', averageServiceMinutes: 4, isOpen: true, sortOrder: 1 },
  { id: 2, name: 'Hardware & Maker Lab', category: 'Engineering bay', description: 'Reserve lab equipment and get help with workshop access.', location: 'Innovation Hub · Desk 2', prefix: 'M', icon: 'precision_manufacturing', averageServiceMinutes: 3, isOpen: true, sortOrder: 2 },
  { id: 3, name: 'Financial Aid & Bursar', category: 'Bursar division', description: 'Questions about tuition payments, aid, and scholarships.', location: 'Student Centre · Floor 1', prefix: 'F', icon: 'account_balance', averageServiceMinutes: 7, isOpen: true, sortOrder: 3 },
  { id: 4, name: 'Campus Health Clinic', category: 'Wellness pavilion', description: 'Check in for student health and wellness appointments.', location: 'Wellness Pavilion · Reception', prefix: 'H', icon: 'medical_services', averageServiceMinutes: 5, isOpen: true, sortOrder: 4 },
];

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

export const demoTokens = [
  { id: 1, serviceId: 1, ticketCode: 'A-104', studentName: 'Student A', campusId: 'DEMO-104', phone: null, status: 'called', joinedAt: minutesAgo(18), calledAt: minutesAgo(2), completedAt: null },
  { id: 2, serviceId: 1, ticketCode: 'A-105', studentName: 'Student B', campusId: 'DEMO-105', phone: null, status: 'waiting', joinedAt: minutesAgo(12), calledAt: null, completedAt: null },
  { id: 3, serviceId: 1, ticketCode: 'A-106', studentName: 'Student C', campusId: 'DEMO-106', phone: null, status: 'waiting', joinedAt: minutesAgo(7), calledAt: null, completedAt: null },
  { id: 4, serviceId: 2, ticketCode: 'M-031', studentName: 'Student D', campusId: 'DEMO-031', phone: null, status: 'called', joinedAt: minutesAgo(9), calledAt: minutesAgo(1), completedAt: null },
  { id: 5, serviceId: 2, ticketCode: 'M-032', studentName: 'Student E', campusId: 'DEMO-032', phone: null, status: 'waiting', joinedAt: minutesAgo(5), calledAt: null, completedAt: null },
  { id: 6, serviceId: 3, ticketCode: 'F-088', studentName: 'Student F', campusId: 'DEMO-088', phone: null, status: 'waiting', joinedAt: minutesAgo(24), calledAt: null, completedAt: null },
  { id: 7, serviceId: 3, ticketCode: 'F-089', studentName: 'Student G', campusId: 'DEMO-089', phone: null, status: 'waiting', joinedAt: minutesAgo(11), calledAt: null, completedAt: null },
  { id: 8, serviceId: 4, ticketCode: 'H-014', studentName: 'Student H', campusId: 'DEMO-014', phone: null, status: 'called', joinedAt: minutesAgo(10), calledAt: minutesAgo(3), completedAt: null },
];

export const demoUsers = [];
let nextTokenId = 9;
let nextUserId = 1;

export function newDemoTokenId() {
  return nextTokenId++;
}

export function newDemoUserId() {
  return nextUserId++;
}
