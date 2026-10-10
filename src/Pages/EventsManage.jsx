// src/Pages/EventsManage.jsx
// Events → Manage (admins and editors): create and publish events, registrations,
// updates and recordings. Opened from the staff-only Manage tab on Events,
// instead of the Admin menu.
import React from 'react';
import AdminPanel from './admin/AdminPanel';
import { StaffGate } from '../components/SectionTabs';
import { EventsTabs } from './Events';

const EventsManage = () => (
  <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 box-content pt-4 sm:pt-6 lg:pt-8 pb-10">
    <StaffGate>
      <EventsTabs />
      <AdminPanel only="events" bare />
    </StaffGate>
  </main>
);

export default EventsManage;
