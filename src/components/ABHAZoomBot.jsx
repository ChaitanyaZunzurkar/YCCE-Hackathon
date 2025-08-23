import { useState } from "react";

const API = "http://localhost:5050";

export default function AbhaSmartHealthcare() {
  // Form state
  const [createData, setCreateData] = useState({
    aadhaar: "",
    lastName: "",
    yob: "",
    gender: "F",
    mobile: "",
  });
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("123456");
  const [abhaIdRecords, setAbhaIdRecords] = useState("");
  const [abhaIdQR, setAbhaIdQR] = useState("");
  
  // API responses
  const [createOut, setCreateOut] = useState(null);
  const [linkOut, setLinkOut] = useState(null);
  const [recordsOut, setRecordsOut] = useState(null);
  const [qrOut, setQrOut] = useState(null);

  // Loading states
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);

  const handleCreate = async () => {
    setLoadingCreate(true);
    try {
      const body = {
        aadhaar: createData.aadhaar || "0000-0000-0000",
        lastName: createData.lastName || "Devi",
        yearOfBirth: createData.yob || "1987",
        gender: createData.gender,
        mobile: createData.mobile || "+91-9000000000",
      };
      const res = await fetch(`${API}/api/abha/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setCreateOut(data);
      if (data.abhaId) {
        setAbhaId(data.abhaId);
        setAbhaIdRecords(data.abhaId);
        setAbhaIdQR(data.abhaId);
      }
    } catch (e) {
      setCreateOut({ error: e.message });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleLink = async () => {
    setLoadingLink(true);
    try {
      const body = { abhaId, otp };
      const res = await fetch(`${API}/api/abha/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setLinkOut(data);
    } catch (e) {
      setLinkOut({ error: e.message });
    } finally {
      setLoadingLink(false);
    }
  };

  const handleRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch(`${API}/api/abha/records?abhaId=${encodeURIComponent(abhaIdRecords)}`);
      const data = await res.json();
      setRecordsOut(data);
    } catch (e) {
      setRecordsOut({ error: e.message });
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleQR = async () => {
    setLoadingQR(true);
    try {
      const res = await fetch(`${API}/api/abha/emergency-card?abhaId=${encodeURIComponent(abhaIdQR)}`);
      const data = await res.json();
      setQrOut(data);
    } catch (e) {
      setQrOut({ error: e.message });
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="text-center sticky top-0 bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h1 className="text-2xl font-bold">ABHA-Linked Smart Healthcare (USP Demo)</h1>
        <p className="text-sm text-gray-300 mt-1">ABDM Sandbox (Mock) • Create ABHA → Link → Fetch Records → Emergency QR</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create ABHA */}
        <section className="bg-gray-800 p-4 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold">1) Create ABHA (Mock)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Aadhaar (demo)</label>
              <input
                type="text"
                value={createData.aadhaar}
                onChange={(e) => setCreateData({...createData, aadhaar: e.target.value})}
                placeholder="0000-0000-0000"
                className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Last Name</label>
              <input
                type="text"
                value={createData.lastName}
                onChange={(e) => setCreateData({...createData, lastName: e.target.value})}
                placeholder="Devi"
                className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Year of Birth</label>
              <input
                type="text"
                value={createData.yob}
                onChange={(e) => setCreateData({...createData, yob: e.target.value})}
                placeholder="1987"
                className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Gender</label>
              <select
                value={createData.gender}
                onChange={(e) => setCreateData({...createData, gender: e.target.value})}
                className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
              >
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Mobile</label>
            <input
              type="text"
              value={createData.mobile}
              onChange={(e) => setCreateData({...createData, mobile: e.target.value})}
              placeholder="+91-9XXXXXXXXX"
              className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
            />
          </div>

          <button onClick={handleCreate} disabled={loadingCreate} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded-lg">
            {loadingCreate ? "Creating..." : "Create ABHA"}
          </button>
          {createOut && <pre className="bg-gray-900 p-2 rounded">{JSON.stringify(createOut, null, 2)}</pre>}
        </section>

        {/* Link/Verify */}
        <section className="bg-gray-800 p-4 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold">2) Link / Verify</h2>
          <label className="block mb-1 text-gray-300">ABHA ID</label>
          <input
            type="text"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            placeholder="(auto-filled after create)"
            className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          <label className="block mb-1 text-gray-300">OTP (any 6 digits)</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          <button onClick={handleLink} disabled={loadingLink} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded-lg">
            {loadingLink ? "Verifying..." : "Verify & Link"}
          </button>
          {linkOut && <pre className="bg-gray-900 p-2 rounded">{JSON.stringify(linkOut, null, 2)}</pre>}
        </section>

        {/* Fetch Records */}
        <section className="bg-gray-800 p-4 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold">3) Fetch Health Records</h2>
          <label className="block mb-1 text-gray-300">ABHA ID</label>
          <input
            type="text"
            value={abhaIdRecords}
            onChange={(e) => setAbhaIdRecords(e.target.value)}
            placeholder="(same as above)"
            className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
          />
          <button onClick={handleRecords} disabled={loadingRecords} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded-lg">
            {loadingRecords ? "Fetching..." : "Get Records"}
          </button>
          {recordsOut && <pre className="bg-gray-900 p-2 rounded">{JSON.stringify(recordsOut, null, 2)}</pre>}
        </section>

        {/* Emergency QR */}
        <section className="bg-gray-800 p-4 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold">4) Emergency QR</h2>
          <label className="block mb-1 text-gray-300">ABHA ID</label>
          <input
            type="text"
            value={abhaIdQR}
            onChange={(e) => setAbhaIdQR(e.target.value)}
            placeholder="(same as above)"
            className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
          />
          <button onClick={handleQR} disabled={loadingQR} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded-lg">
            {loadingQR ? "Generating..." : "Generate QR"}
          </button>
          {qrOut && (
            <div>
              {qrOut.essentials && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-gray-700 px-2 py-1 rounded-full">Blood Group: {qrOut.essentials.bloodGroup}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded-full">Allergies: {qrOut.essentials.allergies.join(", ")}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded-full">Emergency Contact: {qrOut.essentials.emergencyContact}</span>
                </div>
              )}
              {qrOut.qrDataUrl && <img src={qrOut.qrDataUrl} alt="Emergency QR" className="rounded-lg border border-gray-700" />}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
