'use client';

import { useState, useEffect } from 'react';

export default function DebugAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState<'welcome' | 'create-family'>('welcome');
  const [familyName, setFamilyName] = useState('');
  const [primaryUser, setPrimaryUser] = useState({ name: '', email: '' });

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog('Component mounted');
    addLog(`Initial step: ${step}`);
  }, []);

  const handleCreateFamily = () => {
    addLog('handleCreateFamily CALLED');
    addLog(`familyName: "${familyName}"`);
    addLog(`primaryUser.name: "${primaryUser.name}"`);
    
    if (familyName && primaryUser.name) {
      addLog('✅ Conditions met, setting step to add-members');
      setStep('add-members');
    } else {
      addLog('❌ Conditions NOT met');
    }
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    addLog(`Event triggered: ${e.type}`);
    handleCreateFamily();
  };

  if (step === 'add-members') {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ SUCCESS!</h1>
        <p className="text-lg">Step changed to add-members</p>
        <button 
          onClick={() => {
            setStep('create-family');
            setLogs([]);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Logs:</h2>
          {logs.map((log, i) => (
            <div key={i} className="text-sm font-mono">{log}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Auth Page</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Maak je gezin aan (DEBUG)</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jouw naam</label>
            <input
              type="text"
              value={primaryUser.name}
              onChange={(e) => {
                setPrimaryUser({ ...primaryUser, name: e.target.value });
                addLog(`Name changed to: ${e.target.value}`);
              }}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Bijv. Jan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={primaryUser.email}
              onChange={(e) => setPrimaryUser({ ...primaryUser, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="jan@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gezinsnaam</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => {
                setFamilyName(e.target.value);
                addLog(`Family name changed to: ${e.target.value}`);
              }}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Bijv. Het gezin van Jan"
            />
          </div>

          {/* Multiple button variants to test */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Test verschillende knoppen:</p>
            
            <button
              onClick={handleClick}
              disabled={!familyName || !primaryUser.name}
              className="w-full py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              1. Native button (onClick)
            </button>
            
            <button
              onTouchStart={handleClick}
              onClick={handleClick}
              disabled={!familyName || !primaryUser.name}
              className="w-full py-3 bg-green-500 text-white rounded-lg disabled:opacity-50"
            >
              2. Native button (onClick + onTouchStart)
            </button>
            
            <div
              onClick={handleClick}
              className={`w-full py-3 text-center rounded-lg cursor-pointer ${
                !familyName || !primaryUser.name 
                  ? 'bg-gray-300' 
                  : 'bg-purple-500 text-white'
              }`}
            >
              3. Div als knop
            </div>

            <button
              onMouseDown={handleClick}
              disabled={!familyName || !primaryUser.name}
              className="w-full py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
              4. Native button (onMouseDown)
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Live state:</h3>
          <div className="text-sm">
            <p>Step: {step}</p>
            <p>Name: "{primaryUser.name}"</p>
            <p>Family: "{familyName}"</p>
            <p>Button disabled: {(!familyName || !primaryUser.name).toString()}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded max-h-40 overflow-y-auto">
          <h3 className="font-bold mb-2">Event logs:</h3>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">Nog geen events...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-xs font-mono border-b border-gray-200 py-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
