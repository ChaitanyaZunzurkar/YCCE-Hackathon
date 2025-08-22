import React from "react";

export default function Emergency() {
  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-2">🚨 Emergency Services</h1>
      <p className="text-gray-700 mb-4">
        Quick access to emergency help and resources
      </p>

      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded text-blue-800">
        ⚠️ In case of life-threatening emergency, call <strong>108</strong> immediately for ambulance service.
      </div>

      {/* Emergency Numbers + When to Call */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Numbers */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">📞 Emergency Numbers</h2>
          <div className="space-y-4">
            {[
              { number: "108", title: "Medical Emergency", desc: "24/7 Ambulance Service" },
              { number: "100", title: "Police Emergency", desc: "Police Helpline" },
              { number: "101", title: "Fire Emergency", desc: "Fire Department" },
              { number: "1091", title: "Women Helpline", desc: "Women in Distress" },
              { number: "1098", title: "Child Helpline", desc: "Child Protection" },
            ].map((item) => (
              <a key={item.number} href={`tel:${item.number}`} className="block bg-blue-500 text-white p-4 rounded-lg shadow flex justify-between items-center hover:bg-blue-600 transition">
                <div>
                  <div className="text-xl font-bold">{item.number}</div>
                  <div className="text-sm">{item.title}</div>
                  <div className="text-xs opacity-80">{item.desc}</div>
                </div>
                <span className="text-2xl">📞</span>
              </a>
            ))}
          </div>
        </div>

        {/* When to Call Emergency */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-500 mb-3">⏱️ When to Call Emergency Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heart Problems */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <h3 className="font-semibold text-blue-600 mb-2">❤️ Heart Problems</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Severe chest pain</li>
                <li>Difficulty breathing</li>
                <li>Irregular heartbeat</li>
                <li>Sudden weakness</li>
              </ul>
            </div>

            {/* High Fever */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <h3 className="font-semibold text-blue-600 mb-2">🌡️ High Fever</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Temperature above 103°F (39.4°C)</li>
                <li>Severe headache</li>
                <li>Difficulty breathing</li>
                <li>Confusion</li>
              </ul>
            </div>

            {/* Severe Bleeding */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <h3 className="font-semibold text-blue-600 mb-2">🩸 Severe Bleeding</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Uncontrolled bleeding</li>
                <li>Deep cuts</li>
                <li>Blood from mouth/nose</li>
                <li>Signs of shock</li>
              </ul>
            </div>

            {/* Poisoning */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <h3 className="font-semibold text-blue-600 mb-2">☠️ Poisoning</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Difficulty breathing</li>
                <li>Vomiting</li>
                <li>Seizures</li>
                <li>Unconsciousness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Basic First Aid + Location Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Location Info */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">📍 Location Info</h2>
          <p className="text-sm text-gray-700 mb-2">When calling for emergency services, be ready to provide:</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Your exact location/village name</li>
            <li>Nature of emergency</li>
            <li>Number of people affected</li>
            <li>Your contact number</li>
          </ul>
        </div>

        {/* Basic First Aid */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">🧰 Basic First Aid</h2>

          {/* Heart Attack */}
          <div className="bg-blue-50 p-3 mb-3 rounded">
            <h3 className="text-blue-700 font-semibold mb-2">💓 Heart Attack</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
              <li>Call 108 immediately</li>
              <li>Help person sit down and rest</li>
              <li>Give aspirin if available and not allergic</li>
              <li>Monitor breathing and pulse</li>
            </ol>
          </div>

          {/* Severe Bleeding */}
          <div className="bg-blue-50 p-3 mb-3 rounded">
            <h3 className="text-blue-700 font-semibold mb-2">🩸 Severe Bleeding</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
              <li>Apply direct pressure with clean cloth</li>
              <li>Elevate injured area above heart level</li>
              <li>Do not remove embedded objects</li>
              <li>Get medical help immediately</li>
            </ol>
          </div>

          {/* High Fever */}
          <div className="bg-blue-50 p-3 mb-3 rounded">
            <h3 className="text-blue-700 font-semibold mb-2">🌡️ High Fever</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
              <li>Remove excess clothing</li>
              <li>Apply cool, wet cloths to forehead</li>
              <li>Give plenty of fluids</li>
              <li>Seek medical attention if over 103°F</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
