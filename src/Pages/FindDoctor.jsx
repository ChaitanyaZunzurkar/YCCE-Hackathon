import React, { useState } from 'react';

const doctorsData = [
  { name: 'Dr. Swarup P. Verma', specialty: 'Internal Medicine', hospital: 'Wockhardt Super Speciality Hospital, Shankar Nagar', experience: '17 साल', fee: '₹1,000' },
  { name: 'Dr. Nitin Wadaskar', specialty: 'Internal Medicine', hospital: 'Max Super Speciality Hospital, Mankapur', experience: '20 साल', fee: '₹750' },
  { name: 'Dr. Nimaj Agarwal', specialty: 'General Physician', hospital: 'Max Super Speciality Hospital, Mankapur (+1 location)', experience: '13 साल', fee: '₹800' },
  { name: 'Dr. Afzal Sheikh', specialty: 'General Physician', hospital: 'Nelson Hospital, Dhantoli', experience: '18 साल', fee: '₹800' },
  { name: 'Dr. Nitin Tiwari', specialty: 'Cardiologist', hospital: 'Wockhardt Super Speciality Hospital, Shankar Nagar', experience: '28 साल', fee: '₹1,000' },
  { name: 'Dr. Suryashree Pandey', specialty: 'Nephrologist', hospital: 'Wockhardt Super Speciality Hospital, Shankar Nagar', experience: '27 साल', fee: '₹1,000' },
  { name: 'Dr. Piyush Marudwar', specialty: 'Gastroenterologist', hospital: 'Wockhardt Super Speciality Hospital, Shankar Nagar', experience: '16 साल', fee: '₹1,200' },
  { name: 'Dr. Shrikant Jai', specialty: 'Urologist', hospital: 'Wockhardt Super Speciality Hospital, Shankar Nagar (+1 location)', experience: '15 साल', fee: '₹1,200' },
  { name: 'Dr. Kadoo Priyanka Vijay', specialty: 'Gynecologist / Obstetrician', hospital: 'Birla Fertility & IVF, Sitabuldi', experience: '19 साल', fee: '₹800' },
  { name: 'Dr. Dipti Shinde', specialty: 'Gynaecologist', hospital: 'Wockhardt Super Speciality Hospital, Nagpur', experience: '15 साल', fee: '₹1,000' },
  { name: 'Dr. Riya Mangtani', specialty: 'Gynaecologist', hospital: 'Wockhardt Super Speciality Hospital, Nagpur', experience: '11 साल', fee: '₹800' },
  { name: 'Dr. Shantanu S Pendse', specialty: 'Oncologist', hospital: 'HCG NCHRI Cancer Centre, Nagpur', experience: '9 साल', fee: 'N/A' },
  { name: 'Dr. Nishad Dhakate', specialty: 'Hemato-Oncologist', hospital: 'HCG NCHRI Cancer Centre, Nagpur', experience: '9 साल', fee: '₹950' },
  { name: 'Dr. Ajay Mehta', specialty: 'Surgical Oncologist', hospital: 'HCG NCHRI Cancer Centre, Nagpur', experience: '36 साल', fee: '₹950' },
  { name: 'Dr. Sidharth Saoji', specialty: 'ENT Specialist', hospital: 'Wockhardt Super Speciality Hospital, Nagpur', experience: '8 साल', fee: '₹800' },
  { name: 'Dr. Hemant Chhajed', specialty: 'General Surgeon', hospital: 'Wockhardt Super Speciality Hospital, Nagpur', experience: '24 साल', fee: '₹1,000' },
  { name: 'Dr. Ram Godeswar', specialty: 'Cardiologist', hospital: 'CARE Hospital, Nagpur', experience: '34 साल', fee: '₹600' },
  { name: 'Dr. Varun Bhargava', specialty: 'Cardiologist', hospital: 'CARE Hospital, Nagpur', experience: '22 साल', fee: '₹800' },
];

const domains = ['Cardiologist', 'Gynaecologist', 'General Physician', 'Oncologist'];

export default function FindDoctor() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    setSelectedDomain(searchInput);
  };

  const filteredDoctors = doctorsData.filter(doc =>
    selectedDomain ? doc.specialty.toLowerCase().includes(selectedDomain.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">Find a Doctor</h1>

      <div className="flex flex-row md:flex-row justify-center gap-4 mb-6 items-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by specialty..."
          className="px-4 py-2 border border-black placeholder-black rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-600 "
        />
     {/* <button
  onClick={handleSearch}
  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-700 transition"
>
  Search
</button> */}
<button
  onClick={handleSearch}
  className="px-8 py-1 bg-gradient-to-r from-sky-500 to-blue-700 text-white font-semibold rounded-lg shadow-ld hover:from-blue-600 hover:to-sky-500 hover:shadow-lg transition"
>
  Search
</button>


      </div>

      {/* <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {domains.map((domain, index) => (
          <button
            key={index}
            onClick={() => setSelectedDomain(domain)}
            className={`px-4 py-2 rounded-full border ${selectedDomain === domain ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} hover:bg-blue-200 transition`}
          >
            {domain}
          </button>
        ))}
        {selectedDomain && (
          <button
            onClick={() => setSelectedDomain('')}
            className="px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            Clear
          </button>
        )}
      </div> */}
<div className="flex justify-center gap-16 mb-6 flex-wrap">
  {domains.map((domain, index) => (
    <button
      key={index}
      onClick={() => setSelectedDomain(domain)}
      className={`px-4 py-2 rounded-full border transition 
        ${selectedDomain === domain 
          ? 'bg-gradient-to-r from-sky-200 via-white to-blue-700 text-white' 
          : 'bg-gradient-to-r from-sky-500 to-blue-700 text-white hover:opacity-90'}`}
    >
      {domain}
    </button>
  ))}
  {selectedDomain && (
    <button
      onClick={() => setSelectedDomain('')}
      className="px-4 py-2 rounded-full bg-red-500 text-white hover:opacity-90 transition"
    >
      Clear
    </button>
  )}
</div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doc, index) => (
          <div key={index} className="bg-blue-100 border border-blue-200 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-900">{doc.name}</h2>
            <p className="text-blue-700 font-medium">{doc.specialty}</p>
            <p className="text-sm text-blue-600">{doc.hospital}</p>
            <p className="text-sm text-blue-600">Experience: {doc.experience}</p>
            <p className="text-sm font-bold text-blue-800">Fee: {doc.fee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
