import React, { useState } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const doctorsData = {
  Cardiology: [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', location: 'New York', phone: '555-1111' },
    { id: 2, name: 'Dr. Jones', specialty: 'Cardiology', location: 'Los Angeles', phone: '555-2222' },
  ],
  Dermatology: [
    { id: 3, name: 'Dr. Davis', specialty: 'Dermatology', location: 'Chicago', phone: '555-3333' },
    { id: 4, name: 'Dr. Miller', specialty: 'Dermatology', location: 'Houston', phone: '555-4444' },
  ],
  Pediatrics: [
    { id: 5, name: 'Dr. Garcia', specialty: 'Pediatrics', location: 'Phoenix', phone: '555-5555' },
    { id: 6, name: 'Dr. Rodriguez', specialty: 'Pediatrics', location: 'Philadelphia', phone: '555-6666' },
  ],
  Neurology: [
    { id: 7, name: 'Dr. Martinez', specialty: 'Neurology', location: 'San Antonio', phone: '555-7777' },
    { id: 8, name: 'Dr. Hernandez', specialty: 'Neurology', location: 'San Diego', phone: '555-8888' },
  ],
};

export default function FindDoctor() {
  const [selectedDomain, setSelectedDomain] = useState('Cardiology');

  const doctorsInDomain = doctorsData[selectedDomain] || [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-sky-200">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Find a Doctor by Specialty
        </h1>

        <div className="mb-8">
          <label htmlFor="domain-select" className="mr-2 text-gray-700 font-medium">
            Select a Specialty:
          </label>
          <select
            id="domain-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(doctorsData).map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {doctorsInDomain.length > 0 ? (
            doctorsInDomain.map((doctor) => (
              <div key={doctor.id} className="bg-white p-4 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">{doctor.name}</h2>
                <p className="text-gray-700">Specialty: {doctor.specialty}</p>
                <p className="text-gray-700">Location: {doctor.location}</p>
                <p className="text-gray-700">Phone: {doctor.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No doctors found for this specialty.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
