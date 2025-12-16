export default function TestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green', fontSize: '32px' }}>✅ Test Page - Next.js Fonctionne !</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        Si vous voyez ce message, Next.js fonctionne correctement.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Informations :</h2>
        <ul>
          <li>Next.js est démarré ✅</li>
          <li>Le routage fonctionne ✅</li>
          <li>Le rendu React fonctionne ✅</li>
        </ul>
      </div>
      <div style={{ marginTop: '30px' }}>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          → Aller à la page de login
        </a>
      </div>
    </div>
  )
}


